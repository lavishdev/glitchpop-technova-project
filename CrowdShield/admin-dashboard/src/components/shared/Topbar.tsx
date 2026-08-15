"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_CATEGORIES } from "@/constants/navigation";
import { MOCK_SYSTEM_CONFIG } from "@/constants/mockData";

interface TopbarProps {
  onMobileMenuToggle: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMobileMenuToggle }) => {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Determine current page title
  let pageTitle = "Dashboard Overview";
  for (const cat of NAVIGATION_CATEGORIES) {
    const found = cat.items.find((item) => item.href === pathname);
    if (found) {
      pageTitle = found.label;
      break;
    }
  }
  if (pathname === "/login") pageTitle = "Security Portal Login";

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/60 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        <div>
          <h1 className="text-lg font-bold text-on-surface tracking-tight whitespace-nowrap">{pageTitle}</h1>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-on-surface-variant/80">
            <span>CrowdShield</span>
            <span className="text-outline-variant">•</span>
            <span className="text-primary font-medium">{pageTitle}</span>
          </div>
        </div>
      </div>

      {/* Center: Search & Demo Badge */}
      <div className="hidden lg:flex items-center flex-1 justify-center gap-6">
        <div className="relative w-72 max-w-full">
          <span className="material-symbols-outlined absolute left-3 top-2 text-on-surface-variant/60 text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search cameras, zones, alerts..."
            className="w-full bg-surface-container-low border border-outline-variant/60 text-on-surface text-xs rounded-xl pl-9 pr-3 py-2 transition-colors focus:outline-none focus:border-primary focus:bg-surface-container-lowest"
          />
        </div>
        {MOCK_SYSTEM_CONFIG.demo.isSimulationMode && (
          <span className="px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-[10px] font-bold text-primary tracking-widest whitespace-nowrap">
            {MOCK_SYSTEM_CONFIG.demo.simulationBadgeLabel}
          </span>
        )}
      </div>

      {/* Right: Emergency Quick Trigger, Alerts, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Emergency Dispatch Button */}
        <Link
          href="/emergency"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/10 border border-red-200 text-red-700 text-xs font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm shrink-0"
        >
          <span className="material-symbols-outlined text-base animate-pulse">e911_emergency</span>
          <span>Emergency Dispatch</span>
        </Link>

        {/* Notifications Dropdown Toggle */}
        <div className="relative shrink-0">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors relative"
            title="Notifications & Active Alerts"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
                <h4 className="text-sm font-bold text-on-surface">Active Threat Alerts</h4>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-error-container text-on-error-container rounded-full">
                  14 New
                </span>
              </div>
              <div className="py-2 space-y-2.5 max-h-64 overflow-y-auto">
                <Link
                  href="/alerts"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-error text-lg shrink-0 mt-0.5">warning</span>
                  <div>
                    <p className="text-xs font-semibold text-on-surface">Turnstile 4 Crowd Surge</p>
                    <p className="text-[11px] text-on-surface-variant">Density reached 92% • 10m ago</p>
                  </div>
                </Link>
                <Link
                  href="/alerts"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-amber-600 text-lg shrink-0 mt-0.5">work_alert</span>
                  <div>
                    <p className="text-xs font-semibold text-on-surface">Unattended Baggage Alert</p>
                    <p className="text-[11px] text-on-surface-variant">East Promenade • 24m ago</p>
                  </div>
                </Link>
              </div>
              <div className="pt-2 border-t border-outline-variant/40 text-center">
                <Link
                  href="/alerts"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  View All Alerts →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-container transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-bold text-xs flex items-center justify-center border border-primary-fixed-dim shrink-0">
              AM
            </div>
            <div className="hidden xl:flex flex-col text-left overflow-hidden max-w-[120px]">
              <span className="text-xs font-semibold text-on-surface leading-tight truncate">Alex Mercer</span>
              <span className="text-[10px] text-on-surface-variant truncate">Super Admin</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-base shrink-0">
              arrow_drop_down
            </span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-outline-variant/40">
                <p className="text-xs font-bold text-on-surface truncate">Alex Mercer</p>
                <p className="text-[11px] text-on-surface-variant truncate">a.mercer@crowdshield.internal</p>
              </div>
              <Link
                href="/users"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-base">manage_accounts</span>
                User Roster & Access
              </Link>
              <Link
                href="/settings"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-base">settings</span>
                System Preferences
              </Link>
              <div className="my-1 border-t border-outline-variant/40" />
              <Link
                href="/login"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-error hover:bg-error-container/20 transition-colors"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
