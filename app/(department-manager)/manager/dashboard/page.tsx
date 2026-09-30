'use client';

import React, { useState, useEffect } from 'react';
import GlobalLoading from '@/app/loading';
import { useAuthStore } from '@/store/useAuthStore';
import { DashboardMetrics } from '@/components/manager/DashboardMetrics';
import { DepartmentTeamList } from '@/components/manager/DepartmentTeamList';
import apiClient from '@/lib/axios';

export default function ManagerDashboardPage() {
  const { user } = useAuthStore();
  const [departmentName, setDepartmentName] = useState('Department Overview');
  const [complaints, setComplaints] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchManagerData = async () => {
      setIsLoading(true);
      try {
        // Fetch complaints, users, and departments concurrently
        const [complaintsRes, usersRes, deptRes] = await Promise.all([
          apiClient.get('/complaints'),
          apiClient.get('/admin/users'),
          apiClient.get('/departments')
        ]);

        // 1. Set Department Name
        if (deptRes.data?.success && user?.departmentId) {
          const depts = Array.isArray(deptRes.data.data) ? deptRes.data.data : (deptRes.data.data?.departments || []);
          const currentDept = depts.find((d: any) => d.id === user.departmentId);
          if (currentDept) setDepartmentName(currentDept.name);
        }

        // 2. Set Complaints (Filtered implicitly by backend, but safe filtering here)
        if (complaintsRes.data?.success) {
          const allComplaints = Array.isArray(complaintsRes.data.data) ? complaintsRes.data.data : (complaintsRes.data.data?.complaints || []);
          const filteredComplaints = user?.departmentId 
            ? allComplaints.filter((c: any) => c.departmentId === user.departmentId) 
            : allComplaints;
          setComplaints(filteredComplaints);
        }

        // 3. Set Team Members (Staff & Technicians of this department)
        if (usersRes.data?.success) {
          const allUsers = Array.isArray(usersRes.data.data) ? usersRes.data.data : (usersRes.data.data?.users || []);
          // Note: Backend should ideally filter this, but frontend filtering ensures strict scope
          const team = allUsers.filter((u: any) => 
            (u.role === 'DEPARTMENT_STAFF' || u.role === 'TECHNICIAN') &&
            (u.departmentId === user?.departmentId)
          );
          setTeamMembers(team);
        }

      } catch (err) {
        console.error('Failed to load manager dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchManagerData();
    }
  }, [user]);

  if (isLoading) {
    return <GlobalLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Manager Overview</h1>
        <p className="text-gray-500 text-sm mt-1">
          Supervising operations and personnel for <span className="font-bold text-[#7E22CE]">{departmentName}</span>.
        </p>
      </div>

      {/* Modular Components */}
      <DashboardMetrics complaints={complaints} />
      <DepartmentTeamList teamMembers={teamMembers} />
      
    </div>
  );
}