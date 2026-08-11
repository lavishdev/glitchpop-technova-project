package com.crowdshield.mobile;

import com.crowdshield.activity.ActivityLogService;
import com.crowdshield.activity.ActivityAction;
import com.crowdshield.dashboard.DashboardService;
import com.crowdshield.dashboard.dto.DashboardSummaryDto;
import com.crowdshield.dashboard.dto.ZoneAnalyticsDto;
import com.crowdshield.incident.IncidentService;
import com.crowdshield.incident.IncidentSeverity;
import com.crowdshield.incident.dto.IncidentCreateDto;
import com.crowdshield.mobile.dto.MapLocationDto;
import com.crowdshield.mobile.dto.MobileHomeDto;
import com.crowdshield.mobile.dto.ReportIncidentDto;
import com.crowdshield.mobile.dto.SosRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MobileService {

    private final DashboardService dashboardService;
    private final IncidentService incidentService;
    private final ActivityLogService activityLogService;

    public MobileHomeDto getHomeData() {
        DashboardSummaryDto summary = dashboardService.getDashboardSummary();
        
        String status = summary.getAverageCrowdDensity() > 80 ? "High Density Warning" : "Normal Operation";
        String severity = summary.getAverageCrowdDensity() > 80 ? "HIGH" : "NORMAL";
        String riskLevel = summary.getAverageCrowdDensity() > 80 ? "HIGH" : "LOW";

        return MobileHomeDto.builder()
                .venue(MobileHomeDto.VenueInfo.builder()
                        .name("TechNova Arena")
                        .status(status)
                        .severity(severity)
                        .build())
                .metrics(MobileHomeDto.MobileMetrics.builder()
                        .peopleCount((long) (summary.getAverageCrowdDensity() * 10)) // mock conversion
                        .crowdDensity(summary.getAverageCrowdDensity())
                        .riskLevel(riskLevel)
                        .activeAlerts(summary.getActiveAlerts())
                        .build())
                .recommendation(MobileHomeDto.MobileRecommendation.builder()
                        .title("System Recommendation")
                        .message("Use Gate 4 due to congestion near Gate 2.")
                        .build())
                .build();
    }

    public List<MapLocationDto> getMapData() {
        List<ZoneAnalyticsDto> zones = dashboardService.getZoneAnalytics();
        
        // MVP: Mapping zones to static map coordinates since we lack true DB coords
        return zones.stream().map(zone -> {
            double lat = 30.768 + (Math.random() * 0.01 - 0.005);
            double lng = 76.575 + (Math.random() * 0.01 - 0.005);
            return MapLocationDto.builder()
                    .id((long) zone.getZoneId().hashCode())
                    .latitude(lat)
                    .longitude(lng)
                    .crowdDensity((double) zone.getCurrentDensity())
                    .riskLevel(zone.getStatus().equalsIgnoreCase("critical") ? "HIGH" : "LOW")
                    .activeAlert(zone.getStatus().equalsIgnoreCase("critical"))
                    .build();
        }).collect(Collectors.toList());
    }

    public void handleSos(SosRequestDto dto, String username) {
        String locationStr = String.format("Lat: %.4f, Lng: %.4f", dto.getLatitude(), dto.getLongitude());
        
        IncidentCreateDto incident = new IncidentCreateDto();
        incident.setTitle("SOS Alert - Immediate Response Required");
        incident.setDescription(dto.getMessage());
        incident.setLocation(locationStr);
        incident.setSeverity(IncidentSeverity.CRITICAL);
        
        incidentService.reportIncident(incident);
        activityLogService.logActivity(username, ActivityAction.INCIDENT_CREATED, "Triggered SOS at " + locationStr);
    }

    public void reportIncident(ReportIncidentDto dto, String username) {
        IncidentCreateDto incident = new IncidentCreateDto();
        incident.setTitle(dto.getTitle());
        incident.setDescription(dto.getDescription());
        incident.setLocation(dto.getLocation());
        incident.setSeverity(IncidentSeverity.MEDIUM); // Default for user reports
        
        incidentService.reportIncident(incident);
        activityLogService.logActivity(username, ActivityAction.INCIDENT_CREATED, "Reported incident: " + dto.getTitle());
    }
}
