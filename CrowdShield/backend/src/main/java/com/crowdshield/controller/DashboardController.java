package com.crowdshield.controller;

import com.crowdshield.model.CrowdHistory;
import com.crowdshield.repository.CrowdHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final CrowdHistoryRepository crowdHistoryRepository;

    @GetMapping("/history")
    public ResponseEntity<List<CrowdHistory>> getHistoricalData() {
        return ResponseEntity.ok(crowdHistoryRepository.findAll());
    }

    @GetMapping("/summary")
    public ResponseEntity<String> getDashboardSummary() {
        // In a real app, this would return aggregated metrics.
        return ResponseEntity.ok("{\"status\": \"operational\", \"totalIncidents\": 0}");
    }
}
