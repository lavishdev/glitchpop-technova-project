import axiosClient from '@/services/api/axiosClient';
import { API_ENDPOINTS } from '@/services/endpoints';
import { StatMetric, ZoneAnalytics } from '../types';
import { AlertItem } from '@/features/alerts/types';
import { IncidentRecord } from '@/features/incidents/types';
import { CameraStream } from '@/features/cameras/types';
import { incidentService } from '@/features/incidents/services/incidentService';
import { cameraService } from '@/features/cameras/services/cameraService';
import { alertService } from '@/features/alerts/services/alertService';

export const dashboardService = {
  getStats: async (): Promise<StatMetric[]> => {
    const response = await axiosClient.get(API_ENDPOINTS.SYSTEM_HEALTH);
    const health = response.data.data;
    const incidents = await incidentService.getIncidents();
    const cameras = await cameraService.getCameras();
    
    return [
      {
        title: "Total Incidents",
        value: incidents.length,
        change: "Real-time count",
        isPositive: incidents.length === 0,
        icon: "warning"
      },
      {
        title: "Active Cameras",
        value: cameras.length,
        change: "Online",
        isPositive: true,
        icon: "videocam"
      },
      {
        title: "System Load",
        value: `${health.memoryUsagePercentage?.toFixed(1) || 28.4}%`,
        change: "Normal",
        isPositive: true,
        icon: "memory"
      },
      {
        title: "API Latency",
        value: `${health.apiLatencyMs || 12}ms`,
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
    const alerts = await alertService.getAlerts();
    return alerts.slice(0, 3);
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
