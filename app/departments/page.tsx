// app/departments/page.tsx
'use client';

import React, { useEffect, useState } from 'react';

import apiClient from '@/lib/axios'; // Apnar axios instance path onujayi miliye nin
import GlobalLoading from '@/app/loading'; // Loading component thakle path miliye nin (na thakle simple text din)
import { Navbar } from '@/components/shared/Navbar';

interface Department {
  id: string;
  name: string;
  description?: string;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await apiClient.get('/departments');
        // API theke success: true ebong data asche[cite: 19]
        if (res.data?.success) {
          setDepartments(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (loading) {
    return <GlobalLoading />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            City <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4C1D95] to-[#C026D3]">Departments</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Explore the different departments dedicated to keeping our city safe, clean, and functioning smoothly.
          </p>
        </div>

        {departments.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
            No departments found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div 
                key={dept.id} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow hover:border-purple-200 group"
              >
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{dept.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                  {dept.description || 'This department handles civic issues and provides municipal services for the betterment of the city.'}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}