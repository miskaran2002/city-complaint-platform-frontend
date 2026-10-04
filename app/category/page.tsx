// app/category/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/axios';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // আপনার ব্যাকএন্ডের রাউট অনুযায়ী এটি '/categories' বা '/category' হতে পারে
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Service <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4C1D95] to-[#C026D3]">Categories</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Browse through specific service categories to report issues or seek assistance in your city.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-xl font-semibold text-purple-600 animate-pulse">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
            No categories found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div key={category.id} className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden flex flex-col">
                
                {/* Image Section */}
                <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
                  {category.imageUrl ? (
                    <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <span className="text-indigo-300 font-bold text-xl">No Image</span>
                    </div>
                  )}
                </div>
                
                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Department Tag */}
                  {category.department && (
                    <span className="text-xs font-bold text-[#C026D3] uppercase tracking-wider mb-2 block">
                      {category.department.name}
                    </span>
                  )}
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{category.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1">
                    {category.description || 'Report issues related to this specific category.'}
                  </p>
                  
                  {/* Action Button */}
                  <Link href={`/citizen/complaints?category=${category.id}`} className="mt-auto text-center px-4 py-2.5 bg-purple-50 text-purple-700 font-bold rounded-xl hover:bg-purple-100 transition-colors w-full border border-purple-100">
                    Report an Issue &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}