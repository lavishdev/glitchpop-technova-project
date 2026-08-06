import axiosClient from '@/services/api/axiosClient';
import { API_ENDPOINTS } from '@/services/endpoints';
import { AlertItem } from '../types';

export const alertService = {
  getAlerts: async (): Promise<AlertItem[]> => {
    const response = await axiosClient.get(API_ENDPOINTS.ALERTS);
    return response.data.data.content;
  },

  updateAlertStatus: async (id: number): Promise<AlertItem> => {
    const response = await axiosClient.patch(`${API_ENDPOINTS.ALERTS}/${id}/read`);
    return response.data.data;
  },
};
