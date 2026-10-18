// app/category/page.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import apiClient from '@/lib/axios';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { useAuthStore } from '@/store/useAuthStore';
import Footer from '@/components/shared/Footer';

interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  department?: {
    id: string;
    name: string;
  };
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'A-Z' | 'Z-A'>('A-Z');
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiClient.get('/categories');
        if (res.data?.success) {
          setCategories(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // 🎯 Filter, Search, and Sort Logic
  const filteredAndSortedCategories = useMemo(() => {
    let result = [...categories];

    // 1. Search Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        c => c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)
      );
    }

    // 2. Department Filter
    if (selectedDept !== 'ALL') {
      result = result.filter(c => c.department?.name === selectedDept);
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortOrder === 'A-Z') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

    return result;
  }, [categories, searchQuery, selectedDept, sortOrder]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDept, sortOrder]);

  // 🎯 Pagination Calculations
  const totalPages = Math.ceil(filteredAndSortedCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = filteredAndSortedCategories.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Get unique departments for filter dropdown
  const uniqueDepartments = Array.from(new Set(categories.map(c => c.department?.name).filter(Boolean)));

  const getActionProps = (categoryId: string) => {
    if (!user) return { text: 'Login to Report →', link: '/login' };
    switch (user.role) {
      case 'CITY_ADMIN': return { text: 'Manage Category →', link: `/admin/categories?id=${categoryId}` };
      case 'DEPARTMENT_MANAGER': return { text: 'View Reports →', link: `/manager/reports?category=${categoryId}` };
      case 'DEPARTMENT_STAFF': return { text: 'View Complaints →', link: `/staff/complaints?category=${categoryId}` };
      case 'TECHNICIAN': return { text: 'View Tasks →', link: `/technician/tasks?category=${categoryId}` };
      case 'CITIZEN':
      default: return { text: 'Report an Issue →', link: `/citizen/complaints?category=${categoryId}` };
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-10 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4C1D95] to-[#C026D3]">Categories</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Find the right department and report your civic issues quickly.
          </p>
        </div>

        {/* 🔍 Search & Filters Section */}
        <div className="bg-card shadow-sm border border-border rounded-2xl p-4 sm:p-6 mb-10 flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm text-foreground transition-all"
            />
          </div>

          {/* Department Filter */}
          <div className="w-full md:w-56">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm text-foreground appearance-none cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              {uniqueDepartments.map((dept, idx) => (
                <option key={idx} value={dept as string}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
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
            Showing {currentCategories.length > 0 ? startIndex + 1 : 0} - {startIndex + currentCategories.length} of {filteredAndSortedCategories.length} categories
          </p>
        )}

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden flex flex-col h-[400px]">
                <div className="h-48 w-full bg-slate-200 dark:bg-white/10 animate-pulse"></div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="h-3 bg-purple-200 dark:bg-purple-900/30 rounded-full w-1/3 mb-4 animate-pulse"></div>
                  <div className="h-7 bg-slate-200 dark:bg-white/10 rounded-lg w-3/4 mb-4 animate-pulse"></div>
                  <div className="h-20 bg-slate-100 dark:bg-white/5 rounded-xl w-full animate-pulse mb-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : currentCategories.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-20 bg-card rounded-2xl shadow-sm border border-border">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-foreground mb-1">No results found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {currentCategories.map((category) => {
                const action = getActionProps(category.id);
                return (
                  <div key={category.id} className="group bg-card rounded-3xl shadow-sm hover:shadow-xl transition-all border border-border overflow-hidden flex flex-col">
                    <div className="h-48 w-full bg-gray-200 dark:bg-white/5 relative overflow-hidden">
                      {category.imageUrl ? (
                        <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/40 dark:to-purple-950/40 flex items-center justify-center">
                          <span className="text-indigo-300 dark:text-indigo-400 font-bold text-xl">No Image</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      {category.department && (
                        <span className="text-xs font-bold text-[#C026D3] uppercase tracking-wider mb-2 block">
                          {category.department.name}
                        </span>
                      )}
                      <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{category.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-6 flex-1">
                        {category.description || 'Report issues related to this specific category.'}
                      </p>
                      
                      <Link 
                        href={action.link} 
                        className="mt-auto text-center px-4 py-2.5 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold rounded-xl hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors w-full border border-purple-100 dark:border-purple-500/20"
                      >
                        {action.text}
                      </Link>
                    </div>
                  </div>
                );
              })}
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