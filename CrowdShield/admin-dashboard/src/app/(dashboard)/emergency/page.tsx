"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { apiClient } from "@/services/apiClient";
import { EmergencyProtocol } from "@/types/domain";

export default function EmergencyResponsePage() {
  const [protocols, setProtocols] = useState<EmergencyProtocol[]>([]);
  const [activeProtocol, setActiveProtocol] = useState<EmergencyProtocol | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    apiClient.getEmergencyProtocols().then((data) => {
      setProtocols(data);
      if (data.length > 0) setActiveProtocol(data[0]);
    });
  }, []);

  const handleTriggerRedAlert = () => {
    setIsConfirmModalOpen(false);
    if (activeProtocol) {
      setProtocols((prev) =>
        prev.map((p) =>
          p.id === activeProtocol.id ? { ...p, activeState: true } : p
        )
      );
      setActiveProtocol({ ...activeProtocol, activeState: true });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Alert Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-amber-700 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl animate-pulse">
                e911_emergency
              </span>
            </div>
            <div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-white/20 text-white rounded uppercase tracking-wider">
                CRITICAL THREAT PROTOCOL SYSTEM
              </span>
              <h2 className="text-2xl font-black tracking-tight mt-0.5">
                Emergency Dispatch & Evacuation Control
              </h2>
            </div>
          </div>
          <Button
            variant="danger"
            size="lg"
            className="bg-white text-red-700 hover:bg-slate-100 font-bold shadow-lg"
            icon="report_problem"
            onClick={() => setIsConfirmModalOpen(true)}
          >
            INITIATE CODE RED
          </Button>
        </div>
        <p className="text-xs text-red-100 max-w-3xl">
          Warning: Activating emergency protocols triggers automated public address vocal sirens, unlocks all turnstile fire doors, and broadcasts direct telemetry to municipal authorities.
        </p>
      </div>

      {/* Protocols Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Protocol Select */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
            Available Emergency Protocols
          </h3>
          {protocols.map((p) => (
            <div
              key={p.id}
              onClick={() => setActiveProtocol(p)}
              className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                activeProtocol?.id === p.id
                  ? "bg-red-500/10 border-red-500 shadow-sm"
                  : "bg-surface-container-lowest border-outline-variant/60 hover:border-outline"
              }`}
            >
              <div className="flex items-center justify-between">
                <Badge variant={p.activeState ? "danger" : "outline"} size="sm">
                  {p.code}
                </Badge>
                {p.activeState && (
                  <span className="text-xs font-bold text-red-600 animate-pulse">
                    ACTIVE NOW
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-on-surface">{p.name}</h4>
              <p className="text-xs text-on-surface-variant line-clamp-2">{p.description}</p>
            </div>
          ))}
        </div>

        {/* Right 2-Cols: Active Protocol Action Plan */}
        <div className="lg:col-span-2">
          {activeProtocol ? (
            <Card
              title={activeProtocol.name}
              subtitle={`Protocol Code: ${activeProtocol.code} • Clearance Level: ${activeProtocol.requiredClearance}`}
              icon="shield_with_heart"
              action={
                <Badge variant={activeProtocol.activeState ? "danger" : "info"} size="md">
                  {activeProtocol.activeState ? "DISPATCHED" : "STANDBY"}
                </Badge>
              }
            >
              <div className="space-y-6">
                <p className="text-xs text-on-surface-variant">{activeProtocol.description}</p>

                {/* Steps Checklist */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface mb-3">
                    Automated Procedure Execution Checklist
                  </h4>
                  <div className="space-y-2.5">
                    {activeProtocol.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-medium text-on-surface"
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                            activeProtocol.activeState
                              ? "bg-emerald-500 text-white"
                              : "bg-surface-container-high text-on-surface-variant"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <span className="flex-1">{step}</span>
                        {activeProtocol.activeState && (
                          <span className="material-symbols-outlined text-emerald-600 text-lg">
                            check_circle
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Affected Zones */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                    Affected Sectors
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeProtocol.affectedZones.map((z) => (
                      <Badge key={z} variant="danger" size="sm">
                        {z}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Broadcast PA Button */}
                <div className="pt-4 border-t border-outline-variant/40 flex justify-end gap-3">
                  <Button
                    variant="danger"
                    size="md"
                    icon="campaign"
                    onClick={() => setIsConfirmModalOpen(true)}
                  >
                    Broadcast PA Vocal Siren
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <p className="text-xs text-on-surface-variant text-center py-8">
                Select a protocol to view steps.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Emergency Protocol Execution"
        subtitle="This action will issue central evacuation sirens and unlock all emergency doors."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleTriggerRedAlert}>
              Confirm Execution
            </Button>
          </>
        }
      >
        <div className="p-4 rounded-xl bg-error-container/40 border border-error/30 text-on-error-container text-xs space-y-2">
          <p className="font-bold flex items-center gap-2">
            <span className="material-symbols-outlined">warning</span>
            SUPER ADMIN CONFIRMATION REQUIRED
          </p>
          <p>
            Are you sure you want to execute <strong>{activeProtocol?.name}</strong> across monitored sectors?
          </p>
        </div>
      </Modal>
    </div>
  );
}
