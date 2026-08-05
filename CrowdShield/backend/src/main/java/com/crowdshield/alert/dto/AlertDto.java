package com.crowdshield.alert.dto;

import com.crowdshield.alert.AlertSeverity;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AlertDto {
    private Long id;
    private String type;
    private String message;
    private String location;
    private AlertSeverity severity;
    private LocalDateTime createdAt;
    private boolean isRead;
}
