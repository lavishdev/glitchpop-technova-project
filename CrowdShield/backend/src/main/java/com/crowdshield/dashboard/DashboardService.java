package com.crowdshield.dashboard;

import com.crowdshield.alert.AlertRepository;
import com.crowdshield.incident.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AlertRepository alertRepository;
    private final IncidentRepository incidentRepository;

    public Map<String, Object> getSummaryMetrics() {
        long totalAlerts = alertRepository.count();
        long openIncidents = incidentRepository.findAll().stream()
                .filter(inc -> "OPEN".equalsIgnoreCase(inc.getStatus()))
                .count();

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("status", "operational");
        metrics.put("totalAlerts", totalAlerts);
        metrics.put("openIncidents", openIncidents);
        metrics.put("overallRiskLevel", "MODERATE"); // Mock logic
        
        return metrics;
    }
}
