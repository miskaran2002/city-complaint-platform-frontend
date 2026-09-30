import React from 'react';

interface DashboardMetricsProps {
  complaints: any[];
}

export const DashboardMetrics = ({ complaints }: DashboardMetricsProps) => {
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'PENDING').length;
  const inProgress = complaints.filter(c => c.status === 'IN_PROGRESS').length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Total Complaints</span>
        <div className="text-3xl font-extrabold text-gray-900 mt-2">{total}</div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending</span>
        <div className="text-3xl font-extrabold text-gray-900 mt-2">{pending}</div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">In Progress</span>
        <div className="text-3xl font-extrabold text-gray-900 mt-2">{inProgress}</div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Resolved</span>
        <div className="text-3xl font-extrabold text-gray-900 mt-2">{resolved}</div>
      </div>
    </div>
  );
};