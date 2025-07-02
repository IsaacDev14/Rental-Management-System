// frontend/src/components/tables/DataTable.tsx

import React from 'react';

/**
 * Defines the structure for a column in the DataTable.
 */
interface TableColumn<T> {
  key: keyof T | string; // Key to access data, or a unique string for custom cells
  header: string; // Display header for the column
  render?: (row: T) => React.ReactNode; // Optional custom render function for cell content
  className?: string; // Optional CSS class for the column header and cells
}

/**
 * Props interface for the DataTable component.
 */
interface DataTableProps<T> {
  data: T[]; // Array of data objects to display
  columns: TableColumn<T>[]; // Array of column definitions
  emptyMessage?: string; // Message to display when data is empty
}

/**
 * A generic and reusable DataTable component for displaying tabular data.
 * Supports custom rendering for columns and displays a message when no data is available.
 */
const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  emptyMessage = 'No data available.',
}: DataTableProps<T>) => {
  return (
    <div className="overflow-x-auto custom-scrollbar rounded-lg border border-gray-700 shadow-md">
      <table className="w-full text-left table-auto">
        {/* Table Header */}
        <thead className="bg-gray-700">
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key as string || index} // Use key or index for unique key
                className={`p-4 text-gray-300 font-semibold text-sm uppercase tracking-wider ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex} // Use row.id if available, otherwise rowIndex
                className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={`${column.key as string}-${rowIndex}-${colIndex}`} // Unique key for cell
                    className={`p-4 text-gray-300 ${column.className || ''}`}
                  >
                    {/* Render custom content if a render function is provided, otherwise display data directly */}
                    {column.render ? column.render(row) : (row[column.key as keyof T] || 'N/A')}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-8 text-center text-gray-400 text-lg">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
