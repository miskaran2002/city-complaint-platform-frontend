'use client';

import React, { useState, useEffect } from 'react';
import GlobalLoading from '@/app/loading';
import apiClient from '@/lib/axios';
import { AdminStaffTable } from '@/components/admin/staff/AdminStaffTable';


export default function AdminStaffManagementPage() {
  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, deptsRes] = await Promise.all([
        apiClient.get('/admin/users?limit=500'),
        apiClient.get('/departments')
      ]);

      if (usersRes.data?.success) {
        const allUsers = Array.isArray(usersRes.data.data) ? usersRes.data.data : (usersRes.data.data?.users || []);
        
        // Admin shouldn't manage citizens or themselves in this staff view usually
        const personnel = allUsers.filter((u: any) => 
          ['DEPARTMENT_MANAGER', 'DEPARTMENT_STAFF', 'TECHNICIAN'].includes(u.role)
        );
        setSystemUsers(personnel);
      }
      
      if (deptsRes.data?.success) {
        setDepartments(Array.isArray(deptsRes.data.data) ? deptsRes.data.data : (deptsRes.data.data?.departments || []));
      }

    } catch (err) {
      console.error('Failed to load system users', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (isLoading) {
    return <GlobalLoading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground">System Users & Staff</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage all department managers, staff, and field technicians across the city.
        </p>
      </div>

      <AdminStaffTable 
        systemUsers={systemUsers} 
        departments={departments} 
        onStatusUpdated={fetchAdminData}
      />
    </div>
  );
}