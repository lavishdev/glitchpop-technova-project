package com.crowdshield.incident.dto;

import com.crowdshield.incident.IncidentSeverity;
import com.crowdshield.incident.IncidentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class IncidentDto {
    private Long id;
    private String title;
    private String description;
    private IncidentSeverity severity;
    private IncidentStatus status;
    private String location;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
