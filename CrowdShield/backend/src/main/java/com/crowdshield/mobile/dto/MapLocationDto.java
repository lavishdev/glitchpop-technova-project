package com.crowdshield.mobile.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MapLocationDto {
    private Long id;
    private Double latitude;
    private Double longitude;
    private Double crowdDensity;
    private String riskLevel;
    private Boolean activeAlert;
}
