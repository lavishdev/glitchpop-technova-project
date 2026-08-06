package com.crowdshield.settings;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Settings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer aiSensitivity;
    private Integer autoDispatchThreshold;
    private Integer retentionDays;
    
    private Boolean emailNotifications;
    private Boolean smsAlerts;
    
    private String webhookUrl;
    
    private Boolean darkThemeEnabled;
    private Boolean emergencyProtocolAutoTrigger;
}
