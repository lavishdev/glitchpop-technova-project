package com.crowdshield.camera.dto;

import com.crowdshield.camera.CameraStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CameraDto {
    private Long id;
    private String name;
    private String location;
    private String zone;
    private CameraStatus status;
    private LocalDateTime lastSeen;
    private Double healthPercentage;
    private String resolution;
    private Integer fps;
    private String videoUrl;
    private String analysisId;
}
