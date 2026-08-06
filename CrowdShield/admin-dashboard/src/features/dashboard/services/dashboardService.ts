import axiosClient from '@/services/api/axiosClient';
import { API_ENDPOINTS } from '@/services/endpoints';
import { StatMetric, ZoneAnalytics } from '../types';
import { AlertItem } from '@/features/alerts/types';
import { IncidentRecord } from '@/features/incidents/types';
import { CameraStream } from '@/features/cameras/types';
import { incidentService } from '@/features/incidents/services/incidentService';
import { cameraService } from '@/features/cameras/services/cameraService';

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
      id: log.id,
      type: log.action.replace('_', ' '),
      message: log.details || "System activity recorded",
      severity: "HIGH", // Defaulting to high for visibility in the threat feed
      read: false, // Required by AlertItem
      createdAt: log.timestamp,
      location: log.user || "System"
    })).slice(0, 3);
  },
  
  getActiveIncidents: async (): Promise<IncidentRecord[]> => {
    const incidents = await incidentService.getIncidents();
    return incidents.slice(0, 3); // Just show the top 3 on dashboard
  },

  getCameraFeeds: async (): Promise<CameraStream[]> => {
    const cameras = await cameraService.getCameras();
    return cameras.slice(0, 2); // Dashboard shows 2 cameras
  }
};
