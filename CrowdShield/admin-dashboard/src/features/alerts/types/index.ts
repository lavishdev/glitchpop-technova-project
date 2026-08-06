export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AlertItem {
  id: number;
  type: string;
  message: string;
  location: string;
  severity: SeverityLevel;
  createdAt: string;
  read: boolean;
}
