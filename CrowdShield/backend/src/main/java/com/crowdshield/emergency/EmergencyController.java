package com.crowdshield.emergency;

import com.crowdshield.common.ApiResponse;
import com.crowdshield.emergency.dto.EmergencyDispatchDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
