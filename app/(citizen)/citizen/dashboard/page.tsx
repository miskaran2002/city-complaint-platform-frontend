// app/(citizen)/citizen/dashboard/page.tsx
import React from 'react';

export default function CitizenDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Citizen Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back! Track your civic issues and request municipal services.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase">
            Total Submitted
          </span>
          <p className="text-4xl font-extrabold text-[#1E1B4B] mt-4">0</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase">
            In Progress
          </span>
          <p className="text-4xl font-extrabold text-amber-600 mt-4">0</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">
            Resolved
          </span>
          <p className="text-4xl font-extrabold text-emerald-600 mt-4">0</p>
        </div>
      </div>

      {/* Quick Action Card */}
      <div className="bg-gradient-to-r from-[#1E1B4B] via-[#4C1D95] to-[#7E22CE] rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Have a civic issue to report?</h2>
          <p className="text-purple-200 text-sm max-w-xl">
            Submit a complaint regarding waste management, road repair, street lights, or water supply. Our city teams are ready to assist.
          </p>
        </div>
        <button className="bg-[#C026D3] hover:bg-[#a21caf] text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all whitespace-nowrap">
          + New Complaint
        </button>
      </div>
    </div>
  );
}