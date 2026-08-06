package com.crowdshield.activity.dto;

import com.crowdshield.activity.ActivityAction;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ActivityLogDto {
    private Long id;
    private String user;
    private ActivityAction action;
    private String details;
    private LocalDateTime timestamp;
}
