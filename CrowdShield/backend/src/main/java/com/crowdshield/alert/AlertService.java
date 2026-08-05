package com.crowdshield.alert;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;

    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    public Alert createAlert(String type, String location, String description) {
        Alert alert = Alert.builder()
                .type(type)
                .location(location)
                .description(description)
                .createdAt(LocalDateTime.now())
                .resolved(false)
                .build();
        return alertRepository.save(alert);
    }

    public Alert resolveAlert(Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found with id: " + id));
        alert.setResolved(true);
        return alertRepository.save(alert);
    }
}
