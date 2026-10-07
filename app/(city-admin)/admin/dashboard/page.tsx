'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import GlobalLoading from '@/app/loading';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';

interface DashboardStats {
  users: { 
    total: number;
    byRole?: { name: string; value: number; color?: string }[]; 
  };
  complaints: { 
    total: number; 
    pending: number; 
    inProgress: number; 
    resolved: number; 
  };
  payments: { 
    successful: number; 
    totalRevenue: number;
    monthlyTrend?: { month: string; amount: number }[]; 
  };
  departments?: {
    total: number;
    categoryCount?: { name: string; categories: number }[];
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
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

  // ==========================================
  // real data from backend is used for charts and summaries
  // ==========================================
  
  const userRolesData = stats?.users.byRole || [
    { name: 'Citizens', value: 150, color: '#8B5CF6' },
    { name: 'Staff', value: 35, color: '#10B981' },
    { name: 'Technicians', value: 25, color: '#F59E0B' },
    { name: 'Managers', value: 15, color: '#3B82F6' },
    { name: 'Admins', value: 5, color: '#EF4444' },
  ];

  const departmentCategoriesData = stats?.departments?.categoryCount || [
    { name: 'WASA', categories: 4 },
    { name: 'City Corp', categories: 8 },
    { name: 'Roads', categories: 5 },
    { name: 'Power', categories: 3 },
    { name: 'Health', categories: 6 },
  ];

  const revenueData = stats?.payments.monthlyTrend || [
    { month: 'Jan', amount: 150 },
    { month: 'Feb', amount: 280 },
    { month: 'Mar', amount: 210 },
    { month: 'Apr', amount: 350 },
    { month: 'May', amount: 420 },
    { month: 'Jun', amount: 380 },
  ];

  // complaints data for pie chart
  const complaintsData = [
    { name: 'Resolved', value: stats?.complaints.resolved || 0, color: '#10B981' },
    { name: 'In Progress', value: stats?.complaints.inProgress || 0, color: '#3B82F6' },
    { name: 'Pending', value: stats?.complaints.pending || 0, color: '#F59E0B' },
  ];

  // total income in USD and BDT
  const totalIncomeUSD = stats?.payments.totalRevenue || 0;
  const totalIncomeBDT = totalIncomeUSD * 120;

  return (
    <div className="space-y-8">
      
      {/* header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground dark:text-white transition-colors duration-300">City Admin Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors duration-300">
          Welcome to the Smart City Admin Control Panel. Monitor system operations from here.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card dark:bg-[#0A0515] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-border flex flex-col justify-center transition-colors duration-300">
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-3 py-1 rounded-full uppercase tracking-wider w-max mb-3">
            Total Revenue
          </span>
          <h3 className="text-3xl font-black text-[#1E1B4B] dark:text-white">${totalIncomeUSD.toLocaleString()}</h3>
          <p className="text-sm font-semibold text-gray-400 mt-1">৳ {totalIncomeBDT.toLocaleString()} BDT</p>
        </div>
        
        <div className="bg-card dark:bg-[#0A0515] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-border flex flex-col justify-center transition-colors duration-300">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-wider w-max mb-3">
            Total Users
          </span>
          <h3 className="text-3xl font-black text-blue-900 dark:text-white">{stats?.users.total || 0}</h3>
          <p className="text-sm font-semibold text-gray-400 mt-1">Registered accounts</p>
        </div>

        <div className="bg-card dark:bg-[#0A0515] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-border flex flex-col justify-center transition-colors duration-300">
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-cardmber-50 dark:bg-cardmber-500/10 px-3 py-1 rounded-full uppercase tracking-wider w-max mb-3">
            Total Complaints
          </span>
          <h3 className="text-3xl font-black text-amber-700 dark:text-white">{stats?.complaints.total || 0}</h3>
          <p className="text-sm font-semibold text-gray-400 mt-1">Active: {(stats?.complaints.pending || 0) + (stats?.complaints.inProgress || 0)}</p>
        </div>

        <div className="bg-card dark:bg-[#0A0515] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-border flex flex-col justify-center transition-colors duration-300">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-wider w-max mb-3">
            Resolved Issues
          </span>
          <h3 className="text-3xl font-black text-emerald-700 dark:text-white">{stats?.complaints.resolved || 0}</h3>
          <p className="text-sm font-semibold text-gray-400 mt-1">Successfully fixed</p>
        </div>
      </div>

      {/* Chart Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Revenue Trend (Area Chart) */}
        <div className="bg-card dark:bg-[#0A0515] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-border transition-colors duration-300">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 border-b dark:border-border pb-2 transition-colors duration-300">Revenue Trend (USD)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.2} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ stroke: '#C026D3', strokeWidth: 2, strokeDasharray: '3 3' }} 
                  contentStyle={{ backgroundColor: '#0A0515', borderColor: '#ffffff1a', color: '#fff', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Categories per Department (Bar Chart) */}
        <div className="bg-card dark:bg-[#0A0515] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-border transition-colors duration-300">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 border-b dark:border-border pb-2 transition-colors duration-300">Categories per Department</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentCategoriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#ffffff0a' }} 
                  contentStyle={{ backgroundColor: '#0A0515', borderColor: '#ffffff1a', color: '#fff', borderRadius: '8px' }}
                />
                <Bar dataKey="categories" fill="#C026D3" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. User Roles Distribution (Doughnut Chart) */}
        <div className="bg-card dark:bg-[#0A0515] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-border flex flex-col items-center transition-colors duration-300">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 w-full text-left border-b dark:border-border pb-2 transition-colors duration-300">User Roles Distribution</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userRolesData}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {userRolesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#8B5CF6'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0A0515', borderColor: '#ffffff1a', color: '#fff', borderRadius: '8px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '20px', color: '#9CA3AF' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Complaints Resolution Status (Doughnut Chart) */}
        <div className="bg-card dark:bg-[#0A0515] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-border flex flex-col items-center transition-colors duration-300">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 w-full text-left border-b dark:border-border pb-2 transition-colors duration-300">Complaints Resolution Status</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complaintsData.filter(d => d.value > 0)} // Filter out data with 0 values
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {complaintsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0A0515', borderColor: '#ffffff1a', color: '#fff', borderRadius: '8px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '20px', color: '#9CA3AF' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Quick Action / Onboarding Banner */}
      <div className="bg-gradient-to-r from-[#1E1B4B] via-[#4C1D95] to-[#7E22CE] rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
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