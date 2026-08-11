package com.crowdshield.dashboard;

import com.crowdshield.alert.dto.AlertDto;
import com.crowdshield.common.ApiResponse;
import com.crowdshield.incident.dto.IncidentDto;
import com.crowdshield.activity.dto.ActivityLogDto;
import com.crowdshield.dashboard.dto.DashboardSummaryDto;
import com.crowdshield.dashboard.dto.ZoneAnalyticsDto;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Aggregated statistics for dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @Operation(summary = "Get detailed dashboard statistics", description = "Legacy endpoint for detailed system metrics.")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getSummaryMetrics()));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get high-level dashboard summary", description = "Returns core KPIs for the main dashboard view.")
    public ResponseEntity<ApiResponse<DashboardSummaryDto>> getDashboardSummary() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getDashboardSummary()));
    }

    @GetMapping("/recent-alerts")
    public ResponseEntity<ApiResponse<List<AlertDto>>> getRecentAlerts() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getRecentAlerts()));
    }

    @GetMapping("/recent-incidents")
    public ResponseEntity<ApiResponse<List<IncidentDto>>> getRecentIncidents() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getRecentIncidents()));
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<ApiResponse<List<ActivityLogDto>>> getRecentActivity() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getRecentActivity()));
    }

    @GetMapping("/zones")
    public ResponseEntity<ApiResponse<List<ZoneAnalyticsDto>>> getZoneAnalytics() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getZoneAnalytics()));
    }
}
