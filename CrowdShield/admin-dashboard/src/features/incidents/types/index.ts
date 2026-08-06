import { SeverityLevel } from '../../alerts/types';

export type IncidentStatus = 'open' | 'investigating' | 'dispatched' | 'resolved';

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
