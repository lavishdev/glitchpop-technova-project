"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { aiAnalysisService, AIAnalysisResult } from "@/features/analytics/services/aiAnalysisService";

export default function AIAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const data = await aiAnalysisService.uploadVideo(file);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface tracking-tight">
            AI Video Analysis Engine
          </h2>
          <p className="text-xs text-on-surface-variant">
            Upload CCTV footage for YOLOv8 object tracking, crowd density estimation, and anomaly detection.
          </p>
        </div>
      </div>

      <Card title="Video Upload" icon="upload_file">
        <div className="flex flex-col gap-4">
          <input
            type="file"
            accept="video/mp4,video/avi,video/mov"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-300
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-emerald-500 file:text-slate-900
              hover:file:bg-emerald-400"
          />
          <Button 
            variant="primary" 
            onClick={handleUpload} 
            disabled={!file || isUploading}
            icon={isUploading ? "sync" : "cloud_upload"}
            className={isUploading ? "animate-pulse" : ""}
          >
            {isUploading ? "Running AI Pipeline (This may take a minute)..." : "Process Video"}
          </Button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </Card>

      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Analysis Summary" icon="info">
              <div className="space-y-3 text-sm text-on-surface">
                <div className="flex justify-between border-b border-outline-variant/40 pb-2">
                  <span className="text-on-surface-variant font-medium">Processed</span>
                  <span className="font-bold">{result.incident_report.frames_processed} frames</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant/40 pb-2">
                  <span className="text-on-surface-variant font-medium">Detections</span>
                  <span className="font-bold">{result.incident_report.people_detected} people</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant/40 pb-2">
                  <span className="text-on-surface-variant font-medium">Highest Density</span>
                  <span className="font-bold">{result.incident_report.highest_density}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-on-surface-variant font-medium">Risk Level</span>
                  <Badge variant={result.incident_report.overall_risk === 'HIGH' || result.incident_report.overall_risk === 'CRITICAL' ? 'danger' : 'success'}>
                    {result.incident_report.overall_risk}
                  </Badge>
                </div>
              </div>
            </Card>

            <Card title="AI Recommendations" icon="lightbulb" className="md:col-span-2">
              <ul className="list-disc pl-5 space-y-2 text-sm text-on-surface">
                {result.incident_report.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="pl-1">
                    <span className="text-on-surface-variant">Action:</span> <span className="font-medium">{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Crowd Density Heatmap" icon="map" className="flex flex-col h-full">
               <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative">
                  <img 
                    src={`http://localhost:8000${result.heatmaps.heatmaps_directory}/heatmap_000001.jpg`} 
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                    alt="Heatmap" 
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700">
                    <p className="text-xs text-slate-300 font-mono break-all line-clamp-1">
                      Path: {result.heatmaps.heatmaps_directory}
                    </p>
                  </div>
               </div>
            </Card>

            <Card title="YOLOv8 Detections" icon="view_in_ar" className="flex flex-col h-full">
               <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative">
                  <img 
                    src={`http://localhost:8000${result.person_detection.detections_directory}/frame_000001.jpg`} 
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                    alt="Detection" 
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700">
                    <p className="text-xs text-slate-300 font-mono break-all line-clamp-1">
                      Path: {result.person_detection.detections_directory}
                    </p>
                  </div>
               </div>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
}
