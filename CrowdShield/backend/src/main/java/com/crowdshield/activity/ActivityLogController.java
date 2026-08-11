package com.crowdshield.activity;

import com.crowdshield.activity.dto.ActivityLogDto;
import com.crowdshield.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SECURITY')")
    public ResponseEntity<ApiResponse<Page<ActivityLogDto>>> getLogs(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) ActivityAction action,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(activityLogService.getLogs(username, action, pageable)));
    }
}
