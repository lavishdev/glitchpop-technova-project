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
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MobileService {

    private final DashboardService dashboardService;
    private final IncidentService incidentService;
    private final ActivityLogService activityLogService;
    private final com.crowdshield.analytics.AnalysisService analysisService;

    public MobileHomeDto getHomeData() {
        Map<String, Object> latestAnalysis = analysisService.getLatestAnalysis();
        DashboardSummaryDto summary = dashboardService.getDashboardSummary();
        
        if (latestAnalysis != null) {
            int density = latestAnalysis.get("density") != null ? (int) latestAnalysis.get("density") : 0;
            String riskLevel = (String) latestAnalysis.getOrDefault("riskLevel", "LOW");
            String status = riskLevel.equals("HIGH") || riskLevel.equals("CRITICAL") ? "High Risk Active" : "Normal Operation";
            
            return MobileHomeDto.builder()
                    .venue(MobileHomeDto.VenueInfo.builder()
                            .name((String) latestAnalysis.getOrDefault("location", "TechNova Arena"))
                            .status(status)
                            .severity(riskLevel)
                            .build())
                    .metrics(MobileHomeDto.MobileMetrics.builder()
                            .peopleCount((long) density)
                            .crowdDensity((double) density)
                            .riskLevel(riskLevel)
                            .activeAlerts(summary.getActiveAlerts())
                            .build())
                    .recommendation(MobileHomeDto.MobileRecommendation.builder()
                            .title("System Recommendation")
                            .message("Active AI monitoring: " + density + " individuals detected.")
                            .build())
                    .build();
        }

        return MobileHomeDto.builder()
                .venue(MobileHomeDto.VenueInfo.builder()
                        .name("TechNova Arena")
                        .status("Awaiting AI Connection")
                        .severity("NORMAL")
                        .build())
                .metrics(MobileHomeDto.MobileMetrics.builder()
                        .peopleCount(0L)
                        .crowdDensity(0.0)
                        .riskLevel("LOW")
                        .activeAlerts(summary.getActiveAlerts())
                        .build())
                .recommendation(MobileHomeDto.MobileRecommendation.builder()
                        .title("System Recommendation")
                        .message("Upload a video to start AI simulation.")
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
