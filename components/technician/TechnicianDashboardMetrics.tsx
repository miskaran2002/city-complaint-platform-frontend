'use client';

import React from 'react';

interface TechnicianDashboardMetricsProps {
  departmentName: string;
  complaints: any[];
}

export const TechnicianDashboardMetrics = ({ departmentName, complaints }: TechnicianDashboardMetricsProps) => {
  // Calculate metrics for the department
  const total = complaints.length;
  const assigned = complaints.filter(c => c.status === 'ASSIGNED').length;
  const inProgress = complaints.filter(c => c.status === 'IN_PROGRESS').length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED').length;

  return (
    <div className="space-y-6">
      {/* Department Highlight Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-blue-100 text-sm font-bold tracking-wider uppercase mb-1">Your Assigned Department</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
            <span>🏢</span> {departmentName}
          </h2>
          <p className="mt-3 text-blue-50 text-sm max-w-xl opacity-90">
            Monitor incoming field tasks, update statuses, and resolve issues for the citizens of your department.
          </p>
        </div>
        
        {/* Background decorative shapes */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-10 w-48 h-48 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
      </div>

      {/* Metrics Grid */}
      <h3 className="text-lg font-extrabold text-gray-900 mt-8 mb-4">Department Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center text-lg mb-3">📊</div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Tasks</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{total}</p>
        </div>
        
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-lg mb-3">📌</div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{assigned}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-lg mb-3">⚙️</div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">In Progress</p>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">{inProgress}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-lg mb-3">✅</div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Resolved</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{resolved}</p>
        </div>
      </div>
    </div>
  );
};