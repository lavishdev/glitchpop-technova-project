'use client';

import React, { useState, useMemo } from 'react';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
import { Retry } from './Retry';
import { Input } from '@/components/ui/Input';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[] | undefined;
  columns: Column<T>[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  searchPlaceholder?: string;
  searchKey?: keyof T;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T>({
  data,
  columns,
  isLoading,
  isError,
  onRetry,
  searchPlaceholder = 'Search...',
  searchKey,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no records matching your criteria.',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchTerm || !searchKey) return data;
    
    return data.filter((item) => {
      const val = item[searchKey];
      if (typeof val === 'string') {
        return val.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
  }, [data, searchTerm, searchKey]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (isError) {
    return <Retry onRetry={onRetry || (() => {})} />;
  }

  return (
    <div className="space-y-4 w-full">
      {searchKey && (
        <div className="w-full max-w-sm">
          <Input
            placeholder={searchPlaceholder}
            icon="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-outline-variant/40 bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container-low text-on-surface-variant uppercase font-bold tracking-wider border-b border-outline-variant/60">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-3 ${col.sortable ? 'cursor-pointer hover:bg-surface-container/50' : ''}`}
                  onClick={() => col.sortable && col.accessorKey ? handleSort(col.accessorKey) : undefined}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortConfig?.key === col.accessorKey && (
                      <span className="material-symbols-outlined text-[14px]">
                        {sortConfig?.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30 text-on-surface font-medium">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-8">
                  <LoadingState message="Loading records..." />
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8">
                  <EmptyState title={emptyTitle} description={emptyDescription} icon="folder_open" />
                </td>
              </tr>
            ) : (
              sortedData.map((item, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-surface-container/30 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-4 py-3">
                      {col.cell ? col.cell(item) : col.accessorKey ? (item[col.accessorKey] as any) : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
