import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  height?: string | number;
  width?: string | number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rectangular",
  height,
  width,
}) => {
  const baseStyles = "animate-pulse bg-surface-container-high/60 rounded";

  const variantStyles = {
    text: "h-4 w-full rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{
        height: height !== undefined ? height : undefined,
        width: width !== undefined ? width : undefined,
      }}
    />
  );
};
