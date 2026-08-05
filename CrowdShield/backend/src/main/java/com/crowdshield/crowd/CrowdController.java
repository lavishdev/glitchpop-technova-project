package com.crowdshield.crowd;

import com.crowdshield.common.ApiResponse;
import com.crowdshield.crowd.dto.CrowdHistoryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class CrowdController {

    private final CrowdService crowdService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CrowdHistoryDto>>> getHistory(
            @RequestParam(required = false) String zone,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(crowdService.getHistory(zone, pageable)));
    }

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<Page<CrowdHistoryDto>>> getHistoryToday(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(crowdService.getHistoryToday(pageable)));
    }

    @GetMapping("/last-hour")
    public ResponseEntity<ApiResponse<Page<CrowdHistoryDto>>> getHistoryLastHour(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(crowdService.getHistoryLastHour(pageable)));
    }
}
