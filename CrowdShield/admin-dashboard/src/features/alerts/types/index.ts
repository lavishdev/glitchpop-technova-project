export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

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
