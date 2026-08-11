package com.crowdshield.camera.dto;

import com.crowdshield.camera.CameraStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CameraCreateDto {
    @NotBlank(message = "Name is mandatory")
    private String name;

    @NotBlank(message = "Location is mandatory")
    private String location;

    @NotBlank(message = "Zone is mandatory")
    private String zone;

    @NotNull(message = "Status is mandatory")
    private CameraStatus status;
}
