"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cameraService } from "@/features/cameras/services/cameraService";
import { CameraStream } from "@/features/cameras/types";

export default function MissionControlPage() {
  const [cameras, setCameras] = useState<CameraStream[]>([]);

  useEffect(() => {
    cameraService.getCameras().then(setCameras);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 text-white border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <h2 className="text-lg font-bold tracking-tight">MISSION CONTROL • LIVE MONITORING</h2>
            <p className="text-xs text-slate-400 font-mono">
              Synchronized Multi-Sensor Feeds & GIS Tactical Positioning
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" size="md">
            GIS Online (0.4ms)
          </Badge>
          <Link href="/emergency">
            <Button variant="danger" size="sm" icon="e911_emergency">
              Red Alert
            </Button>
          </Link>
        </div>
      </div>

      {/* Multi-Camera Stream Grid */}
      <div className={`grid gap-4 ${cameras.length === 1 ? 'grid-cols-1 max-w-4xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
        {cameras.length === 0 ? (
          <div className="col-span-1 p-12 flex flex-col items-center justify-center text-slate-400 bg-slate-900 border border-slate-800 rounded-xl border-dashed">
            <span className="material-symbols-outlined text-4xl mb-2">videocam_off</span>
            <p className="font-medium">No active video feed</p>
            <p className="text-sm">Upload a video to start virtual CCTV replay</p>
            <Link href="/ai-analysis">
              <Button variant="primary" size="sm" className="mt-4">Upload Video</Button>
            </Link>
          </div>
        ) : (
          cameras.map((cam, idx) => (
            <div
              key={cam.id}
              className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex flex-col justify-between p-4 text-white shadow-xl"
            >
              {/* Stream Image / Video Background */}
              {cam.videoUrl ? (
                <video
                  src={cam.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-slate-500 flex-col">
                   <span className="material-symbols-outlined text-4xl mb-2">error_outline</span>
                   <span>No feed available</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40" />

              {/* Header Overlay */}
              <div className="relative z-10 flex flex-col gap-1 items-start">
                <span className="px-2.5 py-1 text-[11px] font-bold font-mono bg-slate-900/90 backdrop-blur-md rounded-md text-emerald-400 flex items-center gap-1.5 border border-emerald-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {cam.videoUrl ? "AI ANALYSIS ACTIVE" : `FEED 0${idx + 1}`} • {cam.name}
                </span>
                {cam.videoUrl && (
                   <span className="text-[10px] font-mono text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700">
                     Live simulated computer vision feed connected
                   </span>
                )}
              </div>

              {/* Footer Overlay */}
              <div className="relative z-10 flex items-center justify-between text-xs font-mono bg-slate-900/90 backdrop-blur-md p-2.5 rounded-lg border border-slate-700 mt-auto">
                <span className="text-slate-300">{cam.zone}</span>
                <div className="flex gap-2 items-center">
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {cam.resolution}
                  </span>
                  <span className="text-emerald-400 font-bold">FPS: {cam.fps}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
