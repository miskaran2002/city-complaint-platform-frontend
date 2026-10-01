'use client';

import React, { useState, useEffect } from 'react';
import GlobalLoading from '@/app/loading';
import apiClient from '@/lib/axios';
import { AdminCitizenTable } from '@/components/citizens/AdminCitizenTable';

export default function CitizenManagementPage() {
  const [citizens, setCitizens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCitizensData = async () => {
    setIsLoading(true);
    try {
      // Fetching all users (You can adjust limit if you have many users)
      const res = await apiClient.get('/admin/users?limit=1000');

      if (res.data?.success) {
        const allUsers = Array.isArray(res.data.data) ? res.data.data : (res.data.data?.users || []);
        
        // Filter only citizens
        const citizenList = allUsers.filter((u: any) => u.role === 'CITIZEN');
        setCitizens(citizenList);
      }
    } catch (err) {
      console.error('Failed to load citizens', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizensData();
  }, []);

  if (isLoading) {
    return <GlobalLoading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Citizen Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          View all registered citizens on the platform and manage their account access.
        </p>
      </div>

      <AdminCitizenTable
        citizens={citizens} 
        onStatusUpdated={fetchCitizensData}
      />
    </div>
  );
}