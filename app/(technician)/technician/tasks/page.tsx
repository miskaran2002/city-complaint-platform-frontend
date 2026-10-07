'use client';

import React, { useState, useEffect } from 'react';
import GlobalLoading from '@/app/loading';
import { useAuthStore } from '@/store/useAuthStore';
import { TechnicianTasksTable } from '@/components/technician/TechnicianTasksTable';
import apiClient from '@/lib/axios';

export default function TechnicianTasksPage() {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTechnicianTasks = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Backend automatically filters complaints by department for TECHNICIAN role
      const res = await apiClient.get('/complaints?limit=100');

      if (res.data?.success) {
        const allComplaints = Array.isArray(res.data.data) ? res.data.data : (res.data.data?.complaints || []);
        setTasks(allComplaints);
      }
    } catch (err) {
      console.error('Failed to load technician tasks', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicianTasks();
  }, [user]);

  if (isLoading) {
    return <GlobalLoading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground">My Department Tasks</h1>
        <p className="text-gray-500 text-sm mt-1">
          View and update field tasks assigned to your department.
        </p>
      </div>

      <TechnicianTasksTable 
        tasks={tasks} 
        onTaskUpdated={fetchTechnicianTasks} 
      />
    </div>
  );
}