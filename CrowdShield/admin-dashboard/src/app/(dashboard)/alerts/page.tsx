"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/services/apiClient";
import { AlertItem } from "@/types/domain";

export default function AlertsHistoryPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    apiClient.getAlerts().then(setAlerts);
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity =
      selectedSeverity === "all" || alert.severity === selectedSeverity;
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "acknowledged" } : a))
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface tracking-tight">
            Threat Alert Log & Audit Queue
          </h2>
          <p className="text-xs text-on-surface-variant">
            Computer vision incident flags, severity ranking, and officer dispatch logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon="check_circle">
            Acknowledge All Non-Critical
          </Button>
          <Button variant="primary" size="sm" icon="download">
            Export Alert History
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search alert title or location..."
              icon="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {["all", "critical", "high", "medium", "low"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                  selectedSeverity === sev
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Alert Table */}
      <Card title="Alert Log Records" icon="warning">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant uppercase font-bold tracking-wider border-b border-outline-variant/60">
              <tr>
                <th className="px-4 py-3">Alert ID</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Title & Description</th>
                <th className="px-4 py-3">Location / Camera</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Assigned Officer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-on-surface font-medium">
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-surface-container/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-primary">{alert.id}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        alert.severity === "critical"
                          ? "danger"
                          : alert.severity === "high"
                          ? "warning"
                          : "info"
                      }
                      size="sm"
                    >
                      {alert.severity}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-on-surface">{alert.title}</p>
                    <p className="text-[11px] text-on-surface-variant">{alert.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{alert.location}</p>
                    {alert.cameraId && (
                      <Link
                        href="/camera"
                        className="text-[10px] text-primary font-mono hover:underline flex items-center gap-0.5"
                      >
                        <span className="material-symbols-outlined text-xs">videocam</span>
                        {alert.cameraId}
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-on-surface-variant">
                    {alert.timestamp}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {alert.assignedOfficer || (
                      <span className="text-on-surface-variant/60 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        alert.status === "active"
                          ? "danger"
                          : alert.status === "acknowledged"
                          ? "warning"
                          : "success"
                      }
                      size="sm"
                      dot
                    >
                      {alert.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {alert.status === "active" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAcknowledge(alert.id)}
                      >
                        Ack
                      </Button>
                    ) : (
                      <span className="text-emerald-600 font-bold text-[11px]">Logged</span>
                    )}
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
