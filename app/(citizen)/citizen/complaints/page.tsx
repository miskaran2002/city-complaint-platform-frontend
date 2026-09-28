// app/(citizen)/citizen/complaints/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Complaint } from '@/types/complaint';

import { getMyComplaints } from '@/services/complaint.service';
import { Category } from '@/types/category';
import { getAllCategories } from '@/services/category.service';
import { ComplaintForm } from '@/components/complains/ComplaintForm';
import { ComplaintTable } from '@/components/complains/ComplaintTable';


export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [compRes, catRes] = await Promise.all([
        getMyComplaints(),
        getAllCategories()
      ]);
      
     if (compRes.success && compRes.data) {
        setComplaints(Array.isArray(compRes.data) ? compRes.data : (compRes.data.complaints || []));
      }
      if (catRes.success && catRes.data) {
        const catData = catRes.data as any;
        const categoriesArray = Array.isArray(catData) 
          ? catData 
          : (catData.categories || catData.data || []);
          setCategories(categoriesArray);
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">My Complaints</h1>
        <p className="text-gray-500 text-sm mt-1">
          Report civic issues and track their resolution progress.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 sticky top-24">
          <ComplaintForm categories={categories} onSuccess={fetchData} />
        </div>
        <div className="lg:col-span-2">
          <ComplaintTable complaints={complaints} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}