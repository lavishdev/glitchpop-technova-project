import { EmergencyProtocol } from '../types';
import { MOCK_EMERGENCY_PROTOCOLS } from '../mock';

export const emergencyService = {
  getEmergencyProtocols: async (): Promise<EmergencyProtocol[]> => {
    return Promise.resolve(MOCK_EMERGENCY_PROTOCOLS);
  }
};
