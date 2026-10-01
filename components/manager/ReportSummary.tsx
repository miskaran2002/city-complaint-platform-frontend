'use client';

import React from 'react';

interface ReportSummaryProps {
  complaints: any[];
}

export const ReportSummary = ({ complaints }: ReportSummaryProps) => {
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'PENDING').length;
  const inProgress = complaints.filter(c => c.status === 'IN_PROGRESS').length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xl mb-3">📊</div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Cases</p>
        <p className="text-2xl font-extrabold text-gray-900 mt-1">{total}</p>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-xl mb-3">⏳</div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending</p>
        <p className="text-2xl font-extrabold text-gray-900 mt-1">{pending}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl mb-3">⚙️</div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">In Progress</p>
        <p className="text-2xl font-extrabold text-gray-900 mt-1">{inProgress}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xl mb-3">✅</div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Resolved</p>
        <p className="text-2xl font-extrabold text-gray-900 mt-1">{resolved}</p>
      </div>
    </div>
  );
};