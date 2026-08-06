import React from 'react';

export interface InfoCardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function InfoCard({ title, icon, children, action }: InfoCardProps) {
  return (
    <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 flex flex-col h-full">
      <div className="flex justify-between items-center mb-5 border-b border-outline-variant/20 pb-4">
        <div className="flex items-center gap-2 text-on-surface">
          {icon && <span className="material-symbols-outlined text-primary">{icon}</span>}
          <h2 className="font-bold tracking-tight text-lg">{title}</h2>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
