package com.crowdshield.settings;

import com.crowdshield.common.ApiResponse;
import com.crowdshield.settings.dto.SettingsDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@Tag(name = "Settings", description = "Endpoints for managing application settings")
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SECURITY')")
    @Operation(summary = "Get current settings", description = "Retrieves the current application configuration.")
    public ResponseEntity<ApiResponse<SettingsDto>> getSettings() {
        return ResponseEntity.ok(ApiResponse.success(settingsService.getSettings()));
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update settings", description = "Updates the application configuration.")
    public ResponseEntity<ApiResponse<SettingsDto>> updateSettings(@RequestBody SettingsDto dto) {
        return ResponseEntity.ok(ApiResponse.success(settingsService.updateSettings(dto)));
    }
}
