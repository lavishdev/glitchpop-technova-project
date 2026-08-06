package com.crowdshield.system;

import com.crowdshield.common.ApiResponse;
import com.crowdshield.system.dto.SystemHealthDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/system")
@RequiredArgsConstructor
@Tag(name = "System Health", description = "Endpoints for checking system operational status")
public class SystemHealthController {

    private final SystemHealthService systemHealthService;

    @GetMapping("/health")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECURITY')")
    @Operation(summary = "Get system health status", description = "Returns the operational status of various backend services and total online cameras.")
    public ResponseEntity<ApiResponse<SystemHealthDto>> getHealth() {
        return ResponseEntity.ok(ApiResponse.success(systemHealthService.getSystemHealth()));
    }
}
