"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { authService } from "@/services/api/authService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("••••••••••••");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({ username, password });
      login(response.token);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials or server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Optics */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <span className="material-symbols-outlined text-3xl font-bold">shield</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-3">
            CrowdShield Command
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Enterprise Spatial Security & Vision Telemetry Portal
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Operator Username"
            type="text"
            placeholder="operator_id"
            icon="person"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            label="Passcode Credentials"
            type="password"
            placeholder="••••••••••••"
            icon="lock"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-600"
              />
              Remember Hardware Token
            </label>
            <a href="#" className="text-blue-400 hover:underline">
              Reset Security Token
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-500 font-bold py-3 mt-2"
            isLoading={isLoading}
            icon="login"
          >
            Authenticate Credentials
          </Button>
        </form>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-800/60 text-center text-[11px] text-slate-500 font-mono">
          Strictly for authorized CrowdShield Security Personnel.
        </div>
      </div>
    </div>
  );
}
