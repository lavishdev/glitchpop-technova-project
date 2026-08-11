package com.crowdshield.activity;

import com.crowdshield.activity.dto.ActivityLogDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public void logActivity(String username, ActivityAction action, String details) {
        ActivityLog log = ActivityLog.builder()
                .user(username)
                .action(action)
                .details(details)
                .timestamp(LocalDateTime.now())
                .build();
        activityLogRepository.save(log);
    }

    public Page<ActivityLogDto> getLogs(String username, ActivityAction action, Pageable pageable) {
        return activityLogRepository.findFilteredLogs(username, action, pageable)
                .map(this::toDto);
    }
    
    private ActivityLogDto toDto(ActivityLog log) {
        return ActivityLogDto.builder()
                .id(log.getId())
                .user(log.getUser())
                .action(log.getAction())
                .details(log.getDetails())
                .timestamp(log.getTimestamp())
                .build();
    }
}
