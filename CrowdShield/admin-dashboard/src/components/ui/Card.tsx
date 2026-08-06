import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  title,
  subtitle,
  action,
  icon,
}) => {
  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 shadow-sm transition-all hover:border-outline-variant ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-outline-variant/40">
          <div className="flex items-center gap-2.5">
            {icon && (
              <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
            )}
            <div>
              {title && (
                <h3 className="text-base font-semibold text-on-surface tracking-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-on-surface-variant font-normal mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
