package com.crowdshield.simulation;

import com.crowdshield.alert.Alert;
import com.crowdshield.alert.AlertService;
import com.crowdshield.notification.NotificationService;
import com.crowdshield.recommendation.RecommendationService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class MockDataSimulator {

    private final SimpMessagingTemplate messagingTemplate;
    private final AlertService alertService;
    private final NotificationService notificationService;
    private final RecommendationService recommendationService;
    
    private final Random random = new Random();

    @Scheduled(fixedRate = 5000) // Every 5 seconds
    public void simulateLiveCrowdData() {
        Map<String, Object> data = new HashMap<>();
        data.put("timestamp", LocalDateTime.now().toString());
        data.put("location", "Main Square");
        
        // Randomly fluctuate density between 50 and 250
        int density = 50 + random.nextInt(200);
        data.put("density", density);
        
        // Calculate a fake risk score based on density
        double riskScore = Math.min(100.0, (density / 250.0) * 100.0 + random.nextDouble() * 5);
        data.put("riskScore", String.format("%.1f", riskScore));
        
        // Get recommendations based on density
        List<String> recommendations = recommendationService.getRecommendationsForDensity(density);
        data.put("recommendations", recommendations);
        
        messagingTemplate.convertAndSend("/topic/live-heatmap", data);
        
        // Simulate random alerts if density is critically high (e.g., > 220)
        if (density > 220) {
            String description = "Critical crowd density detected at Main Square. Immediate action recommended.";
            
            // 1. Create alert in database
            Alert alert = alertService.createAlert("OVERCROWDING", "Main Square", description);
            
            // 2. Broadcast via WebSocket
            messagingTemplate.convertAndSend("/topic/alerts", alert);
            
            // 3. Send mock push notification to mobile app
            notificationService.sendPushNotification(
                    "OVERCROWDING ALERT", 
                    "Main Square density is critical!", 
                    "URGENT"
            );
        }
    }
}
