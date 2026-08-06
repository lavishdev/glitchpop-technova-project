package com.crowdshield.settings.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SettingsDto {
    private Integer aiSensitivity;
    private Integer autoDispatchThreshold;
    private Integer retentionDays;
    
    private Boolean emailNotifications;
    private Boolean smsAlerts;
    
    private String webhookUrl;
    
    private Boolean darkThemeEnabled;
    private Boolean emergencyProtocolAutoTrigger;
}
