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

  // 🔢 Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // প্রতি পেজে ১০টি করে কমপ্লেইন দেখাবে

  useEffect(() => {
    const fetchAdminData = async () => {
      setIsLoading(true);
      try {
        // City Admin needs ALL data
        const [complaintsRes, deptsRes, usersRes] = await Promise.all([
          apiClient.get('/complaints?limit=500'), // limit বাড়ানো হলো যাতে সব কমপ্লেন আসে
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

  // 🎯 Pagination Calculations
  const totalPages = Math.ceil(complaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentComplaints = complaints.slice(startIndex, startIndex + itemsPerPage);

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
      <div>
        <h1 className="text-3xl font-extrabold text-foreground dark:text-white transition-colors duration-300">Assigned Complaints</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors duration-300">
          City-wide overview of all complaints across all departments and their assignment status.
        </p>
      </div>

      {/* Table Component */}
      <AdminComplaintTable 
        complaints={currentComplaints} // 👈 এখানে শুধু বর্তমান পেজের ডেটা পাঠানো হচ্ছে
        departments={departments}
        users={users}
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