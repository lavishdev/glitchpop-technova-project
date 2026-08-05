package com.crowdshield.analytics;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/webhook/ai")
@RequiredArgsConstructor
public class WebhookController {

    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/heatmap")
    public ResponseEntity<String> receiveHeatmapData(@RequestBody Map<String, Object> payload) {
        // Broadcast the real AI data to connected clients
        messagingTemplate.convertAndSend("/topic/live-heatmap", payload);
        return ResponseEntity.ok("Heatmap data processed");
    }

    @PostMapping("/alert")
    public ResponseEntity<String> receiveAiAlert(@RequestBody Map<String, Object> alertPayload) {
        // Broadcast the AI alert
        messagingTemplate.convertAndSend("/topic/alerts", alertPayload);
        return ResponseEntity.ok("Alert broadcasted");
    }
}

