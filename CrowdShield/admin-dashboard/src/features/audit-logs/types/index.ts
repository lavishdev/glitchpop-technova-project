export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'Security' | 'User Management' | 'System Config' | 'Emergency Dispatch';
  ipAddress: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
}
