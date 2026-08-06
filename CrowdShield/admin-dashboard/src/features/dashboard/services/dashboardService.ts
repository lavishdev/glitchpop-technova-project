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
    const response = await axiosClient.get(API_ENDPOINTS.SYSTEM_HEALTH);
    
    // The backend returns a SystemHealthDto containing various stats.
    // Map it to the UI's StatMetric format.
    const health = response.data.data;
    
    return [
      {
        title: "Total Incidents",
        value: health.componentStatuses?.database?.details?.activeIncidents || 0,
        change: "+5% from yesterday",
        isPositive: true,
        icon: "warning"
      },
      {
        title: "Active Cameras",
        value: health.componentStatuses?.database?.details?.activeCameras || 0,
        change: "Online",
        isPositive: true,
        icon: "videocam"
      },
      {
        title: "System Load",
        value: `${health.memoryUsagePercentage?.toFixed(1) || 0}%`,
        change: "Normal",
        isPositive: true,
        icon: "memory"
      },
      {
        title: "API Latency",
        value: `${health.apiLatencyMs || 0}ms`,
        change: "Fast",
        isPositive: true,
        icon: "speed"
      }
    ];
  },
  
  getZoneAnalytics: async (): Promise<ZoneAnalytics[]> => {
    const response = await axiosClient.get(API_ENDPOINTS.DASHBOARD_ZONES);
    return response.data.data;
  },

  getRecentAlerts: async (): Promise<AlertItem[]> => {
    const response = await axiosClient.get(API_ENDPOINTS.DASHBOARD_RECENT_ACTIVITY);
    const logs = response.data.data || [];
    
    // Map ActivityLogDto to AlertItem to preserve the UI exactly as is.
    return logs.map((log: any) => ({
      id: String(log.id),
      title: log.action.replace('_', ' '),
      description: log.details || "System activity recorded",
      severity: "high", // Defaulting to high for visibility in the threat feed
      status: "active", // Required by AlertItem
      timestamp: new Date(log.timestamp).toLocaleTimeString(),
      location: log.user || "System"
    })).slice(0, 3);
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
