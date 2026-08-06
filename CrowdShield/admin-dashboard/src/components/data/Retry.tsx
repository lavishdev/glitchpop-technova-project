import React from 'react';
import { Button } from '@/components/ui/Button';

interface RetryProps {
  message?: string;
  onRetry: () => void;
}

export function Retry({ message = 'Failed to load data.', onRetry }: RetryProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-error/10 border border-error/20 rounded-xl">
      <span className="material-symbols-outlined text-error text-3xl mb-2">error</span>
      <p className="text-sm font-bold text-error mb-4">{message}</p>
      <Button variant="danger" size="sm" onClick={onRetry} icon="refresh">
        Retry
      </Button>
    </div>
  );
}
