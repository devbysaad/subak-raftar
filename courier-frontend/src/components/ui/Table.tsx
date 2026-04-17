import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
}

function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  loading = false,
  emptyMessage = 'No records found.',
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E8EDEB] bg-[#F9FBFA]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left px-5 py-3.5 text-[11px] font-bold atlas-text-secondary uppercase tracking-wider ${col.width || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-10 text-[#5C6C75]">
                <div className="flex justify-center">
                  <span className="spinner spinner-green" style={{ width: 20, height: 20 }} />
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-[#5C6C75]">
                <div className="flex flex-col items-center gap-3">
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#E8EDEB]">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
                  </svg>
                  <span className="font-medium text-sm">{emptyMessage}</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-[#E8EDEB] last:border-0 ${
                  onRowClick ? 'cursor-pointer hover:bg-[#F9FBFA]' : ''
                } transition-colors`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-4 atlas-text-primary">
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
