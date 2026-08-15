package com.crowdshield.analytics;

import com.crowdshield.alert.AlertService;
import com.crowdshield.alert.AlertSeverity;
import com.crowdshield.crowd.CrowdHistory;
import com.crowdshield.crowd.CrowdHistoryRepository;
import com.crowdshield.incident.Incident;
import com.crowdshield.incident.IncidentRepository;
import com.crowdshield.incident.IncidentStatus;
import com.crowdshield.simulation.AppModeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final RestTemplate restTemplate;
    private final CrowdHistoryRepository crowdHistoryRepository;
    private final AlertService alertService;
    private final IncidentRepository incidentRepository;
    private final com.crowdshield.camera.CameraRepository cameraRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final AppModeService appModeService;

    @org.springframework.beans.factory.annotation.Value("${ai.service.public.url:http://10.43.17.1:8000}")
    private String aiServicePublicUrl;

    private Map<String, Object> latestAnalysisResult = null;

    private static final String FASTAPI_UPLOAD_URL = "http://127.0.0.1:8000/upload-video";

    public Map<String, Object> getLatestAnalysis() {
        return latestAnalysisResult;
    }

    public Map<String, Object> processVideoUpload(MultipartFile file) {
        try {
            // Forward multipart file to FastAPI
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            });

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            log.info("Sending video {} to FastAPI for AI analysis...", file.getOriginalFilename());
            ResponseEntity<Map> response = restTemplate.postForEntity(FASTAPI_UPLOAD_URL, requestEntity, Map.class);
            Map<String, Object> responseBody = response.getBody();

            if (response.getStatusCode().is2xxSuccessful() && responseBody != null) {
                log.info("Received successful response from FastAPI for {}", file.getOriginalFilename());
                handleAiResponse(responseBody, file.getOriginalFilename());
                return responseBody;
            } else {
                throw new RuntimeException("FastAPI returned error: " + response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("Failed to process video upload via FastAPI", e);
            throw new RuntimeException("AI Processing Failed: " + e.getMessage());
        }
    }

    private void handleAiResponse(Map<String, Object> aiResult, String originalFilename) {
        // 1. Disable mock simulator since we have real data
        appModeService.setSimulatorEnabled(false);

        // Extract metadata for the Camera
        Map<String, Object> uploadMeta = (Map<String, Object>) aiResult.get("upload");
        String uniqueFilename = uploadMeta != null ? (String) uploadMeta.get("filename") : originalFilename;
        String videoUrl = aiServicePublicUrl + "/uploads/" + uniqueFilename;
        String analysisId = uniqueFilename;

        String zoneLocation = "Main Square";
        String camName = "CAM-01 • " + zoneLocation;

        // 2. Create or Update Virtual Camera
        com.crowdshield.camera.Camera virtualCam = com.crowdshield.camera.Camera.builder()
                .name(camName)
                .location(zoneLocation)
                .zone(zoneLocation)
                .status(com.crowdshield.camera.CameraStatus.ONLINE)
                .lastSeen(LocalDateTime.now())
                .healthPercentage(100.0)
                .resolution("1080p AI")
                .fps(30)
                .videoUrl(videoUrl)
                .analysisId(analysisId)
                .build();
        cameraRepository.save(virtualCam);

        // 3. Extract Data
        Map<String, Object> densityMeta = (Map<String, Object>) aiResult.get("crowd_density");
        Map<String, Object> riskMeta = (Map<String, Object>) aiResult.get("risk_assessment");
        List<Map<String, Object>> alerts = (List<Map<String, Object>>) aiResult.get("alerts");
        Map<String, Object> incidentReport = (Map<String, Object>) aiResult.get("incident_report");

        // Safely extract values
        int density = densityMeta != null && densityMeta.get("average_people") != null ? 
            ((Number) densityMeta.get("average_people")).intValue() : 0;
            
        double riskScore = riskMeta != null && riskMeta.get("risk_score") != null ? 
            ((Number) riskMeta.get("risk_score")).doubleValue() * 100.0 : 0.0;

        // 4. Persist CrowdHistory
        CrowdHistory history = CrowdHistory.builder()
            .cameraId(camName)
            .zone(zoneLocation)
            .location(zoneLocation)
            .density(density)
            .riskScore(riskScore)
            .timestamp(LocalDateTime.now())
            .build();
        crowdHistoryRepository.save(history);

        // 4. Persist Alerts
        if (alerts != null) {
            for (Map<String, Object> a : alerts) {
                String title = (String) a.get("title");
                String message = (String) a.get("message");
                String severityStr = (String) a.get("severity");
                AlertSeverity severity = parseSeverity(severityStr);
                
                com.crowdshield.alert.dto.AlertDto savedAlert = alertService.createAlert("AI_DETECT", zoneLocation, title + ": " + message, severity);
                messagingTemplate.convertAndSend("/topic/alerts", savedAlert);
            }
        }

        // 5. Create Incident if risk is high
        String overallRisk = riskMeta != null ? (String) riskMeta.get("overall_risk") : "SAFE";
        if ("HIGH".equals(overallRisk) || "CRITICAL".equals(overallRisk)) {
            Incident incident = Incident.builder()
                .title("AI Detected High Risk Situation")
                .description(incidentReport != null ? (String) incidentReport.get("summary") : "No summary")
                .location(zoneLocation)
                .status(IncidentStatus.OPEN)
                .severity(com.crowdshield.incident.IncidentSeverity.valueOf(parseSeverity(overallRisk).name()))
                .createdAt(LocalDateTime.now())
                .build();
            incidentRepository.save(incident);
        }

        // 6. Broadcast updated state to Live Heatmap
        Map<String, Object> liveData = new HashMap<>();
        liveData.put("timestamp", LocalDateTime.now().toString());
        liveData.put("location", zoneLocation);
        liveData.put("density", density);
        liveData.put("riskScore", String.format("%.1f", riskScore));
        liveData.put("riskLevel", overallRisk);
        liveData.put("ai_result", aiResult); // Send full result for frontend to render heatmaps

        // Build absolute heatmap URL for clients
        Map<String, Object> heatmapsMeta = (Map<String, Object>) aiResult.get("heatmaps");
        if (heatmapsMeta != null && heatmapsMeta.get("heatmaps_directory") != null) {
            String dir = (String) heatmapsMeta.get("heatmaps_directory");
            liveData.put("heatmapUrl", aiServicePublicUrl + dir + "/heatmap_000001.jpg");
        }

        this.latestAnalysisResult = liveData;
        messagingTemplate.convertAndSend("/topic/live-heatmap", liveData);
    }

    private AlertSeverity parseSeverity(String severity) {
        if (severity == null) return AlertSeverity.MEDIUM;
        try {
            return AlertSeverity.valueOf(severity.toUpperCase());
        } catch (IllegalArgumentException e) {
            return AlertSeverity.HIGH;
        }
    }
}
