"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_CATEGORIES } from "@/constants/navigation";
import { MOCK_SYSTEM_CONFIG } from "@/constants/mockData";

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen = false, onMobileClose }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-surface-container-lowest border-r border-outline-variant/60 transition-all duration-300 flex flex-col ${
          isCollapsed ? "w-20" : "w-[270px]"
        } ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-outline-variant/40 shrink-0">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-md">
              <span className="material-symbols-outlined text-2xl font-bold">shield</span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-base text-on-surface tracking-tight leading-tight truncate">
                  CrowdShield
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-primary uppercase truncate">
                  Enterprise Admin
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <span className="material-symbols-outlined text-xl">
              {isCollapsed ? "chevron_right" : "chevron_left"}
            </span>
          </button>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAVIGATION_CATEGORIES.map((category) => (
            <div key={category.title} className="space-y-1">
              {!isCollapsed && (
                <h4 className="px-3 text-[11px] font-bold text-outline uppercase tracking-wider mb-2">
                  {category.title}
                </h4>
              )}
              {category.items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={onMobileClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary text-white shadow-sm"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                    } ${isCollapsed ? "justify-center px-0" : ""}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span
                      className={`material-symbols-outlined text-xl shrink-0 ${
                        isActive ? "text-white" : "text-on-surface-variant"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="whitespace-nowrap flex-1 overflow-visible">{item.label}</span>
                    )}
                    {!isCollapsed && item.badge && (
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full whitespace-nowrap shrink-0 ${
                          item.badgeColor || "bg-primary-container text-on-primary-container"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Security Badge */}
        <div className="p-3 border-t border-outline-variant/40 bg-surface-container-low/50 shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-surface-container-high/40 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">verified_user</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-on-surface whitespace-nowrap overflow-visible">
                  System Nominal
                </span>
                <span className="text-[10px] text-emerald-600 font-medium whitespace-nowrap overflow-visible">
                  {MOCK_SYSTEM_CONFIG.cameras.active}/{MOCK_SYSTEM_CONFIG.cameras.total} Feeds Active
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="material-symbols-outlined text-emerald-600 text-xl" title="System Nominal">
                verified_user
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
