package com.crowdshield.analytics;

import com.crowdshield.crowd.CrowdHistory;
import com.crowdshield.crowd.CrowdHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final CrowdHistoryRepository crowdHistoryRepository;

    public void processHeatmapData(Map<String, Object> payload) {
        String location = (String) payload.getOrDefault("location", "Unknown Location");
        int density = payload.containsKey("density") ? Integer.parseInt(payload.get("density").toString()) : 0;
        double riskScore = payload.containsKey("riskScore") ? Double.parseDouble(payload.get("riskScore").toString()) : 0.0;

        CrowdHistory history = CrowdHistory.builder()
                .location(location)
                .density(density)
                .riskScore(riskScore)
                .timestamp(LocalDateTime.now())
                .build();
                
        crowdHistoryRepository.save(history);
    }
}
