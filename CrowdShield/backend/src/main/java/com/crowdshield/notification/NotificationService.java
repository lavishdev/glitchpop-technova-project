package com.crowdshield.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Simulates sending a Firebase Cloud Messaging push notification.
     * For the MVP, we just broadcast it over the WebSocket to the mobile app/dashboard.
     */
    public void sendPushNotification(String title, String body, String type) {
        log.info("Sending FCM Push Notification - Title: {}, Body: {}", title, body);
        
        Map<String, String> notification = new HashMap<>();
        notification.put("title", title);
        notification.put("body", body);
        notification.put("type", type);
        
        // Broadcast over websocket so the connected flutter app receives it immediately
        messagingTemplate.convertAndSend("/topic/notifications", notification);
    }
}
