package com.crowdshield.analytics.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PredictionRequestDto {
    
    @NotBlank(message = "Camera ID is mandatory")
    private String cameraId;
    
    private int density;
    private int peopleCount;
    
    private double violenceScore;
    private double fireScore;
    private double smokeScore;
}
