// src/components/tables/DataTable.tsx
import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
}

function DataTable<T extends object>({ data, columns, emptyMessage }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-gray-400 italic p-4 text-center">
        {emptyMessage || 'No data available.'}
      </div>
    );
  }

  return (
    <table className="w-full text-left border-collapse border border-gray-700">
      <thead>
        <tr>
          {columns.map(col => (
            <th
              key={col.key}
              className={`border border-gray-700 px-4 py-2 bg-gray-900 text-white ${col.className || ''}`}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className={rowIndex % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}
          >
            {columns.map(col => (
              <td
                key={col.key}
                className={`border border-gray-700 px-4 py-2 text-gray-200`}
              >
                {col.render ? col.render(row) : (row as any)[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;
