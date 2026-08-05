package com.crowdshield.crowd;

import com.crowdshield.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/crowd")
@RequiredArgsConstructor
public class CrowdController {

    private final CrowdService crowdService;

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<CrowdHistory>>> getHistoricalData() {
        return ResponseEntity.ok(ApiResponse.success(crowdService.getAllHistory()));
    }
}
