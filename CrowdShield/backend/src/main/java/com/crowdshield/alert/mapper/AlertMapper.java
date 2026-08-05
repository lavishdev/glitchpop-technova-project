package com.crowdshield.alert.mapper;

import com.crowdshield.alert.Alert;
import com.crowdshield.alert.dto.AlertDto;
import org.springframework.stereotype.Component;

@Component
public class AlertMapper {

    public AlertDto toDto(Alert alert) {
        if (alert == null) {
            return null;
        }
        return AlertDto.builder()
                .id(alert.getId())
                .type(alert.getType())
                .message(alert.getMessage())
                .location(alert.getLocation())
                .severity(alert.getSeverity())
                .createdAt(alert.getCreatedAt())
                .isRead(alert.isRead())
                .build();
    }
}
