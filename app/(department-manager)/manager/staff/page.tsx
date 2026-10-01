'use client';

import React, { useState, useEffect } from 'react';
import GlobalLoading from '@/app/loading';

import { useAuthStore } from '@/store/useAuthStore';
import { StaffTable } from '@/components/manager/StaffTable';
import apiClient from '@/lib/axios';

export default function StaffManagementPage() {
  const { user } = useAuthStore();
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Data fetch korar function ti alada kora holo jate eta re-use kora jay
  const fetchTeamData = async () => {
    if (!user?.email) return;
    try {
      const res = await apiClient.get('/admin/users?limit=100');
      
      if (res.data?.success) {
        const allUsers = Array.isArray(res.data.data) ? res.data.data : (res.data.data?.users || []);
        
        const myFullProfile = allUsers.find((u: any) => u.email === user.email);
        const myDeptId = myFullProfile?.departmentId || user?.departmentId;

        if (myDeptId) {
          const team = allUsers.filter((u: any) => 
            (u.role === 'DEPARTMENT_STAFF' || u.role === 'TECHNICIAN') &&
            u.departmentId === myDeptId
          );
          setTeamMembers(team);
        }
      }
    } catch (err) {
      console.error('Failed to load team data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, [user]);

  if (isLoading) {
    return <GlobalLoading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Staff Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage and view all personnel assigned to your department.
        </p>
      </div>

      {/* 🔴 onStatusUpdated prop er maddhome fetchTeamData pass kora holo 🔴 */}
      <StaffTable 
        teamMembers={teamMembers} 
        onStatusUpdated={fetchTeamData} 
      />
    </div>
  );
}