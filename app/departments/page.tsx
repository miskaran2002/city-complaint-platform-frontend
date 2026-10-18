// app/departments/page.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import apiClient from '@/lib/axios';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

interface Department {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  // 🎯 Filtering & Sorting States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL'); // মিডিয়া ফিল্টারের বদলে ডিপার্টমেন্ট ফিল্টার
  const [sortOrder, setSortOrder] = useState<'A-Z' | 'Z-A'>('A-Z');

  // 🔢 Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await apiClient.get('/departments');
        if (res.data?.success) setDepartments(res.data.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  // 🎯 Filter, Search, and Sort Logic
  const filteredAndSortedDepartments = useMemo(() => {
    let result = [...departments];

    // 1. Search Filter (by name or description)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        d => d.name.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q)
      );
    }

    // 2. Department Dropdown Filter
    if (selectedDept !== 'ALL') {
      result = result.filter(d => d.name === selectedDept);
    }

    // 3. Sorting (A-Z or Z-A)
    result.sort((a, b) => {
      if (sortOrder === 'A-Z') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

    return result;
  }, [departments, searchQuery, selectedDept, sortOrder]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDept, sortOrder]);

  // 🎯 Pagination Calculations
  const totalPages = Math.ceil(filteredAndSortedDepartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDepartments = filteredAndSortedDepartments.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Get unique department names for the dropdown
  const uniqueDepartments = Array.from(new Set(departments.map(d => d.name).filter(Boolean)));

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-10 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            City <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4C1D95] to-[#C026D3] dark:from-purple-400 dark:to-[#C026D3]">Departments</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the departments working to manage civic responsibilities and improve our city.
          </p>
        </div>

        {/* 🔍 Search & Filters Section */}
        <div className="bg-card shadow-sm border border-border rounded-2xl p-4 sm:p-6 mb-10 flex flex-col md:flex-row gap-4">
          
          {/* 1. Search Bar */}
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm text-foreground transition-all"
            />
          </div>

          {/* 2. Department Name Filter */}
          <div className="w-full md:w-64">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm text-foreground appearance-none cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              {uniqueDepartments.map((deptName, idx) => (
                <option key={idx} value={deptName as string}>{deptName}</option>
              ))}
            </select>
          </div>

          {/* 3. Sort Filter */}
          <div className="w-full md:w-48">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'A-Z' | 'Z-A')}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm text-foreground appearance-none cursor-pointer"
            >
              <option value="A-Z">Sort: A to Z</option>
              <option value="Z-A">Sort: Z to A</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        {!loading && (
          <p className="text-sm font-bold text-gray-500 mb-6 px-2">
            Showing {currentDepartments.length > 0 ? startIndex + 1 : 0} - {startIndex + currentDepartments.length} of {filteredAndSortedDepartments.length} departments
          </p>
        )}

        {/* Departments Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden flex flex-col h-[400px] animate-pulse">
                <div className="h-48 w-full bg-slate-200 dark:bg-white/10"></div>
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="h-8 w-3/4 bg-slate-200 dark:bg-white/10 rounded-lg"></div>
                  <div className="space-y-2 mb-4 flex-1">
                    <div className="h-3 w-full bg-slate-200 dark:bg-white/5 rounded-full"></div>
                    <div className="h-3 w-5/6 bg-slate-200 dark:bg-white/5 rounded-full"></div>
                    <div className="h-3 w-4/6 bg-slate-200 dark:bg-white/5 rounded-full"></div>
                  </div>
                  <div className="h-4 w-1/3 bg-purple-100 dark:bg-purple-900/30 rounded-full mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : currentDepartments.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-20 bg-card rounded-2xl shadow-sm border border-border">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-xl font-bold text-foreground mb-1">No departments found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {currentDepartments.map((dept) => (
                <Link href={`/departments/${dept.id}`} key={dept.id} className="group bg-card rounded-3xl shadow-sm hover:shadow-xl transition-all border border-border overflow-hidden flex flex-col">
                  {/* Image Section */}
                  <div className="h-48 w-full bg-gray-200 dark:bg-white/5 relative overflow-hidden">
                    {dept.imageUrl ? (
                      <img src={dept.imageUrl} alt={dept.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/40 dark:to-pink-950/40 flex items-center justify-center">
                        <span className="text-purple-300 dark:text-purple-400 font-bold text-xl">No Image</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{dept.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                      {dept.description || 'Dedicated to serving the city and managing civic responsibilities.'}
                    </p>
                    <div className="text-purple-600 dark:text-purple-400 font-semibold text-sm flex items-center gap-1 mt-auto">
                      View Details &rarr;
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 🔢 Numeric Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
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
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}