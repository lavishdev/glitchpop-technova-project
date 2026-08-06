/**
 * Centralized API Contract Layer
 * All future backend endpoints should be declared here.
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',

  // Dashboard & Metrics
  DASHBOARD_ZONES: '/dashboard/zones',
  DASHBOARD_RECENT_ACTIVITY: '/dashboard/recent-activity',

  // Crowd Analytics (Handled via Dashboard / Recent Activity)

  // Alerts & Threat Detection
  ALERTS: '/alerts',

  // Incident Management
  INCIDENTS: '/incidents',
  INCIDENT_BY_ID: (id: string) => `/incidents/${id}`,

  // Cameras & Telemetry
  CAMERAS: '/cameras',

  // Users & Personnel
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,

  // Emergency Response
  EMERGENCY_EVENTS: '/emergency',
  EMERGENCY_TRIGGER: '/emergency/respond',
  EMERGENCY_PROTOCOLS: '/emergency/protocols',

  // Audit Logging
  AUDIT_LOGS: '/logs',
  
  // Settings
  SETTINGS: '/settings',
  
  // System
  SYSTEM_HEALTH: '/system/health',
} as const;
