"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { StatCard } from "@/components/cards/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkeletonLoader } from "@/components/data/SkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/features/dashboard/services/dashboardService";
import { StatMetric, ZoneAnalytics } from "@/features/dashboard/types";
import { AlertItem } from "@/features/alerts/types";
import { CameraStream } from "@/features/cameras/types";

export default function DashboardOverviewPage() {
  const { data: metrics = [], isLoading: loadingMetrics } = useQuery({ queryKey: ['stats'], queryFn: dashboardService.getStats });
  const { data: zones = [], isLoading: loadingZones } = useQuery({ queryKey: ['zoneAnalytics'], queryFn: dashboardService.getZoneAnalytics });
  const { data: alerts = [], isLoading: loadingAlerts } = useQuery({ queryKey: ['recentAlerts'], queryFn: dashboardService.getRecentAlerts });
  const { data: cameras = [], isLoading: loadingCameras } = useQuery({ queryKey: ['cameras'], queryFn: dashboardService.getCameraFeeds });

  const loading = loadingMetrics || loadingZones || loadingAlerts || loadingCameras;

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonLoader key={i} height={120} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonLoader className="lg:col-span-2" height={320} />
          <SkeletonLoader height={320} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary-container/10 to-surface-container border border-primary/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-primary text-white rounded uppercase tracking-wider">
              LIVE SYSTEM OPERATIONAL
            </span>
            <span className="text-xs text-on-surface-variant font-mono">
              Refreshed: 13:52:04 IST
            </span>
          </div>
          <h2 className="text-xl font-bold text-on-surface tracking-tight mt-1">
            CrowdShield Command Dashboard
          </h2>
          <p className="text-xs text-on-surface-variant">
            Real-time computer vision spatial tracking and automated threat mitigation.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/dashboard/enhanced">
            <Button variant="outline" size="sm" icon="insights">
              Enhanced Mode
            </Button>
          </Link>
          <Link href="/mission-control">
            <Button variant="primary" size="sm" icon="radar">
              Mission Control
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <StatCard 
            key={metric.title} 
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            change={metric.change}
            isPositive={metric.isPositive}
            description={metric.description}
          />
        ))}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Cols: Zone Densities & Live Stream Snippets */}
        <div className="lg:col-span-2 space-y-6">
          {/* Zone Capacity Matrix */}
          <Card
            title="Real-Time Sector Densities"
            subtitle="Monitored capacities across key entrance points"
            icon="grid_view"
            action={
              <Link href="/analytics" className="text-xs font-semibold text-primary hover:underline">
                Analytics Details →
              </Link>
            }
          >
            <div className="space-y-4">
              {zones.map((zone) => (
                <div key={zone.zoneId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-on-surface">{zone.zoneName}</span>
                      <span className="text-on-surface-variant/70 text-[11px] font-mono">
                        ({zone.zoneId})
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-on-surface font-mono">
                        {zone.currentDensity.toLocaleString()} / {zone.maxCapacity.toLocaleString()}
                      </span>
                      <Badge
                        variant={
                          zone.status === "critical"
                            ? "danger"
                            : zone.status === "congested"
                            ? "warning"
                            : zone.status === "moderate"
                            ? "info"
                            : "success"
                        }
                        size="sm"
                      >
                        {zone.capacityPercentage}% Cap
                      </Badge>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        zone.capacityPercentage > 90
                          ? "bg-error"
                          : zone.capacityPercentage > 80
                          ? "bg-amber-500"
                          : zone.capacityPercentage > 60
                          ? "bg-primary"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${zone.capacityPercentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Camera Feed Snippets */}
          <Card
            title="Live Camera Feeds"
            subtitle="Active Optical & Thermal Sensors"
            icon="videocam"
            action={
              <Link href="/camera" className="text-xs font-semibold text-primary hover:underline">
                View All 248 Feeds →
              </Link>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cameras.slice(0, 2).map((cam) => (
                <div
                  key={cam.id}
                  className="group relative rounded-xl overflow-hidden border border-outline-variant/60 bg-slate-900 aspect-video flex flex-col justify-between p-3 text-white"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${cam.streamUrl})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  
                  {/* Top Feed Info */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-900/80 backdrop-blur-md rounded text-emerald-400 flex items-center gap-1 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      LIVE • {cam.fps} FPS
                    </span>
                    <span className="text-[10px] font-mono text-slate-300 bg-slate-900/80 px-1.5 py-0.5 rounded">
                      {cam.id}
                    </span>
                  </div>

                  {/* Bottom Feed Label */}
                  <div className="relative z-10">
                    <p className="text-xs font-bold text-white truncate">{cam.name}</p>
                    <p className="text-[10px] text-slate-300 font-mono">{cam.zone} • {cam.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 1-Col: Active Critical Threat Alerts & Quick Actions */}
        <div className="space-y-6">
          {/* Active Threat Feed */}
          <Card
            title="Active Threat Alerts"
            subtitle="Prioritized safety queue"
            icon="notifications_active"
            action={
              <Link href="/alerts" className="text-xs font-semibold text-primary hover:underline">
                Alert History →
              </Link>
            }
          >
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-xl border border-outline-variant/60 bg-surface-container-low hover:bg-surface-container transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
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
                    <span className="text-[10px] text-on-surface-variant font-mono">
                      {alert.timestamp}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">{alert.title}</h4>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      {alert.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-on-surface-variant/80 border-t border-outline-variant/30">
                    <span className="truncate">{alert.location}</span>
                    <Link
                      href="/incidents"
                      className="text-primary font-bold hover:underline shrink-0"
                    >
                      Dispatch →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Dispatch Action Panel */}
          <Card title="Quick Command Actions" icon="flash_on">
            <div className="space-y-2.5">
              <Link href="/emergency" className="block">
                <Button variant="danger" size="md" className="w-full justify-start" icon="e911_emergency">
                  Trigger Red Alert Evacuation
                </Button>
              </Link>
              <Link href="/incidents" className="block">
                <Button variant="secondary" size="md" className="w-full justify-start" icon="add_alert">
                  Create Incident Ticket
                </Button>
              </Link>
              <Link href="/users" className="block">
                <Button variant="outline" size="md" className="w-full justify-start" icon="shield_person">
                  Assign Officer Roster
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
