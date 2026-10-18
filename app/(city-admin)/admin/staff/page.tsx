'use client';

import React, { useState, useEffect } from 'react';
import GlobalLoading from '@/app/loading';
import apiClient from '@/lib/axios';
import { AdminStaffTable } from '@/components/admin/staff/AdminStaffTable';

export default function AdminStaffManagementPage() {
  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔢 Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // প্রতি পেজে ১০ জন করে স্টাফ দেখাবে

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
        setCurrentPage(1); // ডেটা নতুন করে লোড হলে পেজ ১ এ রিসেট হবে
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

  // 🎯 Pagination Calculations
  const totalPages = Math.ceil(systemUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentStaff = systemUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (isLoading) {
    return <GlobalLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground">System Users & Staff</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage all department managers, staff, and field technicians across the city.
        </p>
      </div>

      {/* Table Component */}
      <AdminStaffTable 
        systemUsers={currentStaff} // 👈 এখানে শুধু বর্তমান পেজের ডেটা পাঠানো হচ্ছে
        departments={departments} 
        onStatusUpdated={fetchAdminData}
      />

      {/* 🔢 Numeric Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {/* Previous Button */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-bold rounded-lg border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 transition-colors"
          >
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                currentPage === page
                  ? 'bg-[#7E22CE] text-white border border-[#7E22CE] shadow-md'
                  : 'border border-border bg-card text-foreground hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-bold rounded-lg border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}