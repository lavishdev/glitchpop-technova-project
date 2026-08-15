"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import axiosClient from "@/services/api/axiosClient";
import { dashboardService } from "@/features/dashboard/services/dashboardService";
import { ZoneAnalytics } from "@/features/dashboard/types";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function DashboardEnhancedPage() {
  const [zones, setZones] = useState<ZoneAnalytics[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>("ZONE-01");
  const [liveHeatmapUrl, setLiveHeatmapUrl] = useState<string | null>(null);
  const [liveHeatmapDensity, setLiveHeatmapDensity] = useState<number | null>(null);
  const [liveHeatmapRisk, setLiveHeatmapRisk] = useState<string | null>(null);

  useEffect(() => {
    dashboardService.getZoneAnalytics().then(setZones);

    // Fetch Initial State from Backend REST API
    const fetchLatestAnalysis = async () => {
      try {
        const res = await axiosClient.get('/analysis/latest');
        const result = res.data;
        
        if (result && Object.keys(result).length > 0) {
          const data = result;
          if (data.heatmapUrl) setLiveHeatmapUrl(data.heatmapUrl);
          if (data.density !== undefined) setLiveHeatmapDensity(data.density);
          if (data.riskScore !== undefined) setLiveHeatmapRisk(data.riskScore);
          if (data.ai_result) setAiResultData(data.ai_result);
        }
      } catch (err) {
        console.error("Failed to fetch latest analysis", err);
      }
    };
    fetchLatestAnalysis();

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080/ws-crowdshield';
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe('/topic/live-heatmap', (message) => {
        if (message.body) {
          const data = JSON.parse(message.body);
          if (data.heatmapUrl) {
            setLiveHeatmapUrl(data.heatmapUrl);
          } else if (data.ai_result && data.ai_result.heatmaps) {
            setLiveHeatmapUrl(`http://10.43.17.1:8000${data.ai_result.heatmaps.heatmaps_directory}/heatmap_000001.jpg`);
          }
          if (data.density !== undefined) setLiveHeatmapDensity(data.density);
          if (data.riskScore !== undefined) setLiveHeatmapRisk(data.riskScore);
          if (data.ai_result) setAiResultData(data.ai_result);
        }
      });
    };

    client.activate();
    return () => {
      client.deactivate();
    };
  }, []);

  const activeZone = zones.find((z) => z.zoneId === selectedZone) || zones[0];
  const [aiResultData, setAiResultData] = useState<any>(null);

  // Compute AI metrics if available
  const framesProcessed = aiResultData?.incident_report?.frames_processed;
  const peopleDetected = aiResultData?.incident_report?.people_detected;
  const detectionUrl = aiResultData?.person_detection?.detections_directory 
    ? `http://10.43.17.1:8000${aiResultData.person_detection.detections_directory}/frame_000001.jpg` 
    : null;

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
          title="Live AI Spatial Analysis"
          subtitle="Real-time occupancy gradient and YOLOv8 subject tracking"
          icon="map"
          action={
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30 uppercase tracking-widest">
                SIMULATED AI TELEMETRY
              </span>
            </div>
          }
        >
          {/* Main Visualizations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Heatmap Panel */}
            <div className="relative w-full h-80 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between text-white shadow-inner">
              <div className="absolute inset-0 z-0">
                {liveHeatmapUrl ? (
                  <img src={liveHeatmapUrl} alt="Live Density Heatmap" className="w-full h-full object-cover opacity-90" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
                    <span className="material-symbols-outlined text-4xl mb-2">satellite_alt</span>
                    <span>Upload a video to begin analysis.</span>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40 z-0" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className={`px-2.5 py-1 text-[11px] font-bold font-mono bg-slate-900/90 backdrop-blur-md rounded-md ${liveHeatmapUrl ? 'text-emerald-400 border-emerald-500/40' : 'text-slate-400 border-slate-700'} flex items-center gap-1.5 border`}>
                  <span className={`w-2 h-2 rounded-full ${liveHeatmapUrl ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                  {liveHeatmapUrl ? 'AI ANALYSIS ACTIVE' : 'AI ANALYSIS OFFLINE'}
                </span>
              </div>

              {framesProcessed && (
                <div className="relative z-10 flex flex-col items-center justify-center mt-4">
                  <span className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-t-lg border-t border-l border-r border-slate-700 text-[10px] font-bold text-emerald-400 tracking-widest">
                    LATEST AI ANALYSIS
                  </span>
                  <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-center shadow-2xl">
                    <p className="text-xs text-slate-300 font-mono mb-1">Processed {framesProcessed.toLocaleString()} frames</p>
                    <p className="text-sm font-bold text-white">{peopleDetected?.toLocaleString()} people detected</p>
                  </div>
                </div>
              )}

              <div className="relative z-10 text-xs font-mono bg-slate-900/90 backdrop-blur-md p-2 rounded-lg border border-slate-700 mt-auto self-start">
                CROWD DENSITY HEATMAP
              </div>
            </div>

            {/* YOLO Detection Panel */}
            <div className="relative w-full h-80 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between text-white shadow-inner">
              <div className="absolute inset-0 z-0">
                {detectionUrl ? (
                  <img src={detectionUrl} alt="YOLO Detections" className="w-full h-full object-cover opacity-90" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
                    <span className="material-symbols-outlined text-4xl mb-2">view_in_ar</span>
                    <span>No detection data</span>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40 z-0" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className={`px-2.5 py-1 text-[11px] font-bold font-mono bg-slate-900/90 backdrop-blur-md rounded-md ${detectionUrl ? 'text-emerald-400 border-emerald-500/40' : 'text-slate-400 border-slate-700'} flex items-center gap-1.5 border`}>
                  <span className={`w-2 h-2 rounded-full ${detectionUrl ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                  {detectionUrl ? 'YOLO DETECTION ACTIVE' : 'NO DETECTIONS'}
                </span>
              </div>

              <div className="relative z-10 text-xs font-mono bg-slate-900/90 backdrop-blur-md p-2 rounded-lg border border-slate-700 mt-auto self-start">
                YOLOv8 TRACKING
              </div>
            </div>

          </div>

          {/* Zone Telemetry Card */}
          {activeZone && (
            <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono mt-4">
              <div>
                <span className="text-slate-400 block text-[10px]">ZONE ID</span>
                <span className="font-bold text-white text-sm">{activeZone.zoneId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] truncate">DENSITY (AI ESTIMATE)</span>
                <span className="font-bold text-blue-400 text-sm">
                  {liveHeatmapDensity !== null ? liveHeatmapDensity.toLocaleString() : "0"} pax
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">AVG DWELL TIME</span>
                <span className="font-bold text-amber-400 text-sm">
                  {aiResultData ? "18.5 mins" : "Demo estimate"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">RISK SCORE</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {liveHeatmapRisk !== null ? liveHeatmapRisk : "0.0"}%
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* Threat Level Index & Dispersal Recommendation */}
        <div className="space-y-6">
          <Card title="Facility Threat Index" icon="speed">
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-8 border-amber-500/20 bg-amber-500/5 my-2">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-amber-600 tracking-tight">
                    {aiResultData?.incident_report?.overall_risk || "LEVEL 3"}
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mt-1">
                    {aiResultData ? "AI RISK RATING" : "ELEVATED SURGE"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant mt-2">
                {aiResultData?.incident_report?.summary || "Automated threshold advisory: Reroute turnstiles 4 & 5 to prevent choke points."}
              </p>
            </div>
          </Card>

          <Card title="Predictive Action Plan" icon="auto_fix_high">
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60">
                <p className="font-bold text-on-surface">AI Recommendation 1</p>
                <p className="text-on-surface-variant text-[11px] mt-0.5">
                  {aiResultData?.incident_report?.recommendations?.[0] || "Step 1: Open Gates 5 & 6"}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60">
                <p className="font-bold text-on-surface">AI Recommendation 2</p>
                <p className="text-on-surface-variant text-[11px] mt-0.5">
                  {aiResultData?.incident_report?.recommendations?.[1] || "Step 2: Dispatch Officer Sarah Chen"}
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
