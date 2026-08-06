"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/services/apiClient";
import { ZoneAnalytics } from "@/types/domain";

export default function CrowdAnalyticsPage() {
  const [zones, setZones] = useState<ZoneAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getZoneAnalytics().then((data) => {
      setZones(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface tracking-tight">
            Crowd Analytics & Flow Intelligence
          </h2>
          <p className="text-xs text-on-surface-variant">
            Historical ingress rates, exit throughput, and dwell duration dynamics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon="file_download">
            Export CSV Report
          </Button>
          <Button variant="primary" size="sm" icon="print">
            Print Analytics Summary
          </Button>
        </div>
      </div>

      {/* Overview Analytics Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Peak Density Sector" icon="warning">
          <p className="text-xl font-bold text-error font-mono">North Concourse</p>
          <p className="text-xs text-on-surface-variant mt-1">94% Max Capacity Reached</p>
        </Card>
        <Card title="Avg Dwell Duration" icon="timer">
          <p className="text-xl font-bold text-on-surface font-mono">28.5 minutes</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">-3.4 min vs last event</p>
        </Card>
        <Card title="Total Hourly Ingress" icon="login">
          <p className="text-xl font-bold text-primary font-mono">1,590 pax / hr</p>
          <p className="text-xs text-on-surface-variant mt-1">+14% surge between 12:00 - 13:00</p>
        </Card>
        <Card title="Turnstile Efficiency" icon="speed">
          <p className="text-xl font-bold text-emerald-600 font-mono">98.2%</p>
          <p className="text-xs text-on-surface-variant mt-1">Zero throughput bottlenecks</p>
        </Card>
      </div>

      {/* Sector Flow Rates Table */}
      <Card
        title="Sector Spatial Flow & Capacity breakdown"
        subtitle="Detailed metrics across all monitored venue zones"
        icon="analytics"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant uppercase font-bold tracking-wider border-b border-outline-variant/60">
              <tr>
                <th className="px-4 py-3">Zone Code</th>
                <th className="px-4 py-3">Sector Name</th>
                <th className="px-4 py-3">Occupancy / Max</th>
                <th className="px-4 py-3">Capacity Status</th>
                <th className="px-4 py-3">Ingress (in/min)</th>
                <th className="px-4 py-3">Egress (out/min)</th>
                <th className="px-4 py-3">Avg Dwell</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-on-surface font-medium">
              {zones.map((zone) => (
                <tr key={zone.zoneId} className="hover:bg-surface-container/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-primary">{zone.zoneId}</td>
                  <td className="px-4 py-3 font-bold">{zone.zoneName}</td>
                  <td className="px-4 py-3 font-mono">
                    {zone.currentDensity.toLocaleString()} / {zone.maxCapacity.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        zone.status === "critical"
                          ? "danger"
                          : zone.status === "congested"
                          ? "warning"
                          : "success"
                      }
                      size="sm"
                    >
                      {zone.capacityPercentage}% ({zone.status})
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-emerald-600">+{zone.flowRateIn}</td>
                  <td className="px-4 py-3 font-mono text-amber-600">-{zone.flowRateOut}</td>
                  <td className="px-4 py-3 font-mono">{zone.dwellTimeMinutes} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
