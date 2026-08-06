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
    mutationFn: ({ id }: { id: number }) => alertService.updateAlertStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  const handleAcknowledge = (id: number) => {
    updateAlertStatus.mutate({ id });
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
            alert.severity === "CRITICAL"
              ? "danger"
              : alert.severity === "HIGH"
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
      header: "Type & Message",
      accessorKey: "type",
      sortable: true,
      cell: (alert) => (
        <div>
          <p className="font-bold text-on-surface">{alert.type}</p>
          <p className="text-[11px] text-on-surface-variant">{alert.message}</p>
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
        </div>
      )
    },
    {
      header: "Timestamp",
      accessorKey: "createdAt",
      sortable: true,
      cell: (alert) => <span className="font-mono text-on-surface-variant">{new Date(alert.createdAt).toLocaleString()}</span>
    },

    {
      header: "Status",
      accessorKey: "read",
      sortable: true,
      cell: (alert) => (
        <Badge
          variant={alert.read ? "success" : "danger"}
          size="sm"
          dot
        >
          {alert.read ? "Read" : "Active"}
        </Badge>
      )
    },
    {
      header: "Actions",
      cell: (alert) => (
        <div className="text-right">
          {!alert.read ? (
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
          searchKey="type"
          searchPlaceholder="Search alert type..."
        />
      </Card>
    </div>
  );
}
