'use client';

import React, { useState, useEffect } from 'react';
import GlobalLoading from '@/app/loading';
import { useAuthStore } from '@/store/useAuthStore';
import { ReportSummary } from '@/components/manager/ReportSummary';
import { ReportTable } from '@/components/manager/ReportTable';
import apiClient from '@/lib/axios';

export default function DepartmentReportsPage() {
  const { user } = useAuthStore();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [departmentName, setDepartmentName] = useState('...');

  useEffect(() => {
    const fetchReportData = async () => {
      if (!user?.email) return;
      setIsLoading(true);

      try {
        // Fetch complaints, users (to find manager's dept ID), and departments
        const [complaintsRes, usersRes, deptRes] = await Promise.all([
          apiClient.get('/complaints?limit=200'),
          apiClient.get('/admin/users?limit=100'),
          apiClient.get('/departments')
        ]);

        const allUsers = Array.isArray(usersRes.data?.data) ? usersRes.data.data : (usersRes.data?.data?.users || []);
        const myFullProfile = allUsers.find((u: any) => u.email === user.email);
        const myDeptId = myFullProfile?.departmentId || user?.departmentId;

        if (myDeptId) {
          // Set Department Name
          const depts = Array.isArray(deptRes.data?.data) ? deptRes.data.data : (deptRes.data?.data?.departments || []);
          const currentDept = depts.find((d: any) => d.id === myDeptId);
          if (currentDept) setDepartmentName(currentDept.name);

          // Filter complaints for this manager's department
          const allComplaints = Array.isArray(complaintsRes.data?.data) ? complaintsRes.data.data : (complaintsRes.data?.data?.complaints || []);
          const deptComplaints = allComplaints.filter((c: any) => c.departmentId === myDeptId);
          
          setComplaints(deptComplaints);
        }
      } catch (err) {
        console.error('Failed to load report data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [user]);

  if (isLoading) {
    return <GlobalLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Department Reports</h1>
          <p className="text-gray-500 text-sm mt-1">
            Performance analytics and complaint logs for <span className="font-bold text-indigo-600">{departmentName}</span>.
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all">
          Generate PDF
        </button>
      </div>

      {/* Modular Components */}
      <ReportSummary complaints={complaints} />
      <ReportTable complaints={complaints} />
    </div>
  );
}