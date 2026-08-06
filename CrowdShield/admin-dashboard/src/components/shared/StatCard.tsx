import React from "react";
import { Card } from "../ui/Card";
import { StatMetric } from "@/types/domain";

interface StatCardProps {
  metric: StatMetric;
}

export const StatCard: React.FC<StatCardProps> = ({ metric }) => {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            {metric.title}
          </span>
          <span className="text-2xl font-bold text-on-surface tracking-tight mt-1">
            {metric.value}
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-xl">{metric.icon}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-outline-variant/30 text-xs">
        <span
          className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded text-[11px] ${
            metric.isPositive
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {metric.change}
        </span>
        {metric.description && (
          <span className="text-on-surface-variant/80 truncate">
            {metric.description}
          </span>
        )}
      </div>
    </Card>
  );
};
