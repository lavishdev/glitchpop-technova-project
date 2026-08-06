package com.crowdshield.system.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SystemHealthDto {
    private String apiStatus;
    private String dbStatus;
    private String aiServiceStatus;
    private String cameraServiceStatus;
    private Integer onlineCameras;
    private Integer totalCameras;
}
