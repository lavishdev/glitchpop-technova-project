import { SystemConfigSettings } from '../types';

export const MOCK_SYSTEM_CONFIG: SystemConfigSettings = {
  aiSensitivity: 85,
  autoDispatchThreshold: 90,
  retentionDays: 30,
  emailNotifications: true,
  smsAlerts: true,
  webhookUrl: "https://api.crowdshield.internal/v1/telemetry/webhooks",
  darkThemeEnabled: false,
  emergencyProtocolAutoTrigger: false,
};
