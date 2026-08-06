import axiosClient from '@/services/api/axiosClient';
import { API_ENDPOINTS } from '@/services/endpoints';
import { IncidentRecord } from '../types';
import { MOCK_INCIDENTS } from '../mock';

export const incidentService = {
  getIncidents: async (): Promise<IncidentRecord[]> => {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.INCIDENTS);
      const incidents = response.data.data.content || [];
      return incidents.map((i: any) => ({
        id: String(i.id),
        title: i.title,
        category: i.description || "General",
        zone: i.location || "System",
        severity: (i.severity || 'low').toLowerCase(),
        status: (i.status || 'open').toLowerCase(),
        reportedAt: i.createdAt ? new Date(i.createdAt).toLocaleTimeString() : "Unknown",
        assignedTo: "Unassigned", // Backend doesn't have assignee yet
        responseUnits: [],
        notes: []
      }));
    } catch (e) {
      console.warn("Using mock incidents due to backend error", e);
      return Promise.resolve(MOCK_INCIDENTS);
    }
  },

  createIncident: async (data: Partial<IncidentRecord>): Promise<IncidentRecord> => {
    try {
      const payload = {
        title: data.title,
        description: data.category || "General",
        location: data.zone || "System",
        severity: (data.severity || 'low').toUpperCase(),
        status: (data.status || 'open').toUpperCase()
      };
      const response = await axiosClient.post(API_ENDPOINTS.INCIDENTS, payload);
      const i = response.data.data;
      return {
        id: String(i.id),
        title: i.title,
        category: i.description || "General",
        zone: i.location || "System",
        severity: (i.severity || 'low').toLowerCase() as any,
        status: (i.status || 'open').toLowerCase() as any,
        reportedAt: i.createdAt ? new Date(i.createdAt).toLocaleTimeString() : "Unknown",
        assignedTo: "Unassigned",
        responseUnits: [],
        notes: []
      };
    } catch (e) {
      console.warn("Using mock create incident", e);
      return Promise.resolve({ id: `INC-${Math.random()}`, ...data } as IncidentRecord);
    }
  },

  updateIncident: async (id: string, data: Partial<IncidentRecord>): Promise<IncidentRecord> => {
    try {
      if (data.status === 'resolved') {
        const response = await axiosClient.patch(`${API_ENDPOINTS.INCIDENTS}/${id}/resolve`);
        const i = response.data.data;
        return {
          id: String(i.id),
          title: i.title,
          category: i.description || "General",
          zone: i.location || "System",
          severity: (i.severity || 'low').toLowerCase() as any,
          status: (i.status || 'open').toLowerCase() as any,
          reportedAt: i.createdAt ? new Date(i.createdAt).toLocaleTimeString() : "Unknown",
          assignedTo: "Unassigned",
          responseUnits: [],
          notes: []
        };
      } else {
        const payload = {
          title: data.title,
          description: data.category || "General",
          location: data.zone || "System",
          severity: (data.severity || 'low').toUpperCase(),
          status: (data.status || 'open').toUpperCase()
        };
        const response = await axiosClient.put(`${API_ENDPOINTS.INCIDENTS}/${id}`, payload);
        const i = response.data.data;
        return {
          id: String(i.id),
          title: i.title,
          category: i.description || "General",
          zone: i.location || "System",
          severity: (i.severity || 'low').toLowerCase() as any,
          status: (i.status || 'open').toLowerCase() as any,
          reportedAt: i.createdAt ? new Date(i.createdAt).toLocaleTimeString() : "Unknown",
          assignedTo: "Unassigned",
          responseUnits: [],
          notes: []
        };
      }
    } catch (e) {
      console.warn("Using mock update incident", e);
      const inc = MOCK_INCIDENTS.find(i => i.id === id);
      return Promise.resolve({ ...inc!, ...data });
    }
  },

  getIncidentById: async (id: string): Promise<IncidentRecord> => {
    try {
      const response = await axiosClient.get(`${API_ENDPOINTS.INCIDENTS}/${id}`);
      const i = response.data.data;
      return {
        id: String(i.id),
        title: i.title,
        category: i.description || "General",
        zone: i.location || "System",
        severity: (i.severity || 'low').toLowerCase() as any,
        status: (i.status || 'open').toLowerCase() as any,
        reportedAt: i.createdAt ? new Date(i.createdAt).toLocaleTimeString() : "Unknown",
        assignedTo: "Unassigned",
        responseUnits: [],
        notes: []
      };
    } catch (e) {
      console.warn("Using mock get incident by id", e);
      return Promise.resolve(MOCK_INCIDENTS.find(i => i.id === id)!);
    }
  }
};
