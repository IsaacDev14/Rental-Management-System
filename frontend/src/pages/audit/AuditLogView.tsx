import React, { useMemo } from 'react';
import { useData } from '../../hooks/useData';
import DataTable from '../../components/tables/DataTable';
import type { AuditLogEntry } from '../../types/models'; // Import type-only

/**
 * AuditLogView component.
 * Displays a chronological log of significant actions performed within the system.
 */
const AuditLogView: React.FC = () => {
  const { data } = useData();

  /**
   * We need to assert that AuditLogEntry extends Record<string, unknown> for DataTable generic.
   * If AuditLogEntry lacks index signature, we create a mapped type here.
   */
  type AuditLogEntrySafe = AuditLogEntry & Record<string, unknown>;

  // Define columns for the Audit Log DataTable
  const auditLogColumns = useMemo(() => [
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (row: AuditLogEntrySafe) =>
        row.timestamp instanceof Date
          ? row.timestamp.toLocaleString()
          : new Date(row.timestamp).toLocaleString(),
      className: 'whitespace-nowrap',
    },
    { key: 'message', header: 'Action Description' },
  ], []);

  // Cast data.auditLog to AuditLogEntrySafe[] to satisfy DataTable constraints
  const auditLogData = (data.auditLog ?? []) as AuditLogEntrySafe[];

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 text-white">
      <h3 className="text-xl font-semibold mb-6">System Audit Log</h3>
      <DataTable<AuditLogEntrySafe>
        data={auditLogData}
        columns={auditLogColumns}
        emptyMessage="No audit log entries found."
      />
    </div>
  );
};

export default AuditLogView;
