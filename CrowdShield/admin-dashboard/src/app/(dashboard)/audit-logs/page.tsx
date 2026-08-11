"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { auditLogService } from "@/features/audit-logs/services/auditLogService";
import { AuditLogItem } from "@/features/audit-logs/types";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    auditLogService.getAuditLogs().then(setLogs);
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface tracking-tight">
            System Audit Trail & Compliance Log
          </h2>
          <p className="text-xs text-on-surface-variant">
            Immutable system logs, operator actions, and automated system event records.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon="file_download">
            Export Audit Trail
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <Input
          placeholder="Filter audit logs by operator name, IP, or action text..."
          icon="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      {/* Logs Table */}
      <Card title="System Event History" icon="receipt_long">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant uppercase font-bold tracking-wider border-b border-outline-variant/60">
              <tr>
                <th className="px-4 py-3">Log ID</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Operator / User</th>
                <th className="px-4 py-3">Action Performed</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Source IP</th>
                <th className="px-4 py-3 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-on-surface font-medium">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-primary">{log.id}</td>
                  <td className="px-4 py-3 font-mono text-on-surface-variant">{log.timestamp}</td>
                  <td className="px-4 py-3 font-bold text-on-surface">{log.user}</td>
                  <td className="px-4 py-3 font-mono text-on-surface">{log.action}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container-high text-on-surface-variant">
                      {log.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-on-surface-variant">{log.ipAddress}</td>
                  <td className="px-4 py-3 text-right">
                    <Badge
                      variant={
                        log.status === "SUCCESS"
                          ? "success"
                          : log.status === "FAILED"
                          ? "danger"
                          : "warning"
                      }
                      size="sm"
                    >
                      {log.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
