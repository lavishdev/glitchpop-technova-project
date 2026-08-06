import axiosClient from '@/services/api/axiosClient';
import { API_ENDPOINTS } from '@/services/endpoints';
import { AlertItem } from '../types';
import { MOCK_ALERTS } from '../mock';

export const alertService = {
  getAlerts: async (): Promise<AlertItem[]> => {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.ALERTS);
      const alerts = response.data.data.content || [];
      return alerts.map((a: any) => ({
        id: String(a.id),
        title: a.type,
        description: a.message,
        severity: (a.severity || "info").toLowerCase(),
        status: a.isRead ? 'resolved' : 'active',
        timestamp: a.createdAt ? new Date(a.createdAt).toLocaleTimeString() : "Unknown",
        location: a.location || "System"
      }));
    } catch (e) {
      console.warn("Using mock alerts due to backend error or missing endpoint", e);
      return Promise.resolve(MOCK_ALERTS);
    }
  },

  updateAlertStatus: async (id: string, status: string): Promise<AlertItem> => {
    // Backend supports marking as read via PATCH /{id}/read
    try {
      if (status === 'resolved' || status === 'read') {
        const response = await axiosClient.patch(`${API_ENDPOINTS.ALERTS}/${id}/read`);
        const a = response.data.data;
        return {
          id: String(a.id),
          title: a.type,
          description: a.message,
          severity: (a.severity || "info").toLowerCase() as any,
          status: a.isRead ? 'resolved' : 'active',
          timestamp: a.createdAt ? new Date(a.createdAt).toLocaleTimeString() : "Unknown",
          location: a.location || "System"
        };
      }
    } catch (e) {
      console.warn("Using mock alert status update", e);
    }
    const alert = MOCK_ALERTS.find(a => a.id === id);
    return Promise.resolve({ ...alert!, status: status as any });
  },

  getAlertById: async (id: string): Promise<AlertItem> => {
    // Controller doesn't have GET /{id}, fallback to mock
    return Promise.resolve(MOCK_ALERTS.find(a => a.id === id)!);
  }
};
