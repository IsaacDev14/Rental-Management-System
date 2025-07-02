// frontend/src/pages/audit/AuditLogView.tsx

import React, { useMemo } from 'react';
import { useData } from '../../hooks/useData'; // Import useData hook
import DataTable from '../../components/tables/DataTable'; // Import DataTable component
import { AuditLogEntry } from '../../types/models'; // Import AuditLogEntry type

/**
 * AuditLogView component.
 * Displays a chronological log of significant actions performed within the system.
 */
const AuditLogView: React.FC = () => {
  const { data } = useData();

  // Define columns for the Audit Log DataTable
  const auditLogColumns = useMemo(() => [
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (row: AuditLogEntry) => row.timestamp.toLocaleString(), // Format date and time
      className: 'whitespace-nowrap', // Prevent wrapping for timestamps
    },
    { key: 'message', header: 'Action Description' },
  ], []);

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 text-white">
      <h3 className="text-xl font-semibold mb-6">System Audit Log</h3>
      <DataTable<AuditLogEntry>
        data={data.auditLog}
        columns={auditLogColumns}
        emptyMessage="No audit log entries found."
      />
    </div>
  );
};

export default AuditLogView;
