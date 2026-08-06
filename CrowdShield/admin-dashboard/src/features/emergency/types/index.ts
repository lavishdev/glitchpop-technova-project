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
