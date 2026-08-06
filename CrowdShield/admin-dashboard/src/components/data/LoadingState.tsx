import React from 'react';

interface LoadingStateProps {
  message?: string;
  fullHeight?: boolean;
}

export function LoadingState({ message = 'Loading data...', fullHeight = false }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${fullHeight ? 'min-h-[400px]' : 'py-12'}`}>
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-sm font-medium text-on-surface-variant animate-pulse">{message}</p>
    </div>
  );
}
