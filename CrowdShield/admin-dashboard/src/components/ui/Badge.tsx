import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className = "",
}) => {
  const baseStyles = "inline-flex items-center font-medium rounded-md tracking-wider uppercase";

  const variants = {
    default: "bg-surface-container-high text-on-surface-variant",
    success: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    warning: "bg-amber-100 text-amber-800 border border-amber-200",
    danger: "bg-error-container text-on-error-container border border-red-200",
    info: "bg-primary-fixed text-on-primary-fixed border border-blue-200",
    outline: "border border-outline text-on-surface-variant bg-transparent",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  const dotColors = {
    default: "bg-on-surface-variant",
    success: "bg-emerald-600",
    warning: "bg-amber-600",
    danger: "bg-error",
    info: "bg-primary",
    outline: "bg-outline",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
