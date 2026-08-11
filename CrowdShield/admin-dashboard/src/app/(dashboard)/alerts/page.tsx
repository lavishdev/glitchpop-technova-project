"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alertService } from "@/features/alerts/services/alertService";
import { AlertItem } from "@/features/alerts/types";
import { DataTable, Column } from "@/components/data/DataTable";

export default function AlertsHistoryPage() {
  const queryClient = useQueryClient();
  const { data: alerts = [], isLoading, isError } = useQuery({ queryKey: ["alerts"], queryFn: alertService.getAlerts });
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");

  const filteredAlerts = alerts.filter((alert) => {
    return selectedSeverity === "all" || alert.severity === selectedSeverity;
  });

  const updateAlertStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => alertService.updateAlertStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  const handleAcknowledge = (id: string) => {
    updateAlertStatus.mutate({ id, status: "acknowledged" });
  };

  const columns: Column<AlertItem>[] = [
    {
      header: "Alert ID",
      accessorKey: "id",
      sortable: true,
      cell: (alert) => <span className="font-mono font-bold text-primary">{alert.id}</span>
    },
    {
      header: "Severity",
      accessorKey: "severity",
      sortable: true,
      cell: (alert) => (
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
      )
    },
    {
      header: "Title & Description",
      accessorKey: "title",
      sortable: true,
      cell: (alert) => (
        <div>
          <p className="font-bold text-on-surface">{alert.title}</p>
          <p className="text-[11px] text-on-surface-variant">{alert.description}</p>
        </div>
      )
    },
    {
      header: "Location / Camera",
      accessorKey: "location",
      sortable: true,
      cell: (alert) => (
        <div>
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
        </div>
      )
    },
    {
      header: "Timestamp",
      accessorKey: "timestamp",
      sortable: true,
      cell: (alert) => <span className="font-mono text-on-surface-variant">{alert.timestamp}</span>
    },
    {
      header: "Assigned Officer",
      accessorKey: "assignedOfficer",
      sortable: true,
      cell: (alert) => (
        <span className="font-semibold">
          {alert.assignedOfficer || (
            <span className="text-on-surface-variant/60 italic">Unassigned</span>
          )}
        </span>
      )
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (alert) => (
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
      )
    },
    {
      header: "Actions",
      cell: (alert) => (
        <div className="text-right">
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
        </div>
      )
    }
  ];

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

      {/* Filter Bar */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm font-semibold text-on-surface-variant">
            Filter by Severity:
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
        <DataTable
          columns={columns}
          data={filteredAlerts}
          isLoading={isLoading}
          isError={isError}
          searchKey="title"
          searchPlaceholder="Search alert title..."
        />
      </Card>
    </div>
  );
}
