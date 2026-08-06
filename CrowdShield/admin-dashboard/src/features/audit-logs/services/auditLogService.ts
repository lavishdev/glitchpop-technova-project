import axiosClient from '@/services/api/axiosClient';
import { API_ENDPOINTS } from '@/services/endpoints';
import { AuditLogItem } from '../types';

export const auditLogService = {
  getAuditLogs: async (): Promise<AuditLogItem[]> => {
    const response = await axiosClient.get(API_ENDPOINTS.AUDIT_LOGS);
    return response.data.data.content; // It returns a paginated Page<ActivityLogDto>
  }
};
