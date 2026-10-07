'use client';

import React, { useState, useEffect } from 'react';
import GlobalLoading from '@/app/loading';

import { useAuthStore } from '@/store/useAuthStore';
import { TechnicianDashboardMetrics } from '@/components/technician/TechnicianDashboardMetrics';
import apiClient from '@/lib/axios';

export default function TechnicianDashboardPage() {
  const { user } = useAuthStore();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [departmentName, setDepartmentName] = useState<string>('Loading Department...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // 1. Fetch complaints and departments (Removed non-existent /auth/me)
        const [complaintsRes, deptsRes] = await Promise.all([
          apiClient.get('/complaints?limit=100'),
          apiClient.get('/departments')
        ]);

        if (complaintsRes.data?.success) {
          const allComplaints = Array.isArray(complaintsRes.data.data) ? complaintsRes.data.data : (complaintsRes.data.data?.complaints || []);
          setComplaints(allComplaints);
        }
        
        // 2. Find Department Name using local store user departmentId
        if (deptsRes.data?.success) {
          const departmentsList = Array.isArray(deptsRes.data.data) ? deptsRes.data.data : (deptsRes.data.data?.departments || []);
          
          const myDeptId = user?.departmentId;
          const currentDept = departmentsList.find((d: any) => d.id === myDeptId);
          
          if (currentDept) {
            setDepartmentName(currentDept.name);
          } else {
            setDepartmentName('Assigned Department');
          }
        }
      } catch (err) {
        console.error('Failed to load technician dashboard data', err);
        setDepartmentName('Department Dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (isLoading) {
    return <GlobalLoading />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground">
          Hello, {user?.name || 'Technician'} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome to your field dashboard. Here is the current status of your department.
        </p>
      </div>

      <TechnicianDashboardMetrics 
        departmentName={departmentName} 
        complaints={complaints} 
      />

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-start gap-4">
        <div className="text-2xl mt-0.5">🚀</div>
        <div>
          <h4 className="text-sm font-bold text-indigo-900">Ready to start working?</h4>
          <p className="text-sm text-indigo-700 mt-1">
            Go to the <span className="font-bold">My Tasks</span> tab from the sidebar to view the specific complaints assigned to you and update their statuses.
          </p>
        </div>
      </div>
    </div>
  );
}