package com.crowdshield.alert;

import com.crowdshield.alert.dto.AlertDto;
import com.crowdshield.alert.mapper.AlertMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;
    private final AlertMapper alertMapper;
    private final com.crowdshield.activity.ActivityLogService activityLogService;

    public Page<AlertDto> getAllAlerts(String type, AlertSeverity severity, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return alertRepository.findFilteredAlerts(type, severity, startDate, endDate, pageable)
                .map(alertMapper::toDto);
    }

    public Page<AlertDto> getUnreadAlerts(Pageable pageable) {
        return alertRepository.findByIsReadFalse(pageable)
                .map(alertMapper::toDto);
    }

    public AlertDto createAlert(String type, String location, String message, AlertSeverity severity) {
        Alert alert = Alert.builder()
                .type(type)
                .location(location)
                .message(message)
                .severity(severity)
                .createdAt(LocalDateTime.now())
                .isRead(false)
                .build();
        Alert saved = alertRepository.save(alert);
        activityLogService.logActivity(getUsername(), com.crowdshield.activity.ActivityAction.ALERT_CREATED, "Created alert: " + saved.getType());
        return alertMapper.toDto(saved);
    }

    public AlertDto markAsRead(Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found with id: " + id));
        alert.setRead(true);
        return alertMapper.toDto(alertRepository.save(alert));
    }

    public void deleteAlert(Long id) {
        if (!alertRepository.existsById(id)) {
            throw new IllegalArgumentException("Alert not found with id: " + id);
        }
        alertRepository.deleteById(id);
    }
    
    private String getUsername() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        return (auth != null && auth.getName() != null) ? auth.getName() : "system";
    }
}
