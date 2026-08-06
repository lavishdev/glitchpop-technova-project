/**
 * Centralized API Contract Layer
 * All future backend endpoints should be declared here.
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH_LOGIN: '/auth/login',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_LOGOUT: '/auth/logout',

  // Dashboard & Metrics
  DASHBOARD_STATS: '/dashboard/stats',
  DASHBOARD_ZONES: '/dashboard/zones',
  DASHBOARD_RECENT_ACTIVITY: '/dashboard/recent-activity',
  DASHBOARD_INCIDENTS_ACTIVE: '/dashboard/incidents/active',
  DASHBOARD_CAMERAS_ACTIVE: '/dashboard/cameras/active',

  // Crowd Analytics
  ANALYTICS_HEATMAP: '/analytics/heatmap',
  ANALYTICS_TRENDS: '/analytics/trends',
  ANALYTICS_PREDICTIONS: '/analytics/predictions',

  // Alerts & Threat Detection
  ALERTS: '/alerts',
  ALERT_BY_ID: (id: string) => `/alerts/${id}`,
  ALERT_STATUS: (id: string) => `/alerts/${id}/status`,

  // Incident Management
  INCIDENTS: '/incidents',
  INCIDENT_BY_ID: (id: string) => `/incidents/${id}`,
  INCIDENT_ASSIGN: (id: string) => `/incidents/${id}/assign`,

  // Cameras & Telemetry
  CAMERAS: '/cameras',
  CAMERA_BY_ID: (id: string) => `/cameras/${id}`,
  CAMERA_STREAM: (id: string) => `/cameras/${id}/stream`,

  // Users & Personnel
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,
  USER_ROLES: '/users/roles',

  // Emergency Response
  EMERGENCY_EVENTS: '/emergency',
  EMERGENCY_TRIGGER: '/emergency/trigger',

  // Audit Logging
  AUDIT_LOGS: '/audit-logs',
  
  // Settings
  SETTINGS: '/settings',
  
  // System
  SYSTEM_HEALTH: '/system/health',
} as const;
