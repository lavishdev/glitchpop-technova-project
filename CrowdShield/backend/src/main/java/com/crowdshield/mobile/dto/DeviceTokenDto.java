package com.crowdshield.mobile.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeviceTokenDto {
    @NotBlank(message = "Device token is required")
    private String deviceToken;
}
