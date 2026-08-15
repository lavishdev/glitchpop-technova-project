"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { settingsService } from "@/features/settings/services/settingsService";
import { SystemConfigSettings } from "@/features/settings/types";

export default function SettingsPage() {
  const [config, setConfig] = useState<SystemConfigSettings | null>(null);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    settingsService.getSystemConfig().then(setConfig);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  if (!config) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface tracking-tight">
            System Preferences & AI Configuration
          </h2>
          <p className="text-xs text-on-surface-variant">
            Adjust computer vision threshold parameters, telemetry webhooks, and security policies.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {savedMsg && (
            <span className="text-xs font-bold text-emerald-600 animate-fade-in">
              ✓ System Config Saved
            </span>
          )}
          <Button variant="primary" size="sm" icon="save" onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Computer Vision AI Detection Thresholds */}
        <Card title="Computer Vision & AI Thresholds" icon="psychology">
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>AI Vision Detection Sensitivity</span>
                <span className="font-mono text-primary">{config.aiSensitivity}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={config.aiSensitivity}
                onChange={(e) =>
                  setConfig({ ...config, aiSensitivity: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-[11px] text-on-surface-variant mt-1">
                Higher sensitivity flags subtle crowd anomalies but may increase false alarms.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Automated Dispatch Capacity Threshold</span>
                <span className="font-mono text-amber-600">{config.autoDispatchThreshold}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="98"
                value={config.autoDispatchThreshold}
                onChange={(e) =>
                  setConfig({ ...config, autoDispatchThreshold: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>
        </Card>

        {/* Telemetry & Webhook Integration */}
        <Card title="Telemetry Integration & Webhooks" icon="api">
          <div className="space-y-4">
            <Input
              label="Central Webhook Endpoint URL"
              value="https://demo.crowdshield.local/webhooks"
              disabled
              onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
            />
            <p className="text-[11px] text-amber-500 font-medium">Demo environment — webhook integration disabled.</p>
            <div className="flex items-center gap-6 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-on-surface">
                <input
                  type="checkbox"
                  checked={config.emailNotifications}
                  onChange={(e) => setConfig({ ...config, emailNotifications: e.target.checked })}
                  className="rounded border-outline-variant text-primary focus:ring-primary"
                />
                Email Alerts
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-on-surface">
                <input
                  type="checkbox"
                  checked={config.smsAlerts}
                  onChange={(e) => setConfig({ ...config, smsAlerts: e.target.checked })}
                  className="rounded border-outline-variant text-primary focus:ring-primary"
                />
                SMS Emergency Broadcasts
              </label>
            </div>
          </div>
        </Card>

        {/* Data Retention & Storage */}
        <Card title="Data Retention & System Policy" icon="storage">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <Input
              label="Video Stream Retention Period (Days)"
              type="number"
              value={config.retentionDays}
              onChange={(e) => setConfig({ ...config, retentionDays: parseInt(e.target.value) })}
            />
          </div>
        </Card>
      </form>
    </div>
  );
}
