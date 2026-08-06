"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/services/apiClient";
import { CameraStream } from "@/types/domain";

export default function MissionControlPage() {
  const [cameras, setCameras] = useState<CameraStream[]>([]);

  useEffect(() => {
    apiClient.getCameras().then(setCameras);
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

      {/* 2x2 Multi-Camera Stream Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cameras.slice(0, 4).map((cam, idx) => (
          <div
            key={cam.id}
            className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex flex-col justify-between p-4 text-white shadow-xl"
          >
            {/* Stream Image Background */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-85"
              style={{ backgroundImage: `url(${cam.streamUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40" />

            {/* Header Overlay */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-2.5 py-1 text-[11px] font-bold font-mono bg-slate-900/90 backdrop-blur-md rounded-md text-emerald-400 flex items-center gap-1.5 border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                FEED 0{idx + 1} • {cam.name}
              </span>
              <span className="text-[10px] font-mono text-slate-300 bg-slate-900/90 px-2 py-1 rounded border border-slate-700">
                {cam.resolution}
              </span>
            </div>

            {/* AI Bounding Box Overlay Graphic */}
            <div className="relative z-10 self-center border-2 border-emerald-400/80 rounded px-4 py-2 bg-emerald-500/10 backdrop-blur-xs font-mono text-[11px] text-emerald-300 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">center_focus_strong</span>
              <span>AI DETECT: OPTICAL CLEAR (0.94)</span>
            </div>

            {/* Footer Overlay */}
            <div className="relative z-10 flex items-center justify-between text-xs font-mono bg-slate-900/90 backdrop-blur-md p-2.5 rounded-lg border border-slate-700">
              <span className="text-slate-300">{cam.zone}</span>
              <span className="text-emerald-400 font-bold">FPS: {cam.fps}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
