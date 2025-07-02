import React, { useState, useMemo } from 'react';
import { ChevronDown, DollarSign, FileText, BarChart2, Landmark, Mail, Phone, AlertTriangle } from 'lucide-react';
import { useData } from '../../hooks/useData';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/tables/DataTable';
import type { Property, Tenant, Expense, Payment, Deposit } from '../../types/models';
import { KRA_TAX_RATE } from '../../utils/constants';

const KRADashboard: React.FC = () => {
  const { data } = useData();
  const [selectedLandlordId, setSelectedLandlordId] = useState<string>(data.landlords[0]?.id || '');

  const landlordData = useMemo(() => {
    if (!selectedLandlordId) return null;

    const properties: Property[] = data.properties.filter(p => p.landlordId === selectedLandlordId);
    const propertyIds: string[] = properties.map(p => p.id);
    const tenants: Tenant[] = data.tenants.filter(t => propertyIds.includes(t.propertyId));
    const tenantIds: string[] = tenants.map(t => t.id);
    const payments: Payment[] = data.payments.filter(p => tenantIds.includes(p.tenantId) && p.status === 'Paid');
    const expenses: Expense[] = data.expenses.filter(e => propertyIds.includes(e.propertyId));
    const deposits: Deposit[] = data.deposits.filter(d => d.landlordId === selectedLandlordId);

    const totalIncome = payments.reduce((sum, p) => sum + (typeof p.amount === 'number' ? p.amount : 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (typeof e.amount === 'number' ? e.amount : 0), 0);
    const netIncome = totalIncome - totalExpenses;
    const totalDepositsHeld = deposits.reduce((sum, d) => sum + (typeof d.amount === 'number' ? d.amount : 0), 0);
    const estimatedTax = netIncome > 0 ? netIncome * KRA_TAX_RATE : 0;

    return { totalIncome, totalExpenses, netIncome, properties, expenses, tenants, deposits, totalDepositsHeld, estimatedTax };
  }, [selectedLandlordId, data]);

  const currentKRA_Landlord = useMemo(() => {
    return data.landlords.find(l => l.id === selectedLandlordId);
  }, [selectedLandlordId, data.landlords]);

  const tenantTableColumns = useMemo(() => [
    { key: 'name', header: 'Name', className: 'font-semibold text-white' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'propertyUnit',
      header: 'Property & Unit',
      render: (row: Tenant) => {
        const prop = data.properties.find(p => p.id === row.propertyId);
        const unit = prop?.units.find(u => u.id === row.unitId);
        return `${prop?.name || 'N/A'} - ${unit?.name || 'N/A'}`;
      },
    },
    { key: 'leaseEnd', header: 'Lease End' },
  ], [data.properties]);

  const expenseTableColumns = useMemo(() => [
    {
      key: 'property',
      header: 'Property',
      render: (row: Expense) => {
        const prop = data.properties.find(p => p.id === row.propertyId);
        return prop?.name || 'N/A';
      },
    },
    { key: 'category', header: 'Category' },
    { key: 'description', header: 'Description' },
    {
      key: 'amount',
      header: 'Amount',
      render: (row: Expense) => `KES ${row.amount.toLocaleString()}`,
    },
    { key: 'date', header: 'Date' },
  ], [data.properties]);

  return (
    <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold mb-1">KRA Officer View</h2>
          <p className="text-gray-400 text-lg">Rental Income Tax Compliance Portal (View-Only)</p>
        </div>
        <div className="w-72 relative">
          <label htmlFor="landlord-select" className="text-sm font-medium text-gray-300 mb-2 block">Select Landlord to Audit:</label>
          <select
            id="landlord-select"
            value={selectedLandlordId}
            onChange={e => setSelectedLandlordId(e.target.value)}
            className="block w-full pl-4 pr-10 py-3 text-base bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 rounded-lg text-white appearance-none transition-all duration-200"
          >
            {data.landlords.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-[calc(1.5rem+10px)] -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
        </div>
      </div>

      {landlordData && currentKRA_Landlord ? (
        <div className="space-y-8">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Landlord Profile: {currentKRA_Landlord.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              <p className="flex items-center"><Mail size={16} className="mr-2 text-cyan-400" /> <span className="font-semibold text-white">Email:</span> {currentKRA_Landlord.email}</p>
              <p className="flex items-center"><Phone size={16} className="mr-2 text-cyan-400" /> <span className="font-semibold text-white">Phone:</span> {currentKRA_Landlord.phone}</p>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-6">Financial Summary for {currentKRA_Landlord.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Declared Rental Income" value={`KES ${landlordData.totalIncome.toLocaleString()}`} icon={DollarSign} color="emerald" />
              <StatCard title="Total Claimed Expenses" value={`KES ${landlordData.totalExpenses.toLocaleString()}`} icon={FileText} color="amber" />
              <StatCard title="Net Taxable Income" value={`KES ${landlordData.netIncome.toLocaleString()}`} icon={BarChart2} color="cyan" />
              <StatCard title="Total Deposits Held" value={`KES ${landlordData.totalDepositsHeld.toLocaleString()}`} icon={Landmark} color="blue" />
            </div>
            <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <p className="text-sm text-gray-300">
                Estimated Tax Liability (at {KRA_TAX_RATE * 100}% of Net Taxable Income):{' '}
                <span className="font-bold text-red-400">KES {landlordData.estimatedTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
              <h4 className="text-lg font-semibold mb-4">Income by Property</h4>
              <div className="space-y-2">
                {landlordData.properties.length > 0 ? landlordData.properties.map(p => {
                  const income = data.payments
                    .filter(pay => pay.status === 'Paid' && data.tenants.find(t => t.id === pay.tenantId)?.propertyId === p.id)
                    .reduce((s, pay) => s + (typeof pay.amount === 'number' ? pay.amount : 0), 0);
                  return (
                    <div key={p.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0 text-gray-300">
                      <span>{p.name}</span>
                      <span className="font-semibold text-white">KES {income.toLocaleString()}</span>
                    </div>
                  );
                }) : <p className="text-gray-400">No properties found for this landlord.</p>}
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
              <h4 className="text-lg font-semibold mb-4">Expenses by Category</h4>
              <div className="space-y-2">
                {Object.entries(landlordData.expenses.reduce((acc: Record<string, number>, e) => {
                  acc[e.category] = (acc[e.category] || 0) + (typeof e.amount === 'number' ? e.amount : 0);
                  return acc;
                }, {})).length > 0 ? Object.entries(landlordData.expenses.reduce((acc: Record<string, number>, e) => {
                  acc[e.category] = (acc[e.category] || 0) + (typeof e.amount === 'number' ? e.amount : 0);
                  return acc;
                }, {})).map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0 text-gray-300">
                    <span>{category}</span>
                    <span className="font-semibold text-white">KES {amount.toLocaleString()}</span>
                  </div>
                )) : <p className="text-gray-400">No expenses found for this landlord.</p>}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Tenant Details</h3>
            <DataTable<Tenant>
              data={landlordData.tenants}
              columns={tenantTableColumns}
              emptyMessage="No tenants found for this landlord."
            />
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Expense Details</h3>
            <DataTable<Expense>
              data={landlordData.expenses}
              columns={expenseTableColumns}
              emptyMessage="No expenses found for this landlord."
            />
          </div>

          <button className="mt-6 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-bold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200">
            Generate Detailed Tax Report
          </button>
        </div>
      ) : (
        <div className="p-8 text-center bg-gray-800 rounded-xl shadow-xl border border-gray-700">
          <AlertTriangle size={64} className="text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white">No Landlord Selected or Data Available</h3>
          <p className="text-gray-400 mt-2">Please select a landlord from the dropdown above to view their audit data.</p>
        </div>
      )}
    </div>
  );
};

export default KRADashboard;
