import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  change?: string;
  isPositive?: boolean;
  description?: string;
}

export function StatCard({ title, value, icon, change, isPositive, description }: StatCardProps) {
  return (
    <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">{title}</h3>
        <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">
          {icon}
        </span>
      </div>
      <div>
        <p className="text-3xl font-black text-on-surface tracking-tight">{value}</p>
        <div className="flex items-center mt-2 text-sm gap-2">
          {change && (
            <span className={`font-bold flex items-center ${isPositive ? 'text-success' : 'text-error'}`}>
              <span className="material-symbols-outlined text-[16px] mr-0.5">
                {isPositive ? 'trending_up' : 'trending_down'}
              </span>
              {change}
            </span>
          )}
          {description && <span className="text-on-surface-variant text-xs">{description}</span>}
        </div>
      </div>
    </div>
  );
}
