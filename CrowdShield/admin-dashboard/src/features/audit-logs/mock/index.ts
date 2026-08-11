import { AuditLogItem } from '../types';

export const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "LOG-8801",
    timestamp: "2026-08-06 13:42:10",
    user: "Alex Mercer (Super Admin)",
    action: "Updated AI Detection Sensitivity to High (0.85)",
    category: "System Config",
    ipAddress: "10.200.4.15",
    status: "SUCCESS",
  },
  {
    id: "LOG-8800",
    timestamp: "2026-08-06 13:28:45",
    user: "Capt. Marcus Vance",
    action: "Acknowledged Critical Alert ALT-9042",
    category: "Security",
    ipAddress: "10.200.4.88",
    status: "SUCCESS",
  },
  {
    id: "LOG-8799",
    timestamp: "2026-08-06 12:15:02",
    user: "System Daemon",
    action: "Automated Routine Camera Health Diagnostics",
    category: "Security",
    ipAddress: "127.0.0.1",
    status: "SUCCESS",
  },
  {
    id: "LOG-8798",
    timestamp: "2026-08-06 11:04:19",
    user: "Sarah Chen",
    action: "Failed login attempt (Invalid credentials)",
    category: "User Management",
    ipAddress: "192.168.1.104",
    status: "FAILED",
  },
];
