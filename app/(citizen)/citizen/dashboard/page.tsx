'use client';
import GlobalLoading from '@/app/loading';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/axios'; // Make sure this path matches your project structure

export default function CitizenDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, inProgress: 0, resolved: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch complaints from the backend
        const res = await apiClient.get('/complaints');
        const complaints = res.data?.data || [];
        
        // Count stats based on status
        setStats({
          total: complaints.length,
          inProgress: complaints.filter((c: any) => c.status === 'IN_PROGRESS').length,
          resolved: complaints.filter((c: any) => c.status === 'RESOLVED').length,
        });
      } catch (error) {
        console.error("Dashboard data fetch error", error);
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <GlobalLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground">Citizen Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back! Track your civic issues and request municipal services.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase">
            Total Submitted
          </span>
          <p className="text-4xl font-extrabold text-[#1E1B4B] mt-4">{stats.total}</p>
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <span className="text-xs font-semibold text-amber-600 bg-cardmber-50 px-3 py-1 rounded-full uppercase">
            In Progress
          </span>
          <p className="text-4xl font-extrabold text-amber-600 mt-4">{stats.inProgress}</p>
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">
            Resolved
          </span>
          <p className="text-4xl font-extrabold text-emerald-600 mt-4">{stats.resolved}</p>
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
        <Link 
          href="/citizen/complaints" 
          className="bg-[#C026D3] hover:bg-[#a21caf] text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all whitespace-nowrap inline-block text-center"
        >
          + New Complaint
        </Link>
      </div>

      {/* Emergency Payment Info Banner */}
      <div className="bg-cardmber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-cardmber-100 text-amber-600 flex items-center justify-center text-xl shrink-0">
          ⚠️
        </div>
        <div>
          <h3 className="font-bold text-amber-800 text-sm">Emergency Priority Fee</h3>
          <p className="text-amber-700 text-sm mt-1">
            Marking a complaint as <span className="font-semibold">Emergency</span> requires a one-time payment of <span className="font-semibold">$5 (USD)</span> to prioritize faster resolution. You&apos;ll be redirected to a secure Stripe checkout page after submitting an emergency complaint.
          </p>
        </div>
      </div>
    </div>
  );
}