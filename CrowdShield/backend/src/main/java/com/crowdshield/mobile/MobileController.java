package com.crowdshield.mobile;

import com.crowdshield.common.ApiResponse;
import com.crowdshield.mobile.dto.DeviceTokenDto;
import com.crowdshield.mobile.dto.MapLocationDto;
import com.crowdshield.mobile.dto.MobileHomeDto;
import com.crowdshield.mobile.dto.ReportIncidentDto;
import com.crowdshield.mobile.dto.SosRequestDto;
import com.crowdshield.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mobile")
@RequiredArgsConstructor
@Tag(name = "Mobile API", description = "Endpoints specifically designed for the Flutter mobile application")
public class MobileController {

    private final MobileService mobileService;
    private final UserService userService;

    @GetMapping("/home")
    @Operation(summary = "Get Mobile Home Data", description = "Aggregates venue status, metrics, and recommendations for the home screen.")
    public ResponseEntity<ApiResponse<MobileHomeDto>> getHome() {
        return ResponseEntity.ok(ApiResponse.success(mobileService.getHomeData()));
    }

    @GetMapping("/map")
    @Operation(summary = "Get Mobile Map Data", description = "Returns lightweight map coordinates and statuses for the mobile map view.")
    public ResponseEntity<ApiResponse<List<MapLocationDto>>> getMap() {
        return ResponseEntity.ok(ApiResponse.success(mobileService.getMapData()));
    }

    @PostMapping("/sos")
    @Operation(summary = "Trigger SOS Alert", description = "Creates a critical incident from a mobile SOS trigger.")
    public ResponseEntity<ApiResponse<Void>> triggerSos(@Valid @RequestBody SosRequestDto dto) {
        mobileService.handleSos(dto, getCurrentUsername());
        return ResponseEntity.ok(ApiResponse.success(null, "SOS alert triggered successfully"));
    }

    @PostMapping("/report")
    @Operation(summary = "Report an Incident", description = "Allows mobile users to report incidents directly.")
    public ResponseEntity<ApiResponse<Void>> reportIncident(@Valid @RequestBody ReportIncidentDto dto) {
        mobileService.reportIncident(dto, getCurrentUsername());
        return ResponseEntity.ok(ApiResponse.success(null, "Incident reported successfully"));
    }

    @PostMapping("/device-token")
    @Operation(summary = "Register FCM Device Token", description = "Stores the device token for future push notifications.")
    public ResponseEntity<ApiResponse<Void>> registerDeviceToken(@Valid @RequestBody DeviceTokenDto dto) {
        userService.updateDeviceToken(getCurrentUsername(), dto.getDeviceToken());
        return ResponseEntity.ok(ApiResponse.success(null, "Device token registered successfully"));
    }

    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null && auth.getName() != null) ? auth.getName() : "system";
    }
}
