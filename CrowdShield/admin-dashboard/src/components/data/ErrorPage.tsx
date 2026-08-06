import React from 'react';
import { Button } from '@/components/ui/Button';

interface ErrorPageProps {
  error: Error | null;
  reset: () => void;
}

export function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-3xl text-error">warning</span>
      </div>
      <h2 className="text-2xl font-bold text-on-surface mb-2">Something went wrong</h2>
      <p className="text-on-surface-variant mb-6 max-w-md">
        We encountered an unexpected error while trying to process your request.
        <br />
        <span className="text-xs font-mono bg-surface-container-low p-2 rounded block mt-2 opacity-80">
          {error?.message || 'Unknown error'}
        </span>
      </p>
      <Button variant="primary" onClick={reset} icon="refresh">
        Try Again
      </Button>
    </div>
  );
}
