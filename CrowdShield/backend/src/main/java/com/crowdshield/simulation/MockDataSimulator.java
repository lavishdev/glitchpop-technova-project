package com.crowdshield.simulation;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class MockDataSimulator {

    private final SimpMessagingTemplate messagingTemplate;
    private final Random random = new Random();

    @Scheduled(fixedRate = 5000) // Every 5 seconds
    public void simulateLiveCrowdData() {
        Map<String, Object> data = new HashMap<>();
        data.put("timestamp", LocalDateTime.now().toString());
        data.put("location", "Main Square");
        
        // Randomly fluctuate density between 50 and 200
        int density = 50 + random.nextInt(150);
        data.put("density", density);
        
        // Calculate a fake risk score based on density
        double riskScore = Math.min(100.0, (density / 200.0) * 100.0 + random.nextDouble() * 5);
        data.put("riskScore", String.format("%.1f", riskScore));
        
        messagingTemplate.convertAndSend("/topic/live-heatmap", data);
        
        // Simulate random alerts if density is very high
        if (density > 180) {
            Map<String, Object> alert = new HashMap<>();
            alert.put("timestamp", LocalDateTime.now().toString());
            alert.put("type", "OVERCROWDING");
            alert.put("message", "High crowd density detected at Main Square.");
            messagingTemplate.convertAndSend("/topic/alerts", alert);
        }
    }
}

