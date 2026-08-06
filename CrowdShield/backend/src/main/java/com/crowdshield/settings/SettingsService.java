package com.crowdshield.settings;

import com.crowdshield.settings.dto.SettingsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final SettingsRepository settingsRepository;

    public SettingsDto getSettings() {
        Settings settings = settingsRepository.findById(1L).orElseGet(this::createDefaultSettings);
        return mapToDto(settings);
    }

    @Transactional
    public SettingsDto updateSettings(SettingsDto dto) {
        Settings settings = settingsRepository.findById(1L).orElseGet(this::createDefaultSettings);
        
        settings.setAiSensitivity(dto.getAiSensitivity());
        settings.setAutoDispatchThreshold(dto.getAutoDispatchThreshold());
        settings.setRetentionDays(dto.getRetentionDays());
        settings.setEmailNotifications(dto.getEmailNotifications());
        settings.setSmsAlerts(dto.getSmsAlerts());
        settings.setWebhookUrl(dto.getWebhookUrl());
        settings.setDarkThemeEnabled(dto.getDarkThemeEnabled());
        settings.setEmergencyProtocolAutoTrigger(dto.getEmergencyProtocolAutoTrigger());
        
        Settings updated = settingsRepository.save(settings);
        return mapToDto(updated);
    }

    private Settings createDefaultSettings() {
        Settings defaultSettings = Settings.builder()
                .aiSensitivity(85)
                .autoDispatchThreshold(90)
                .retentionDays(30)
                .emailNotifications(true)
                .smsAlerts(true)
                .webhookUrl("https://api.example.com/webhooks")
                .darkThemeEnabled(false)
                .emergencyProtocolAutoTrigger(false)
                .build();
        return settingsRepository.save(defaultSettings);
    }

    private SettingsDto mapToDto(Settings settings) {
        return SettingsDto.builder()
                .aiSensitivity(settings.getAiSensitivity())
                .autoDispatchThreshold(settings.getAutoDispatchThreshold())
                .retentionDays(settings.getRetentionDays())
                .emailNotifications(settings.getEmailNotifications())
                .smsAlerts(settings.getSmsAlerts())
                .webhookUrl(settings.getWebhookUrl())
                .darkThemeEnabled(settings.getDarkThemeEnabled())
                .emergencyProtocolAutoTrigger(settings.getEmergencyProtocolAutoTrigger())
                .build();
    }
}
