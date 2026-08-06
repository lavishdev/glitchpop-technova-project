package com.crowdshield.dashboard.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ZoneAnalyticsDto {
    private String zoneId;
    private String zoneName;
    private Integer capacityPercentage;
    private Integer currentDensity;
    private Integer maxCapacity;
    private Double dwellTimeMinutes;
    private Integer flowRateIn;
    private Integer flowRateOut;
    private String status;
}
