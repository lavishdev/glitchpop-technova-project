import React from 'react';
import { Badge } from '@/components/ui/Badge';

export interface StatusCardProps {
  title: string;
  subtitle?: string;
  statusText: string;
  statusVariant: 'success' | 'warning' | 'danger' | 'info' | 'default';
  icon?: string;
  children?: React.ReactNode;
}

export function StatusCard({ title, subtitle, statusText, statusVariant, icon, children }: StatusCardProps) {
  return (
    <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {icon && (
            <span className="material-symbols-outlined text-on-surface-variant bg-surface-container-high p-2 rounded-lg">
              {icon}
            </span>
          )}
          <div>
            <h3 className="font-bold text-on-surface">{title}</h3>
            {subtitle && <p className="text-xs text-on-surface-variant">{subtitle}</p>}
          </div>
        </div>
        <Badge variant={statusVariant} dot>
          {statusText}
        </Badge>
      </div>
      {children && <div className="mt-2 pt-3 border-t border-outline-variant/20">{children}</div>}
    </div>
  );
}
