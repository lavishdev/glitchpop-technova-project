package com.crowdshield.mobile.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MobileHomeDto {
    private VenueInfo venue;
    private MobileMetrics metrics;
    private MobileRecommendation recommendation;

    @Data
    @Builder
    public static class VenueInfo {
        private String name;
        private String status;
        private String severity;
    }

    @Data
    @Builder
    public static class MobileMetrics {
        private Long peopleCount;
        private Double crowdDensity;
        private String riskLevel;
        private Long activeAlerts;
    }

    @Data
    @Builder
    public static class MobileRecommendation {
        private String title;
        private String message;
    }
}
