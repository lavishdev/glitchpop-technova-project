import axiosClient from '@/services/api/axiosClient';
import { API_ENDPOINTS } from '@/services/endpoints';
import { EmergencyProtocol } from '../types';

export const emergencyService = {
  getEmergencyProtocols: async (): Promise<EmergencyProtocol[]> => {
    const response = await axiosClient.get(API_ENDPOINTS.EMERGENCY_PROTOCOLS);
    return response.data.data;
  },
  triggerProtocol: async (protocolId: string): Promise<void> => {
    await axiosClient.post(API_ENDPOINTS.EMERGENCY_TRIGGER, {
      responseType: protocolId,
      location: 'GLOBAL',
      priority: 'CRITICAL',
      dispatchedBy: 'system'
    });
  }
};
