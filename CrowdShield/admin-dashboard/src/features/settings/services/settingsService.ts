import axiosClient from '@/services/api/axiosClient';
import { API_ENDPOINTS } from '@/services/endpoints';
import { SystemConfigSettings } from '../types';
import { MOCK_SYSTEM_CONFIG } from '../mock';

export const settingsService = {
  getSystemConfig: async (): Promise<SystemConfigSettings> => {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.SETTINGS);
      return response.data.data;
    } catch (error) {
      console.warn("Failed to fetch settings from backend, using fallback.", error);
      return Promise.resolve(MOCK_SYSTEM_CONFIG);
    }
  },
  
  updateSystemConfig: async (config: SystemConfigSettings): Promise<SystemConfigSettings> => {
    try {
      const response = await axiosClient.put(API_ENDPOINTS.SETTINGS, config);
      return response.data.data;
    } catch (error) {
      console.warn("Failed to update settings on backend, using fallback.", error);
      return Promise.resolve(config);
    }
  }
};
