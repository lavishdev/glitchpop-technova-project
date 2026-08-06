package com.crowdshield.emergency;

import com.crowdshield.common.ApiResponse;
import com.crowdshield.emergency.dto.EmergencyDispatchDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Arrays;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
public class EmergencyController {

    private final EmergencyService emergencyService;

    @PostMapping("/respond")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECURITY')")
    public ResponseEntity<ApiResponse<Void>> dispatchResponse(@Valid @RequestBody EmergencyDispatchDto dto) {
        emergencyService.dispatchResponse(dto);
        return ResponseEntity.ok(ApiResponse.success(null, dto.getResponseType().name() + " dispatched successfully"));
    }

    @GetMapping("/protocols")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECURITY')")
    public ResponseEntity<ApiResponse<List<com.crowdshield.emergency.dto.EmergencyProtocolDto>>> getProtocols() {
        List<com.crowdshield.emergency.dto.EmergencyProtocolDto> protocols = Arrays.asList(
            com.crowdshield.emergency.dto.EmergencyProtocolDto.builder()
                .id("EP-RED-01")
                .name("FULL FACILITY EVACUATION")
                .code("CODE RED ALPHA")
                .activeState(false)
                .description("Immediately triggers all emergency exits, broadcasts loud public address alert, and notifies central emergency dispatchers.")
                .requiredClearance("SUPER_ADMIN")
                .steps(Arrays.asList("Automated siren activation & PA vocal announcement.", "All turnstiles & fire exits automatically unlatched.", "Elevator systems locked to Ground Return Mode.", "Local Fire Department & Municipal Police telemetry stream initialized."))
                .affectedZones(Arrays.asList("All Zones (1 through 8)"))
                .build(),
            com.crowdshield.emergency.dto.EmergencyProtocolDto.builder()
                .id("EP-ORANGE-02")
                .name("PERIMETER SECTOR LOCKOUT")
                .code("CODE ORANGE BRAVO")
                .activeState(false)
                .description("Isolates outer perimeter security gates while retaining normal egress inside main stadium halls.")
                .requiredClearance("SECURITY_OPERATOR")
                .steps(Arrays.asList("Outer turnstile entry gates lock to incoming traffic.", "Outer fence cameras switched to continuous 60fps tracking mode.", "Rapid Response Tactical Squad dispatched to perimeter outer bounds."))
                .affectedZones(Arrays.asList("Zone 01", "Zone 04"))
                .build()
        );
        return ResponseEntity.ok(ApiResponse.success(protocols));
    }
}
