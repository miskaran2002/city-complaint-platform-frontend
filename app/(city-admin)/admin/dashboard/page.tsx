// app/(admin)/admin/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios'; // Apnar axios instance import korun
import GlobalLoading from '@/app/loading';

// Postman-er data structure onujayi Type toiri kora holo
interface DashboardStats {
  users: { total: number };
  complaints: { total: number; pending: number; inProgress: number; resolved: number };
  payments: { successful: number; totalRevenue: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Apnar Postman endpoint onujayi API call
        const response = await apiClient.get('/admin/dashboard-stats');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);
  if (loading) {
      return <GlobalLoading />;
    }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">City Admin Overview</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome to the Smart City Admin Control Panel. Monitor system operations from here.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Department er data backend theke asche na, tai ekhonkar moto Total Users dekhacchi */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <span className="text-xs font-semibold text-[#7E22CE] bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Total Users
          </span>
          <p className="text-4xl font-extrabold text-[#1E1B4B] mt-4">
            {loading ? '...' : stats?.users.total || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Total Complaints
          </span>
          <p className="text-4xl font-extrabold text-blue-900 mt-4">
            {loading ? '...' : stats?.complaints.total || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Active/Pending
          </span>
          <p className="text-4xl font-extrabold text-amber-700 mt-4">
            {loading ? '...' : (stats?.complaints.pending || 0) + (stats?.complaints.inProgress || 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Resolved Issues
          </span>
          <p className="text-4xl font-extrabold text-emerald-700 mt-4">
            {loading ? '...' : stats?.complaints.resolved || 0}
          </p>
        </div>
      </div>

      {/* Quick Action / Onboarding Banner */}
      <div className="bg-gradient-to-r from-[#1E1B4B] via-[#4C1D95] to-[#7E22CE] rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 mt-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Manage City Departments</h2>
          <p className="text-purple-200 text-sm max-w-xl leading-relaxed">
            Configure new departments, set up service categories, and manage the core structural data of the Smart City platform.
          </p>
        </div>
        <Link 
          href="/admin/departments" 
          className="bg-[#C026D3] hover:bg-[#a21caf] text-white px-6 py-3.5 rounded-xl font-bold shadow-[0_4px_14px_0_rgba(192,38,211,0.39)] hover:shadow-[0_6px_20px_rgba(192,38,211,0.23)] hover:-translate-y-0.5 transition-all whitespace-nowrap"
        >
          Go to Departments ➡️
        </Link>
      </div>

    </div>
  );
}