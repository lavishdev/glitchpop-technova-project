package com.crowdshield.dashboard.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardSummaryDto {
    private Long totalAlerts;
    private Long activeAlerts;
    private Long totalIncidents;
    private Long activeIncidents;
    private Long registeredUsers;
    private Long onlineCameras;
    private Long totalCameras;
    private Double averageCrowdDensity;
}
