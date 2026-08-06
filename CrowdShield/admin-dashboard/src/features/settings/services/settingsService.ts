import axiosClient from '@/services/api/axiosClient';
import { API_ENDPOINTS } from '@/services/endpoints';
import { SystemConfigSettings } from '../types';

export const settingsService = {
  getSystemConfig: async (): Promise<SystemConfigSettings> => {
    const response = await axiosClient.get(API_ENDPOINTS.SETTINGS);
    return response.data.data;
  },
  
  updateSystemConfig: async (config: SystemConfigSettings): Promise<SystemConfigSettings> => {
    const response = await axiosClient.put(API_ENDPOINTS.SETTINGS, config);
    return response.data.data;
  }
};
