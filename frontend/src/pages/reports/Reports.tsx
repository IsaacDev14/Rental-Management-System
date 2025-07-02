import React, { useMemo } from 'react';
import { ChevronDown, DollarSign, FileText } from 'lucide-react'; // only used icons
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import type { ReportEntry } from '../../types/common'; // type-only import

/**
 * Reports component.
 * Provides an interface for generating and viewing various financial and operational reports.
 * Displays different report overviews based on the user's role.
 */
const Reports: React.FC = () => {
  const { data } = useData();
  const { userRole, currentUserId } = useAuth();
  const isLandlord = userRole === 'landlord';

  // Memoized reports specific to the logged-in landlord
  const landlordReports = useMemo<ReportEntry[]>(() => {
    if (!isLandlord || !currentUserId) return [];
    const landlordProps = data.properties.filter(p => p.landlordId === currentUserId);
    const reports: ReportEntry[] = [];

    // Example: Monthly Income Report per Property
    landlordProps.forEach(prop => {
      const propPayments = data.payments.filter(p => {
        const tenant = data.tenants.find(t => t.id === p.tenantId);
        return tenant?.propertyId === prop.id && p.status === 'Paid';
      });
      const monthlyIncome = propPayments.reduce((acc, p) => acc + p.amount, 0);
      reports.push({
        type: 'Monthly Income',
        property: prop.name,
        amount: monthlyIncome,
        period: 'Current Month',
        description: `Total rental income for ${prop.name} this month.`
      });
    });

    // Example: Expense Summary
    const landlordExpenses = data.expenses.filter(e => {
      const prop = data.properties.find(p => p.id === e.propertyId);
      return prop?.landlordId === currentUserId;
    });
    const totalExpenses = landlordExpenses.reduce((acc, e) => acc + e.amount, 0);
    reports.push({
      type: 'Expense Summary',
      property: 'All',
      amount: totalExpenses,
      period: 'Current Month',
      description: 'Total expenses logged across all properties this month.'
    });

    // Example: Deposit Summary
    const landlordDeposits = data.deposits.filter(d => d.landlordId === currentUserId);
    const totalDeposits = landlordDeposits.reduce((acc, d) => acc + d.amount, 0);
    reports.push({
      type: 'Deposit Summary',
      property: 'All',
      amount: totalDeposits,
      period: 'Current Holdings',
      description: 'Total security deposits currently held.'
    });

    return reports;
  }, [data, isLandlord, currentUserId]);

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 text-white">
      <h3 className="text-xl font-semibold mb-6">Reports & Analytics</h3>

      {isLandlord && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4 text-cyan-400">My Financial Reports</h4>
          <div className="space-y-4">
            {landlordReports.length > 0 ? landlordReports.map((report, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg border border-gray-600 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-white">{report.type} - {report.property}</p>
                  <p className="text-sm text-gray-300">{report.description}</p>
                  <p className="text-xs text-gray-400">{report.period}</p>
                </div>
                <span className="font-bold text-lg text-emerald-400">KES {report.amount.toLocaleString()}</span>
              </div>
            )) : <p className="text-gray-400">No reports available for your properties.</p>}
          </div>
        </div>
      )}

      {userRole === 'kra_officer' && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4 text-amber-400">KRA Tax Reports Overview</h4>
          <p className="text-gray-400">This section provides a high-level overview of rental income and expenses for tax compliance. Detailed reports can be generated for specific landlords in the KRA Dashboard.</p>
          <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
            <p className="text-sm text-gray-300 flex items-center mb-1">
              <DollarSign size={16} className="mr-2 text-emerald-400" />
              Total Declared Income (All Landlords): <span className="font-semibold text-white ml-2">KES {data.payments.filter(p => p.status === 'Paid').reduce((acc, p) => acc + p.amount, 0).toLocaleString()}</span>
            </p>
            <p className="text-sm text-gray-300 flex items-center">
              <FileText size={16} className="mr-2 text-amber-400" />
              Total Claimed Expenses (All Landlords): <span className="font-semibold text-white ml-2">KES {data.expenses.reduce((acc, e) => acc + e.amount, 0).toLocaleString()}</span>
            </p>
          </div>
        </div>
      )}

      <h4 className="text-lg font-semibold mt-8 mb-4">Generate Custom Report</h4>
      <p className="text-gray-400 mb-4">Select parameters below to generate a detailed report.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <select className="block w-full pl-4 pr-10 py-3 text-base bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 rounded-lg text-white appearance-none transition-all duration-200">
            <option>Report Type</option>
            <option>Income Statement</option>
            <option>Expense Breakdown</option>
            <option>Occupancy Report</option>
            <option>Tenant Ledger</option>
            <option>Deposit Statement</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
        </div>
        <div className="relative">
          <select className="block w-full pl-4 pr-10 py-3 text-base bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 rounded-lg text-white appearance-none transition-all duration-200">
            <option>Time Period</option>
            <option>Last Month</option>
            <option>Last Quarter</option>
            <option>Last Year</option>
            <option>Custom Range</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
        </div>
      </div>
      <Button className="mt-6">
        Generate Report
      </Button>
    </div>
  );
};

export default Reports;
