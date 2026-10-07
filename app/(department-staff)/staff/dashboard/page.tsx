'use client';

import React, { useState, useEffect } from 'react';
import GlobalLoading from '@/app/loading';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import apiClient from '@/lib/axios';

export default function StaffDashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState<any[]>([]);
  const [departmentName, setDepartmentName] = useState('Department Staff');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Parallel API call to fetch complaints and departments
        const [complaintsRes, deptRes] = await Promise.all([
          apiClient.get('/complaints'),
          apiClient.get('/departments')
        ]);

        // Match departmentId to find and display the department name
        if (deptRes.data && deptRes.data.success) {
          const depts = Array.isArray(deptRes.data.data) ? deptRes.data.data : (deptRes.data.data?.departments || []);
          const currentDept = depts.find((d: any) => d.id === user?.departmentId);
          if (currentDept) {
            setDepartmentName(currentDept.name);
          }
        }

        if (complaintsRes.data && complaintsRes.data.success) {
          const allComplaints = Array.isArray(complaintsRes.data.data) 
            ? complaintsRes.data.data 
            : (complaintsRes.data.data?.complaints || []);
          
          // Filter complaints specifically by staff's departmentId
          const filteredComplaints = user?.departmentId 
            ? allComplaints.filter((c: any) => c.departmentId === user.departmentId)
            : allComplaints;

          setRecentComplaints(filteredComplaints.slice(0, 5));

          const total = filteredComplaints.length;
          const pending = filteredComplaints.filter((c: any) => c.status === 'PENDING').length;
          const inProgress = filteredComplaints.filter((c: any) => c.status === 'IN_PROGRESS').length;
          const resolved = filteredComplaints.filter((c: any) => c.status === 'RESOLVED').length;

          setStats({ total, pending, inProgress, resolved });
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (isLoading) {
    return <GlobalLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Department Name */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground">Staff Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Managing complaints and assignments for <span className="font-bold text-[#7E22CE]">{departmentName}</span>.
        </p>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Total Department Complaints</span>
          <div className="text-3xl font-extrabold text-foreground mt-2">{stats.total}</div>
        </div>
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending</span>
          <div className="text-3xl font-extrabold text-foreground mt-2">{stats.pending}</div>
        </div>
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">In Progress</span>
          <div className="text-3xl font-extrabold text-foreground mt-2">{stats.inProgress}</div>
        </div>
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Resolved</span>
          <div className="text-3xl font-extrabold text-foreground mt-2">{stats.resolved}</div>
        </div>
      </div>

      {/* Recent Assigned Complaints Table */}
      <div className="bg-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-background/50">
          <h2 className="text-lg font-bold text-gray-800">Recent Department Complaints</h2>
          <Link 
            href="/staff/complaints"
            className="text-xs font-bold text-[#7E22CE] hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-4">Complaint Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {recentComplaints.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 italic">No complaints found for your department.</td>
                </tr>
              ) : (
                recentComplaints.map((item) => (
                  <tr key={item.id} className="hover:bg-background/50 transition-colors">
                    <td className="p-4 font-bold text-gray-800">{item.title}</td>
                    <td className="p-4">
                      <span className="bg-purple-50 text-[#7E22CE] px-2.5 py-1 rounded-md text-xs font-bold border border-purple-100">
                        {item.category?.name || 'General'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                        item.priority === 'URGENT' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-gray-700">{item.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}