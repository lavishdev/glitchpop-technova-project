package com.crowdshield.assistant;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AssistantService {

    private static final Logger logger = LoggerFactory.getLogger(AssistantService.class);
    
    private final RestTemplate restTemplate;
    private final com.crowdshield.dashboard.DashboardService dashboardService;

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    public String askAssistant(Map<String, Object> requestPayload) {
        try {
            // Build real context from the backend state
            var summary = dashboardService.getDashboardSummary();
            Map<String, Object> liveContext = new java.util.HashMap<>();
            liveContext.put("total_alerts", summary.getTotalAlerts());
            liveContext.put("active_incidents", summary.getActiveIncidents());
            liveContext.put("avg_density", summary.getAverageCrowdDensity());
            liveContext.put("online_cameras", summary.getOnlineCameras());

            Map<String, Object> body = new java.util.HashMap<>();
            body.put("query", requestPayload.get("query"));
            body.put("context", liveContext);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    aiServiceUrl + "/chat",
                    body,
                    Map.class
            );
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (String) response.getBody().getOrDefault("response", "No response received.");
            }
            return "Failed to get a valid response from the AI Service.";
        } catch (Exception e) {
            logger.error("Error communicating with AI Service: ", e);
            return "I am unable to connect to the AI analysis engine right now. Please try again later.";
        }
    }
}
