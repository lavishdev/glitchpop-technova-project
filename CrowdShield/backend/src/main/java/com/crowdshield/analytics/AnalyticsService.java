package com.crowdshield.analytics;

import com.crowdshield.alert.AlertDto;
import com.crowdshield.alert.AlertService;
import com.crowdshield.alert.AlertSeverity;
import com.crowdshield.analytics.dto.PredictionRequestDto;
import com.crowdshield.crowd.CrowdHistory;
import com.crowdshield.crowd.CrowdHistoryRepository;
import com.crowdshield.notification.NotificationService;
import com.crowdshield.recommendation.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final CrowdHistoryRepository crowdHistoryRepository;
    private final AlertService alertService;
    private final NotificationService notificationService;
    private final RecommendationService recommendationService;
    private final SimpMessagingTemplate messagingTemplate;

    public AlertDto processPrediction(PredictionRequestDto request) {
        // Calculate risk score based on inputs
        double riskScore = calculateRiskScore(request);

        // 1. Save Crowd History
        CrowdHistory history = CrowdHistory.builder()
                .cameraId(request.getCameraId())
                .zone("AI-Detected Zone") // Default zone, could be fetched from Camera DB
                .density(request.getDensity())
                .riskScore(riskScore)
                .timestamp(LocalDateTime.now())
                .build();
        crowdHistoryRepository.save(history);

        // 2. Broadcast live data
        Map<String, Object> liveData = new HashMap<>();
        liveData.put("timestamp", history.getTimestamp().toString());
        liveData.put("cameraId", history.getCameraId());
        liveData.put("density", history.getDensity());
        liveData.put("riskScore", riskScore);
        
        List<String> recommendations = recommendationService.getRecommendationsForRisk(request.getDensity(), request.getViolenceScore(), request.getFireScore(), request.getSmokeScore());
        liveData.put("recommendations", recommendations);

        messagingTemplate.convertAndSend("/topic/live-heatmap", liveData);

        // 3. Threshold Checks & Alerts
        AlertDto alert = null;
        if (request.getFireScore() > 0.8) {
            alert = createAndBroadcastAlert("FIRE_DETECTED", "High probability of fire detected at " + request.getCameraId(), AlertSeverity.CRITICAL);
        } else if (request.getViolenceScore() > 0.75) {
            alert = createAndBroadcastAlert("VIOLENCE_DETECTED", "Violence detected at " + request.getCameraId(), AlertSeverity.HIGH);
        } else if (request.getSmokeScore() > 0.85) {
            alert = createAndBroadcastAlert("SMOKE_DETECTED", "Smoke detected at " + request.getCameraId(), AlertSeverity.HIGH);
        } else if (request.getDensity() > 250) {
            alert = createAndBroadcastAlert("OVERCROWDING", "Critical crowd density at " + request.getCameraId(), AlertSeverity.HIGH);
        }

        return alert; // Return the generated alert (if any)
    }

    private double calculateRiskScore(PredictionRequestDto request) {
        double score = (request.getDensity() / 300.0) * 40; // Max 40 from density
        score += request.getViolenceScore() * 30; // Max 30 from violence
        score += request.getFireScore() * 20; // Max 20 from fire
        score += request.getSmokeScore() * 10; // Max 10 from smoke
        return Math.min(100.0, score);
    }

    private AlertDto createAndBroadcastAlert(String type, String message, AlertSeverity severity) {
        AlertDto alert = alertService.createAlert(type, "AI Camera", message, severity);
        
        messagingTemplate.convertAndSend("/topic/alerts", alert);
        
        notificationService.sendPushNotification(
                "AI ALERT: " + type, 
                message, 
                severity.name()
        );
        return alert;
    }
}
