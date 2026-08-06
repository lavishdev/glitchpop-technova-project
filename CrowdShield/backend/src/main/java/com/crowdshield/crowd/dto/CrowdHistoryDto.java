package com.crowdshield.crowd.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CrowdHistoryDto {
    private Long id;
    private String cameraId;
    private String zone;
    private int density;
    private double riskScore;
    private LocalDateTime timestamp;
}
