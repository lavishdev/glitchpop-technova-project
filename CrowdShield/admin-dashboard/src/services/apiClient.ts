import {
  MOCK_ALERTS,
  MOCK_AUDIT_LOGS,
  MOCK_CAMERAS,
  MOCK_EMERGENCY_PROTOCOLS,
  MOCK_INCIDENTS,
  MOCK_OVERVIEW_METRICS,
  MOCK_SYSTEM_CONFIG,
  MOCK_USERS,
  MOCK_ZONE_ANALYTICS,
} from "./mockData";

/**
 * Isolated API Service Layer for CrowdShield Admin Dashboard.
 * Abstracted API layer that returns Promises. When backend endpoints are available,
 * standard fetch/axios calls replace these mock returns seamlessly.
 */

export const apiClient = {
  async getOverviewMetrics() {
    return Promise.resolve(MOCK_OVERVIEW_METRICS);
  },

  async getZoneAnalytics() {
    return Promise.resolve(MOCK_ZONE_ANALYTICS);
  },

  async getAlerts() {
    return Promise.resolve(MOCK_ALERTS);
  },

  async getCameras() {
    return Promise.resolve(MOCK_CAMERAS);
  },

  async getIncidents() {
    return Promise.resolve(MOCK_INCIDENTS);
  },

  async getEmergencyProtocols() {
    return Promise.resolve(MOCK_EMERGENCY_PROTOCOLS);
  },

  async getUsers() {
    return Promise.resolve(MOCK_USERS);
  },

  async getAuditLogs() {
    return Promise.resolve(MOCK_AUDIT_LOGS);
  },

  async getSystemConfig() {
    return Promise.resolve(MOCK_SYSTEM_CONFIG);
  },
};
