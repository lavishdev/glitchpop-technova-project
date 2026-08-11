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

        metrics.put("totalAlerts", totalAlerts);
        metrics.put("criticalAlerts", criticalAlerts);
        metrics.put("activeIncidents", activeIncidents);
        metrics.put("averageCrowdDensity", averageCrowdDensity);
        metrics.put("todayIncidents", todayIncidents);
        metrics.put("resolvedToday", resolvedToday);
        
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
}
