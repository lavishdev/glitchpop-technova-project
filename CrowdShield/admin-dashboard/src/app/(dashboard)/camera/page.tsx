"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cameraService } from "@/features/cameras/services/cameraService";
import { CameraStream } from "@/features/cameras/types";

export default function CameraInfrastructurePage() {
  const queryClient = useQueryClient();
  const { data: cameras = [] } = useQuery({ queryKey: ["cameras"], queryFn: cameraService.getCameras });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCamName, setNewCamName] = useState("");
  const [newCamZone, setNewCamZone] = useState("");
  const [newCamIp, setNewCamIp] = useState("");

  const handleAddCamera = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCamName) return;

    const newCam: CameraStream = {
      id: Math.floor(100 + Math.random() * 900),
      name: newCamName,
      location: "Local Deploy",
      zone: newCamZone || "Main Sector",
      status: "ONLINE",
      lastSeen: new Date().toISOString(),
      healthPercentage: 100,
      resolution: "4K UHD",
      fps: 60,
    };

    queryClient.setQueryData<CameraStream[]>(["cameras"], (old) => {
      return old ? [newCam, ...old] : [newCam];
    });
    setIsAddModalOpen(false);
    setNewCamName("");
    setNewCamZone("");
    setNewCamIp("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface tracking-tight">
            Camera Infrastructure & Sensor Array
          </h2>
          <p className="text-xs text-on-surface-variant">
            248 active optical, thermal, and wide-angle CCTV feeds across all stadium zones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon="add_a_photo"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Camera Sensor
          </Button>
        </div>
      </div>

      {/* Grid of Feeds */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {cameras.map((cam) => (
          <Card
            key={cam.id}
            title={cam.name}
            subtitle={`${cam.zone} • ${cam.location}`}
            icon="videocam"
            action={
              <Badge
                variant={
                  cam.status === "ONLINE"
                    ? "success"
                    : cam.status === "MAINTENANCE"
                    ? "warning"
                    : "danger"
                }
                size="sm"
                dot
              >
                {cam.status}
              </Badge>
            }
          >
            <div className="space-y-3">
              {/* Simulated Video Stream Canvas */}
              <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video border border-slate-800 flex flex-col justify-between p-3 text-white">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-85"
                  style={{ backgroundImage: `url(https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80)` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />

                {/* Top Feed Overlay Info */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-slate-900/90 backdrop-blur-md rounded text-emerald-400 flex items-center gap-1.5 border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE FEED • {cam.fps} FPS
                  </span>
                  <span className="text-[10px] font-mono text-slate-300 bg-slate-900/90 px-2 py-1 rounded border border-slate-700">
                    {cam.resolution}
                  </span>
                </div>

                {/* Bottom Stream Controls Overlay */}
                <div className="relative z-10 flex items-center justify-between text-xs bg-slate-900/80 backdrop-blur-md p-2 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-blue-400 font-bold">Optical PTZ</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300">
                      AI Vision: ACTIVE
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      className="p-1 hover:bg-slate-700 rounded text-slate-300"
                      title="PTZ Pan/Tilt"
                    >
                      <span className="material-symbols-outlined text-base">open_with</span>
                    </button>
                    <button
                      className="p-1 hover:bg-slate-700 rounded text-slate-300"
                      title="Full Screen"
                    >
                      <span className="material-symbols-outlined text-base">fullscreen</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-on-surface-variant font-mono">ID: {cam.id}</span>
                <Button variant="ghost" size="sm" icon="tune">
                  Configure Stream
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Camera Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Camera Sensor"
        subtitle="Provision optical or thermal CCTV feed onto the CrowdShield network."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddCamera}>
              Provision Sensor
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddCamera} className="space-y-4">
          <Input
            label="Camera Name"
            placeholder="e.g. Turnstile 8 Wide Angle"
            value={newCamName}
            onChange={(e) => setNewCamName(e.target.value)}
            required
          />
          <Input
            label="Zone Sector"
            placeholder="e.g. North Concourse"
            value={newCamZone}
            onChange={(e) => setNewCamZone(e.target.value)}
          />
          <Input
            label="Static IP Address"
            placeholder="e.g. 192.168.10.150"
            value={newCamIp}
            onChange={(e) => setNewCamIp(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
}
