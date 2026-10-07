// app/category/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/axios';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { useAuthStore } from '@/store/useAuthStore';

interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  department?: {
    name: string;
  };
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
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

  const getActionProps = (categoryId: string) => {
    if (!user) {
      return { text: 'Login to Report →', link: '/login' };
    }
    
    switch (user.role) {
      case 'CITY_ADMIN':
        return { text: 'Manage Category →', link: `/admin/categories?id=${categoryId}` };
      case 'DEPARTMENT_MANAGER':
        return { text: 'View Reports →', link: `/manager/reports?category=${categoryId}` };
      case 'DEPARTMENT_STAFF':
        return { text: 'View Complaints →', link: `/staff/complaints?category=${categoryId}` };
      case 'TECHNICIAN':
        return { text: 'View Tasks →', link: `/technician/tasks?category=${categoryId}` };
      case 'CITIZEN':
      default:
        return { text: 'Report an Issue →', link: `/citizen/complaints?category=${categoryId}` };
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header centered */}
        <div className="text-center mb-16 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Service <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4C1D95] to-[#C026D3] dark:from-purple-400 dark:to-[#C026D3]">Categories</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Browse through specific service categories to report issues or seek assistance in your city.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden flex flex-col h-[400px]">
                <div className="h-48 w-full bg-slate-200 dark:bg-white/10 animate-pulse"></div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="h-3 bg-purple-200 dark:bg-purple-900/30 rounded-full w-1/3 mb-4 animate-pulse"></div>
                  <div className="h-7 bg-slate-200 dark:bg-white/10 rounded-lg w-3/4 mb-4 animate-pulse"></div>
                  <div className="space-y-2 mb-6 flex-1">
                    <div className="h-3 bg-slate-100 dark:bg-white/5 rounded-full w-full animate-pulse"></div>
                    <div className="h-3 bg-slate-100 dark:bg-white/5 rounded-full w-5/6 animate-pulse"></div>
                  </div>
                  <div className="h-11 bg-slate-100 dark:bg-white/5 rounded-xl w-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10 bg-card rounded-2xl shadow-sm border border-border">
            No categories found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
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
        )}
      </main>
    </div>
  );
}