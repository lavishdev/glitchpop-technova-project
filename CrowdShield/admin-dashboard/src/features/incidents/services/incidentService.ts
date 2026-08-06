import axiosClient from '@/services/api/axiosClient';
import { API_ENDPOINTS } from '@/services/endpoints';
import { IncidentRecord } from '../types';

export const incidentService = {
  getIncidents: async (): Promise<IncidentRecord[]> => {
    const response = await axiosClient.get(API_ENDPOINTS.INCIDENTS);
    return response.data.data.content;
  },

  createIncident: async (data: Partial<IncidentRecord>): Promise<IncidentRecord> => {
    const response = await axiosClient.post(API_ENDPOINTS.INCIDENTS, data);
    return response.data.data;
  },

  updateIncident: async (id: number, data: Partial<IncidentRecord>): Promise<IncidentRecord> => {
    if (data.status === 'RESOLVED') {
      const response = await axiosClient.patch(`${API_ENDPOINTS.INCIDENTS}/${id}/resolve`);
      return response.data.data;
    } else {
      const response = await axiosClient.put(`${API_ENDPOINTS.INCIDENTS}/${id}`, data);
      return response.data.data;
    }
  },

  getIncidentById: async (id: number): Promise<IncidentRecord> => {
    const response = await axiosClient.get(`${API_ENDPOINTS.INCIDENTS}/${id}`);
    return response.data.data;
  }
};
