'use client';

import React, { useState, useEffect } from 'react';
import GlobalLoading from '@/app/loading';
import { useAuthStore } from '@/store/useAuthStore';
import { DashboardMetrics } from '@/components/manager/DashboardMetrics';
import { DepartmentTeamList } from '@/components/manager/DepartmentTeamList';
import apiClient from '@/lib/axios';

export default function ManagerDashboardPage() {
  const { user } = useAuthStore();
  const [departmentName, setDepartmentName] = useState('Loading...');
  const [complaints, setComplaints] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchManagerData = async () => {
      if (!user?.email) return;
      
      setIsLoading(true);
      try {
        // ⚠️ pagenation limit
        const [complaintsRes, usersRes, deptRes] = await Promise.all([
          apiClient.get('/complaints?limit=100'),
          apiClient.get('/admin/users?limit=100'),
          apiClient.get('/departments')
        ]);

        // 1.user
        const allUsers = Array.isArray(usersRes.data?.data) ? usersRes.data.data : (usersRes.data?.data?.users || []);
        const myFullProfile = allUsers.find((u: any) => u.email === user.email);
        
        // 2. original departmentId
        const myDeptId = myFullProfile?.departmentId || user?.departmentId;

        // 3. department name
        if (myDeptId && deptRes.data?.success) {
          const depts = Array.isArray(deptRes.data.data) ? deptRes.data.data : (deptRes.data.data?.departments || []);
          const currentDept = depts.find((d: any) => d.id === myDeptId);
          if (currentDept) {
            setDepartmentName(currentDept.name);
          } else {
             setDepartmentName('Unknown Department');
          }
        } else {
           setDepartmentName('Unknown Department');
        }

        // 4.Team members filter 
        if (myDeptId) {
          const team = allUsers.filter((u: any) => 
            (u.role === 'DEPARTMENT_STAFF' || u.role === 'TECHNICIAN') &&
            u.departmentId === myDeptId
          );
          setTeamMembers(team);
        }

        // 5. My complaints
        if (complaintsRes.data?.success) {
          const allComplaints = Array.isArray(complaintsRes.data?.data) ? complaintsRes.data.data : (complaintsRes.data?.data?.complaints || []);
          const myComplaints = myDeptId 
            ? allComplaints.filter((c: any) => c.departmentId === myDeptId) 
            : allComplaints;
          setComplaints(myComplaints);
        }

      } catch (err) {
        console.error('Failed to load manager dashboard data', err);
        setDepartmentName('Error loading data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchManagerData();
  }, [user]);

  if (isLoading) {
    return <GlobalLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground">Manager Overview</h1>
        <p className="text-gray-500 text-sm mt-1">
          Supervising operations and personnel for <span className="font-bold text-[#7E22CE]">{departmentName}</span>.
        </p>
      </div>

      {/* Modular Components */}
      <DashboardMetrics complaints={complaints} />
      <DepartmentTeamList 
        teamMembers={teamMembers} 
        departmentName={departmentName !== 'Loading...' && departmentName !== 'Unknown Department' && departmentName !== 'Error loading data' ? departmentName : undefined} 
      />
    </div>
  );
}