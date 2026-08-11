import { AuditLogItem } from '../types';
import { MOCK_AUDIT_LOGS } from '../mock';

export const auditLogService = {
  getAuditLogs: async (): Promise<AuditLogItem[]> => {
    return Promise.resolve(MOCK_AUDIT_LOGS);
  }
};
