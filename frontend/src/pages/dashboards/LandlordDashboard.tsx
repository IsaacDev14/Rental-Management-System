import React, { useState, useMemo } from 'react';
import {
  BarChart2, Building, Users, DollarSign, FileText, Shield,
  FilePlus, History, User, Mail, Phone, TrendingUp as TrendingUpIcon, FileWarning
} from 'lucide-react'; // Fixed: Added FileWarning
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import Sidebar from '../../components/common/Sidebar';
import StatCard from '../../components/common/StatCard';
import PropertyManagement from '../management/PropertyManagement';
import TenantManagement from '../management/TenantManagement';
import PaymentManagement from '../management/PaymentManagement';
import ExpenseTracking from '../management/ExpenseTracking';
import RentalDepositInvestment from '../management/RentalDepositInvestment';
import Reports from '../reports/Reports';
import AuditLogView from '../audit/AuditLogView';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'; // Fixed: Import BarChart explicitly

const landlordNav = [
  { name: 'Dashboard', icon: BarChart2 },
  { name: 'Properties', icon: Building },
  { name: 'Tenants', icon: Users },
  { name: 'Payments', icon: DollarSign },
  { name: 'Expenses', icon: FileText },
  { name: 'Deposits', icon: Shield },
  { name: 'Reports', icon: FilePlus },
  { name: 'Audit Log', icon: History },
];

const LandlordDashboard: React.FC = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const { currentUserId } = useAuth();

  return (
    <div className="flex w-full h-full">
      <Sidebar navigation={landlordNav} activeItem={activeItem} setActiveItem={setActiveItem} />
      <main className="flex-1 bg-gray-900 flex flex-col h-full">
        <div className="p-8 flex-1 overflow-y-auto">
          {(() => {
            switch (activeItem) {
              case 'Dashboard': return <LandlordDashboardContent landlordId={currentUserId} />;
              case 'Properties': return <PropertyManagement />;
              case 'Tenants': return <TenantManagement />;
              case 'Payments': return <PaymentManagement />;
              case 'Expenses': return <ExpenseTracking />;
              case 'Deposits': return <RentalDepositInvestment />;
              case 'Reports': return <Reports />;
              case 'Audit Log': return <AuditLogView />;
              default: return <LandlordDashboardContent landlordId={currentUserId} />;
            }
          })()}
        </div>
      </main>
    </div>
  );
};

const LandlordDashboardContent: React.FC<{ landlordId: string | null }> = ({ landlordId }) => {
  const { data } = useData();
  const currentLandlord = data.landlords.find(l => l.id === landlordId);

  const landlordProperties = useMemo(() => {
    if (!currentLandlord) return [];
    return data.properties.filter(p => p.landlordId === currentLandlord.id);
  }, [data.properties, currentLandlord]);

  const landlordTenants = useMemo(() => {
    if (!currentLandlord) return [];
    const propIds = landlordProperties.map(p => p.id);
    return data.tenants.filter(t => propIds.includes(t.propertyId));
  }, [data.tenants, landlordProperties, currentLandlord]);

  const landlordPayments = useMemo(() => {
    if (!currentLandlord) return [];
    const tenantIds = landlordTenants.map(t => t.id);
    return data.payments.filter(p => tenantIds.includes(p.tenantId));
  }, [data.payments, landlordTenants, currentLandlord]);

  const landlordExpenses = useMemo(() => {
    if (!currentLandlord) return [];
    const propIds = landlordProperties.map(p => p.id);
    return data.expenses.filter(e => propIds.includes(e.propertyId));
  }, [data.expenses, landlordProperties, currentLandlord]);

  const totalIncome = landlordPayments.filter(p => p.status === 'Paid').reduce((acc, p) => acc + p.amount, 0);
  const overdueRent = landlordPayments.filter(p => p.status === 'Overdue').reduce((acc, p) => acc + p.amount, 0);
  const totalExpenses = landlordExpenses.reduce((acc, e) => acc + e.amount, 0);
  const totalUnits = landlordProperties.flatMap(p => p.units).length;
  const occupiedUnits = landlordTenants.length;
  const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

  const incomeExpenseData = [
    { name: 'Jan', income: 125000, expenses: 40000 },
    { name: 'Feb', income: 125000, expenses: 35000 },
    { name: 'Mar', income: 125000, expenses: 52000 },
    { name: 'Apr', income: 125000, expenses: 30000 },
    { name: 'May', income: 160000, expenses: 60000 },
    { name: 'Jun', income: 160000, expenses: 82000 },
  ];

  const expenseCategories: Record<string, number> = landlordExpenses.reduce((acc: Record<string, number>, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const expenseData = Object.keys(expenseCategories).map(key => ({
    name: key,
    value: expenseCategories[key]
  }));

  const PIE_COLORS = ['#06b6d4', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#a855f7'];

  return (
    <div className="space-y-8">
      {/* Profile Card */}
      {currentLandlord && (
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">My Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <p className="flex items-center"><User size={16} className="mr-2 text-cyan-400" /> <span className="font-semibold text-white">Name:</span> {currentLandlord.name}</p>
            <p className="flex items-center"><Mail size={16} className="mr-2 text-cyan-400" /> <span className="font-semibold text-white">Email:</span> {currentLandlord.email}</p>
            <p className="flex items-center"><Phone size={16} className="mr-2 text-cyan-400" /> <span className="font-semibold text-white">Phone:</span> {currentLandlord.phone}</p>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Monthly Income" value={`KES ${totalIncome.toLocaleString()}`} icon={DollarSign} color="emerald" change="+5.2%" />
        <StatCard title="Total Monthly Expenses" value={`KES ${totalExpenses.toLocaleString()}`} icon={FileText} color="amber" change="+12%" />
        <StatCard title="Overdue Rent" value={`KES ${overdueRent.toLocaleString()}`} icon={FileWarning} color="red" />
        <StatCard title="Occupancy Rate" value={`${occupancyRate.toFixed(1)}%`} icon={TrendingUpIcon} color="cyan" change="-1.0%" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeExpenseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={(v) => `KES ${v / 1000}k`} />
              <Tooltip formatter={(v: number) => `KES ${v.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="income" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Expense Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent ?? 0 * 100).toFixed(0)}%`}
              >
                {expenseData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `KES ${v.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Properties Overview */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">My Properties Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landlordProperties.length > 0 ? landlordProperties.map(p => {
            const occupied = p.units.filter(u => u.tenantId).length;
            const total = p.units.length;
            const income = p.units.reduce((sum, unit) => unit.tenantId ? sum + unit.rent : sum, 0);
            return (
              <div key={p.id} className="bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600">
                <h4 className="font-bold text-lg text-cyan-400">{p.name}</h4>
                <p className="text-sm text-gray-400 mb-2">{p.location}</p>
                <p className="text-sm text-gray-300">Units: {occupied}/{total} occupied</p>
                <p className="text-sm text-gray-300">Potential Income: <span className="font-semibold text-emerald-400">KES {income.toLocaleString()}</span></p>
              </div>
            );
          }) : <p className="text-gray-400">No properties managed yet.</p>}
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
          {data.auditLog.length > 0 ? data.auditLog.slice(0, 5).map(log => (
            <div key={log.id} className="font-mono text-sm bg-gray-700 p-3 rounded-lg border border-gray-600">
              <span className="text-cyan-400">{log.timestamp.toLocaleTimeString()}:</span>
              <span className="ml-2 text-gray-300">{log.message}</span>
            </div>
          )) : <p className="text-gray-400">No recent activity.</p>}
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;
