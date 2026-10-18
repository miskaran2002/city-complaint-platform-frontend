'use client';

import React, { useState, useEffect } from 'react';
import GlobalLoading from '@/app/loading';
import apiClient from '@/lib/axios';
import { AdminCitizenTable } from '@/components/citizens/AdminCitizenTable';

export default function CitizenManagementPage() {
  const [citizens, setCitizens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔢 Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // প্রতি পেজে ১০ জন করে সিটিজেন দেখাবে

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
        setCurrentPage(1); // ডেটা নতুন করে লোড হলে পেজ ১ এ রিসেট হবে
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

  // 🎯 Pagination Calculations
  const totalPages = Math.ceil(citizens.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCitizens = citizens.slice(startIndex, startIndex + itemsPerPage);

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
        <h1 className="text-3xl font-extrabold text-foreground">Citizen Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          View all registered citizens on the platform and manage their account access.
        </p>
      </div>

      {/* Table Component */}
      <AdminCitizenTable
        citizens={currentCitizens} // 👈 এখানে শুধু বর্তমান পেজের ডেটা পাঠানো হচ্ছে
        onStatusUpdated={fetchCitizensData}
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