import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  error,
  helperText,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant/70 text-lg pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`w-full bg-surface-container-lowest border border-outline-variant text-on-surface text-sm rounded-lg px-3.5 py-2 transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/50 ${
            icon ? "pl-10" : ""
          } ${error ? "border-error focus:border-error focus:ring-error/20" : ""} ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-error font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-on-surface-variant/70">{helperText}</p>
      ) : null}
    </div>
  );
};
