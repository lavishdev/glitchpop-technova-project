import axiosClient from '@/services/api/axiosClient';
import { API_ENDPOINTS } from '@/services/endpoints';
import { AlertItem } from '../types';
import { MOCK_ALERTS } from '../mock';

export const alertService = {
  getAlerts: async (): Promise<AlertItem[]> => {
    // TODO: [ASSUMED BACKEND] Implement actual API call when ready
    /*
    const response = await axiosClient.get(API_ENDPOINTS.ALERTS);
    return response.data;
    */
    return Promise.resolve(MOCK_ALERTS);
  },

  updateAlertStatus: async (id: string, status: string): Promise<AlertItem> => {
    // TODO: [ASSUMED BACKEND] Implement actual API call when ready
    /*
    const response = await axiosClient.put(API_ENDPOINTS.ALERT_STATUS(id), { status });
    return response.data;
    */
    const alert = MOCK_ALERTS.find(a => a.id === id);
    return Promise.resolve({ ...alert!, status: status as any });
  },

  getAlertById: async (id: string): Promise<AlertItem> => {
    // TODO: [ASSUMED BACKEND] Implement actual API call when ready
    /*
    const response = await axiosClient.get(API_ENDPOINTS.ALERT_BY_ID(id));
    return response.data;
    */
    return Promise.resolve(MOCK_ALERTS.find(a => a.id === id)!);
  }
};
