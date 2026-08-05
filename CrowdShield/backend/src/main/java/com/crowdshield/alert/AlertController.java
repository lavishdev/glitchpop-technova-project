package com.crowdshield.alert;

import com.crowdshield.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Alert>>> getAllAlerts() {
        return ResponseEntity.ok(ApiResponse.success(alertService.getAllAlerts()));
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<Alert>> resolveAlert(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(alertService.resolveAlert(id)));
    }
}
