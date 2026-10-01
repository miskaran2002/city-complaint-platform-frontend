'use client';

import React, { useState, useEffect } from 'react';
import GlobalLoading from '@/app/loading';
import apiClient from '@/lib/axios';
import { AdminComplaintTable } from '@/components/admin/complaints/AdminComplaintTable';


export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      setIsLoading(true);
      try {
        // City Admin needs ALL data
        const [complaintsRes, deptsRes, usersRes] = await Promise.all([
          apiClient.get('/complaints?limit=500'), // limit বাড়ানো হলো যাতে সব কমপ্লেন আসে
          apiClient.get('/departments'),
          apiClient.get('/admin/users?limit=500') 
        ]);

        if (complaintsRes.data?.success) {
          setComplaints(Array.isArray(complaintsRes.data.data) ? complaintsRes.data.data : (complaintsRes.data.data?.complaints || []));
        }
        
        if (deptsRes.data?.success) {
          setDepartments(Array.isArray(deptsRes.data.data) ? deptsRes.data.data : (deptsRes.data.data?.departments || []));
        }

        if (usersRes.data?.success) {
          setUsers(Array.isArray(usersRes.data.data) ? usersRes.data.data : (usersRes.data.data?.users || []));
        }

      } catch (err) {
        console.error('Failed to load admin complaints data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (isLoading) {
    return <GlobalLoading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Assigned Complaints</h1>
        <p className="text-gray-500 text-sm mt-1">
          City-wide overview of all complaints across all departments and their assignment status.
        </p>
      </div>

      <AdminComplaintTable 
        complaints={complaints} 
        departments={departments}
        users={users}
      />
    </div>
  );
}