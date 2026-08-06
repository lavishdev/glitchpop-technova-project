package com.crowdshield.dashboard;

import com.crowdshield.alert.Alert;
import com.crowdshield.alert.AlertRepository;
import com.crowdshield.alert.AlertSeverity;
import com.crowdshield.alert.dto.AlertDto;
import com.crowdshield.alert.mapper.AlertMapper;
import com.crowdshield.crowd.CrowdHistoryRepository;
import com.crowdshield.incident.Incident;
import com.crowdshield.incident.IncidentRepository;
import com.crowdshield.incident.IncidentStatus;
import com.crowdshield.incident.dto.IncidentDto;
import com.crowdshield.incident.mapper.IncidentMapper;
import com.crowdshield.camera.CameraRepository;
import com.crowdshield.camera.CameraStatus;
import com.crowdshield.dashboard.dto.ZoneAnalyticsDto;
import com.crowdshield.activity.ActivityLogRepository;
import com.crowdshield.activity.dto.ActivityLogDto;
import com.crowdshield.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AlertRepository alertRepository;
    private final IncidentRepository incidentRepository;
    private final CrowdHistoryRepository crowdHistoryRepository;
    private final CameraRepository cameraRepository;
    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;
    private final AlertMapper alertMapper;
    private final IncidentMapper incidentMapper;

    public Map<String, Object> getSummaryMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        long totalAlerts = alertRepository.count();
        long criticalAlerts = alertRepository.countBySeverity(AlertSeverity.CRITICAL);
        
        long activeIncidents = incidentRepository.countByStatus(IncidentStatus.OPEN) + 
                               incidentRepository.countByStatus(IncidentStatus.IN_PROGRESS);
        
        Double avgDensity = crowdHistoryRepository.getAverageDensity();
        double averageCrowdDensity = avgDensity != null ? avgDensity : 0.0;
        
        LocalDate today = LocalDate.now();
        long todayIncidents = incidentRepository.countByCreatedAtAfter(today.atStartOfDay());
        long resolvedToday = incidentRepository.countByResolvedAtAfterAndStatus(today.atStartOfDay(), IncidentStatus.RESOLVED);

        long connectedCameras = cameraRepository.count();
        long onlineCameras = cameraRepository.countByStatus(CameraStatus.ONLINE);
        long registeredUsers = userRepository.count();

        metrics.put("totalAlerts", totalAlerts);
        metrics.put("criticalAlerts", criticalAlerts);
        metrics.put("activeIncidents", activeIncidents);
        metrics.put("averageCrowdDensity", averageCrowdDensity);
        metrics.put("todayIncidents", todayIncidents);
        metrics.put("resolvedToday", resolvedToday);
        metrics.put("connectedCameras", connectedCameras);
        metrics.put("onlineCameras", onlineCameras);
        metrics.put("registeredUsers", registeredUsers);
        
        return metrics;
    }

    public List<AlertDto> getRecentAlerts() {
        return alertRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(alertMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<IncidentDto> getRecentIncidents() {
        return incidentRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(incidentMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<ActivityLogDto> getRecentActivity() {
        return activityLogRepository.findTop10ByOrderByTimestampDesc()
                .stream()
                .map(log -> ActivityLogDto.builder()
                        .id(log.getId())
                        .user(log.getUser())
                        .action(log.getAction())
                        .details(log.getDetails())
                        .timestamp(log.getTimestamp())
                        .build())
                .collect(Collectors.toList());
    }

    public List<ZoneAnalyticsDto> getZoneAnalytics() {
        // Return MVP static data, in production this would be aggregated from CrowdHistory
        return List.of(
            ZoneAnalyticsDto.builder()
                .zoneId("ZONE-01")
                .zoneName("Main Entrance Plaza")
                .capacityPercentage(88)
                .currentDensity(14200)
                .maxCapacity(16000)
                .dwellTimeMinutes(18.5)
                .flowRateIn(450)
                .flowRateOut(380)
                .status("congested")
                .build(),
            ZoneAnalyticsDto.builder()
                .zoneId("ZONE-02")
                .zoneName("North Concourse & Food Court")
                .capacityPercentage(94)
                .currentDensity(11280)
                .maxCapacity(12000)
                .dwellTimeMinutes(42.0)
                .flowRateIn(210)
                .flowRateOut(190)
                .status("critical")
                .build(),
            ZoneAnalyticsDto.builder()
                .zoneId("ZONE-03")
                .zoneName("East Promenade")
                .capacityPercentage(45)
                .currentDensity(6750)
                .maxCapacity(15000)
                .dwellTimeMinutes(12.2)
                .flowRateIn(320)
                .flowRateOut(340)
                .status("normal")
                .build(),
            ZoneAnalyticsDto.builder()
                .zoneId("ZONE-04")
                .zoneName("South Transit Terminal")
                .capacityPercentage(72)
                .currentDensity(10800)
                .maxCapacity(15000)
                .dwellTimeMinutes(24.8)
                .flowRateIn(610)
                .flowRateOut(580)
                .status("moderate")
                .build()
        );
    }
}
