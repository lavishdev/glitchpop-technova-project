"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { incidentService } from "@/features/incidents/services/incidentService";
import { IncidentRecord } from "@/features/incidents/types";

export default function IncidentManagementPage() {
  const queryClient = useQueryClient();
  const { data: incidents = [] } = useQuery({ queryKey: ["incidents"], queryFn: incidentService.getIncidents });
  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(null);
  
  const selectedIncident = incidents.find(inc => inc.id === selectedIncidentId) || (incidents.length > 0 && !selectedIncidentId ? incidents[0] : null);

  const updateIncidentMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IncidentRecord> }) => incidentService.updateIncident(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface tracking-tight">
            Incident Management & Field Dispatch
          </h2>
          <p className="text-xs text-on-surface-variant">
            Active security tickets, tactical officer assignment, and tactical unit coordination.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" icon="add_alert">
            Create Incident Ticket
          </Button>
        </div>
      </div>

      {/* Main Master-Detail Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Ticket Queue */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">
            Active Incident Tickets ({incidents.length})
          </h3>
          {incidents.map((inc) => (
            <div
              key={inc.id}
              onClick={() => setSelectedIncidentId(inc.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                selectedIncident?.id === inc.id
                  ? "bg-primary-fixed/20 border-primary shadow-sm"
                  : "bg-surface-container-lowest border-outline-variant/60 hover:border-outline"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary">{inc.id}</span>
                <Badge
                  variant={
                    inc.severity === "CRITICAL"
                      ? "danger"
                      : inc.severity === "HIGH"
                      ? "warning"
                      : "info"
                  }
                  size="sm"
                >
                  {inc.severity}
                </Badge>
              </div>
              <h4 className="text-xs font-bold text-on-surface">{inc.title}</h4>
              <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                <span>{inc.location}</span>
                <span className="font-mono">{new Date(inc.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right 2-Cols: Detailed Incident View */}
        <div className="lg:col-span-2">
          {selectedIncident ? (
            <Card
              title={selectedIncident.title}
              subtitle={`Ticket ID: ${selectedIncident.id} • Reported at ${new Date(selectedIncident.createdAt).toLocaleString()}`}
              icon="local_police"
              action={
                <Badge variant="warning" size="md">
                  Status: {selectedIncident.status}
                </Badge>
              }
            >
              <div className="space-y-6">
                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm">
                  <div>
                    <span className="text-on-surface-variant block text-xs uppercase font-bold">
                      Description
                    </span>
                    <span className="font-bold text-on-surface mt-1 block">
                      {selectedIncident.description}
                    </span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-xs uppercase font-bold">
                      Location
                    </span>
                    <span className="font-bold text-on-surface mt-1 block">
                      {selectedIncident.location}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <p className="text-xs text-on-surface-variant text-center py-8">
                Select an incident ticket to view telemetry details.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
