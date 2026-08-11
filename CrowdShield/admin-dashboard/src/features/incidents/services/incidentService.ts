import axiosClient from '@/services/api/axiosClient';
import { API_ENDPOINTS } from '@/services/endpoints';
import { IncidentRecord } from '../types';
import { MOCK_INCIDENTS } from '../mock';

export const incidentService = {
  getIncidents: async (): Promise<IncidentRecord[]> => {
    // TODO: [ASSUMED BACKEND] Implement actual API call when ready
    /*
    const response = await axiosClient.get(API_ENDPOINTS.INCIDENTS);
    return response.data;
    */
    return Promise.resolve(MOCK_INCIDENTS);
  },

  createIncident: async (data: Partial<IncidentRecord>): Promise<IncidentRecord> => {
    // TODO: [ASSUMED BACKEND] Implement actual API call when ready
    /*
    const response = await axiosClient.post(API_ENDPOINTS.INCIDENTS, data);
    return response.data;
    */
    return Promise.resolve({ id: `INC-${Math.random()}`, ...data } as IncidentRecord);
  },

  updateIncident: async (id: string, data: Partial<IncidentRecord>): Promise<IncidentRecord> => {
    // TODO: [ASSUMED BACKEND] Implement actual API call when ready
    /*
    const response = await axiosClient.put(API_ENDPOINTS.INCIDENT_BY_ID(id), data);
    return response.data;
    */
    const inc = MOCK_INCIDENTS.find(i => i.id === id);
    return Promise.resolve({ ...inc!, ...data });
  },

  getIncidentById: async (id: string): Promise<IncidentRecord> => {
    // TODO: [ASSUMED BACKEND] Implement actual API call when ready
    /*
    const response = await axiosClient.get(API_ENDPOINTS.INCIDENT_BY_ID(id));
    return response.data;
    */
    return Promise.resolve(MOCK_INCIDENTS.find(i => i.id === id)!);
  }
};
