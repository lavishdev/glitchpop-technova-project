"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { dashboardService } from "@/features/dashboard/services/dashboardService";
import { ZoneAnalytics } from "@/features/dashboard/types";

export default function DashboardEnhancedPage() {
  const [zones, setZones] = useState<ZoneAnalytics[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>("ZONE-01");

  useEffect(() => {
    dashboardService.getZoneAnalytics().then(setZones);
  }, []);

  const activeZone = zones.find((z) => z.zoneId === selectedZone) || zones[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="info" size="sm">
              ENHANCED INTELLIGENCE
            </Badge>
            <span className="text-xs text-on-surface-variant font-mono">
              AI Vision Pipeline v4.2 Active
            </span>
          </div>
          <h2 className="text-xl font-bold text-on-surface tracking-tight mt-1">
            Enhanced Predictive Dashboard
          </h2>
          <p className="text-xs text-on-surface-variant">
            Deep spatial telemetry, thermal heatmap layers, and automated crowd dispersal modeling.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="outline" size="sm" icon="arrow_back">
              Standard View
            </Button>
          </Link>
          <Link href="/mission-control">
            <Button variant="primary" size="sm" icon="radar">
              Full Map Control
            </Button>
          </Link>
        </div>
      </div>

      {/* Heatmap & Threat Gauge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spatial Density Heatmap Canvas Representation */}
        <Card
          className="lg:col-span-2"
          title="Live Density Heatmap Analysis"
          subtitle="Real-time occupancy gradient across venue sectors"
          icon="map"
          action={
            <div className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant">Zone:</span>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                aria-label="Select zone for detailed telemetry"
                className="bg-surface-container-low border border-outline-variant text-on-surface text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-primary"
              >
                {zones.map((z) => (
                  <option key={z.zoneId} value={z.zoneId}>
                    {z.zoneName}
                  </option>
                ))}
              </select>
            </div>
          }
        >
          {/* Simulated Spatial Heatmap Container */}
          <div className="relative w-full h-80 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between text-white">
            {/* Heatmap Grid Backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
            
            {/* Heatmap Hotspots */}
            <div className="absolute top-1/4 left-1/3 w-40 h-40 bg-red-600/40 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-amber-500/30 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl" />

            {/* Overlay Telemetry HUD */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-mono font-bold text-red-400">
                  CRITICAL SURGE DETECTED
                </span>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono">
                FOV: 120° • Thermal Overlay: 100%
              </div>
            </div>

            {/* Zone Telemetry Card */}
            {activeZone && (
              <div className="relative z-10 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">ZONE ID</span>
                  <span className="font-bold text-white text-sm">{activeZone.zoneId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">DENSITY RATE</span>
                  <span className="font-bold text-blue-400 text-sm">
                    {activeZone.currentDensity.toLocaleString()} pax
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">AVG DWELL TIME</span>
                  <span className="font-bold text-amber-400 text-sm">
                    {activeZone.dwellTimeMinutes} mins
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">FLOW RATE IN/OUT</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    +{activeZone.flowRateIn} / -{activeZone.flowRateOut}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Threat Level Index & Dispersal Recommendation */}
        <div className="space-y-6">
          <Card title="Facility Threat Index" icon="speed">
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-8 border-amber-500/20 bg-amber-500/5 my-2">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-amber-600 tracking-tight">LEVEL 3</span>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mt-1">
                    ELEVATED SURGE
                  </span>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant mt-2">
                Automated threshold advisory: Reroute turnstiles 4 & 5 to prevent choke points.
              </p>
            </div>
          </Card>

          <Card title="Predictive Action Plan" icon="auto_fix_high">
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60">
                <p className="font-bold text-on-surface">Step 1: Open Gates 5 & 6</p>
                <p className="text-on-surface-variant text-[11px] mt-0.5">
                  Est. density drop: -18% within 8 minutes.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60">
                <p className="font-bold text-on-surface">Step 2: Dispatch Officer Sarah Chen</p>
                <p className="text-on-surface-variant text-[11px] mt-0.5">
                  Position at East Promenade barrier junction.
                </p>
              </div>
              <Link href="/incidents" className="block pt-1">
                <Button variant="primary" size="sm" className="w-full" icon="send">
                  Execute Dispersal Plan
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
