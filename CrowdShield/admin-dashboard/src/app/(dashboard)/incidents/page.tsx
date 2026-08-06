"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { apiClient } from "@/services/apiClient";
import { IncidentRecord } from "@/types/domain";

export default function IncidentManagementPage() {
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<IncidentRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    apiClient.getIncidents().then((data) => {
      setIncidents(data);
      if (data.length > 0) setSelectedIncident(data[0]);
    });
  }, []);

  const handleAddNote = () => {
    if (!newNote || !selectedIncident) return;
    const updatedIncidents = incidents.map((inc) => {
      if (inc.id === selectedIncident.id) {
        return {
          ...inc,
          notes: [...inc.notes, newNote],
        };
      }
      return inc;
    });
    setIncidents(updatedIncidents);
    setSelectedIncident({
      ...selectedIncident,
      notes: [...selectedIncident.notes, newNote],
    });
    setNewNote("");
  };

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
              onClick={() => setSelectedIncident(inc)}
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
                    inc.severity === "critical"
                      ? "danger"
                      : inc.severity === "high"
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
                <span>{inc.zone}</span>
                <span className="font-mono">{inc.reportedAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right 2-Cols: Detailed Incident View */}
        <div className="lg:col-span-2">
          {selectedIncident ? (
            <Card
              title={selectedIncident.title}
              subtitle={`Ticket ID: ${selectedIncident.id} • Reported at ${selectedIncident.reportedAt}`}
              icon="local_police"
              action={
                <Badge variant="warning" size="md">
                  Status: {selectedIncident.status}
                </Badge>
              }
            >
              <div className="space-y-6">
                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs">
                  <div>
                    <span className="text-on-surface-variant block text-[10px] uppercase font-bold">
                      Category
                    </span>
                    <span className="font-bold text-on-surface mt-0.5 block">
                      {selectedIncident.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[10px] uppercase font-bold">
                      Zone Location
                    </span>
                    <span className="font-bold text-on-surface mt-0.5 block">
                      {selectedIncident.zone}
                    </span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[10px] uppercase font-bold">
                      Assigned Officer
                    </span>
                    <span className="font-bold text-primary mt-0.5 block">
                      {selectedIncident.assignedTo}
                    </span>
                  </div>
                </div>

                {/* Assigned Response Units */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                    Deployed Field Units
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedIncident.responseUnits.map((unit) => (
                      <span
                        key={unit}
                        className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface text-xs font-semibold border border-outline-variant flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm text-primary">
                          local_tactical
                        </span>
                        {unit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Timeline & Tactical Notes */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                    Tactical Log & Updates
                  </h4>
                  <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                    {selectedIncident.notes.map((note, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-surface-container-low text-xs border border-outline-variant/40 font-mono text-on-surface"
                      >
                        • {note}
                      </div>
                    ))}
                  </div>

                  {/* Add Note Bar */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tactical update note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <Button variant="primary" size="md" onClick={handleAddNote}>
                      Post Update
                    </Button>
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
