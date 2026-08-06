import { SeverityLevel } from '../../alerts/types';

export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'DISPATCHED' | 'RESOLVED';

export interface IncidentRecord {
  id: number;
  title: string;
  description: string;
  location: string;
  severity: SeverityLevel;
  status: IncidentStatus;
  createdAt: string;
  resolvedAt?: string;
}
