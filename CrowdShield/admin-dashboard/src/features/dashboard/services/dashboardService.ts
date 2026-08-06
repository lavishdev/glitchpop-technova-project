import axiosClient from '@/services/api/axiosClient';
import { API_ENDPOINTS } from '@/services/endpoints';
import { StatMetric, ZoneAnalytics } from '../types';
import { MOCK_OVERVIEW_METRICS, MOCK_ZONE_ANALYTICS } from '../mock';
import { AlertItem } from '@/features/alerts/types';
import { MOCK_ALERTS } from '@/features/alerts/mock';
import { IncidentRecord } from '@/features/incidents/types';
import { MOCK_INCIDENTS } from '@/features/incidents/mock';
import { CameraStream } from '@/features/cameras/types';
import { MOCK_CAMERAS } from '@/features/cameras/mock';

export const dashboardService = {
  getStats: async (): Promise<StatMetric[]> => {
    // TODO: [ASSUMED BACKEND] Implement actual API call when ready
    /*
    const response = await axiosClient.get(API_ENDPOINTS.DASHBOARD_STATS);
    return response.data;
    */
    return Promise.resolve(MOCK_OVERVIEW_METRICS);
  },
  
  getZoneAnalytics: async (): Promise<ZoneAnalytics[]> => {
    // TODO: [ASSUMED BACKEND] Implement actual API call when ready
    /*
    const response = await axiosClient.get(API_ENDPOINTS.DASHBOARD_ZONES);
    return response.data;
    */
    return Promise.resolve(MOCK_ZONE_ANALYTICS);
  },

  getRecentAlerts: async (): Promise<AlertItem[]> => {
    // TODO: [ASSUMED BACKEND] Implement actual API call when ready
    /*
    const response = await axiosClient.get(API_ENDPOINTS.DASHBOARD_ALERTS_RECENT);
    return response.data;
    */
    return Promise.resolve(MOCK_ALERTS.slice(0, 3));
  },
  
  getActiveIncidents: async (): Promise<IncidentRecord[]> => {
    // TODO: [ASSUMED BACKEND] Implement actual API call when ready
    /*
    const response = await axiosClient.get(API_ENDPOINTS.DASHBOARD_INCIDENTS_ACTIVE);
    return response.data;
    */
    return Promise.resolve(MOCK_INCIDENTS);
  },

  getCameraFeeds: async (): Promise<CameraStream[]> => {
    // TODO: [ASSUMED BACKEND] Implement actual API call when ready
    /*
    const response = await axiosClient.get(API_ENDPOINTS.DASHBOARD_CAMERAS_ACTIVE);
    return response.data;
    */
    return Promise.resolve(MOCK_CAMERAS.slice(0, 2));
  }
};
