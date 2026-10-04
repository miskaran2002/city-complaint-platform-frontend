// app/departments/page.tsx
'use client';
import React, { useEffect, useState } from 'react';

import apiClient from '@/lib/axios';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';

interface Department {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await apiClient.get('/departments');
        if (res.data?.success) setDepartments(res.data.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchDepartments();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            City <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4C1D95] to-[#C026D3]">Departments</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept) => (
            <Link href={`/departments/${dept.id}`} key={dept.id} className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden flex flex-col">
              {/* Image Section */}
              <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
                {dept.imageUrl ? (
                  <img src={dept.imageUrl} alt={dept.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <span className="text-purple-300 font-bold text-xl">No Image</span>
                  </div>
                )}
              </div>
              
              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{dept.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                  {dept.description || 'Dedicated to serving the city and managing civic responsibilities.'}
                </p>
                <div className="text-purple-600 font-semibold text-sm flex items-center gap-1">
                  View Details &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}