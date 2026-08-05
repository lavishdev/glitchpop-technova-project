package com.crowdshield.alert;

import com.crowdshield.alert.dto.AlertDto;
import com.crowdshield.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AlertDto>>> getAlerts(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) AlertSeverity severity,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(alertService.getAllAlerts(type, severity, startDate, endDate, pageable)));
    }

    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<Page<AlertDto>>> getUnreadAlerts(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(alertService.getUnreadAlerts(pageable)));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<AlertDto>> markAlertAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(alertService.markAsRead(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAlert(@PathVariable Long id) {
        alertService.deleteAlert(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Alert deleted successfully"));
    }
}
