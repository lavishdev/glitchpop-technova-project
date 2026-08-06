export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'open' | 'investigating' | 'dispatched' | 'resolved';
export type CameraStatus = 'online' | 'offline' | 'warning' | 'maintenance';
export type UserRole = 'Super Admin' | 'Security Officer' | 'Data Auditor' | 'Field Dispatcher';

export interface StatMetric {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: string;
  description?: string;
}

export interface ZoneAnalytics {
  zoneId: string;
  zoneName: string;
  capacityPercentage: number;
  currentDensity: number;
  maxCapacity: number;
  dwellTimeMinutes: number;
  flowRateIn: number;
  flowRateOut: number;
  status: 'normal' | 'moderate' | 'congested' | 'critical';
}

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  severity: SeverityLevel;
  status: 'active' | 'acknowledged' | 'resolved';
  cameraId?: string;
  assignedOfficer?: string;
}

export interface CameraStream {
  id: string;
  name: string;
  zone: string;
  ipAddress: string;
  status: CameraStatus;
  resolution: string;
  fps: number;
  streamUrl: string;
  detectionActive: boolean;
  type: 'Optical PTZ' | 'Thermal AI' | 'Fixed Wide-Angle';
}

export interface IncidentRecord {
  id: string;
  title: string;
  category: string;
  zone: string;
  reportedAt: string;
  severity: SeverityLevel;
  status: IncidentStatus;
  assignedTo: string;
  responseUnits: string[];
  notes: string[];
}

export interface EmergencyProtocol {
  id: string;
  name: string;
  code: string;
  activeState: boolean;
  description: string;
  requiredClearance: string;
  steps: string[];
  affectedZones: string[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'active' | 'inactive';
  lastActive: string;
  avatarUrl?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'Security' | 'User Management' | 'System Config' | 'Emergency Dispatch';
  ipAddress: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
}

export interface SystemConfigSettings {
  aiSensitivity: number;
  autoDispatchThreshold: number;
  retentionDays: number;
  emailNotifications: boolean;
  smsAlerts: boolean;
  webhookUrl: string;
  darkThemeEnabled: boolean;
  emergencyProtocolAutoTrigger: boolean;
}
