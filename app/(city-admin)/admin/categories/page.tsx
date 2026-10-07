'use client';

import React, { useState, useEffect } from 'react';
import { Category } from '@/types/category';
import { Department } from '@/types/department';
import { getAllCategories, createCategory } from '@/services/category.service';
import { getAllDepartments } from '@/services/department.service';
import { CategoryForm } from '@/components/admin/categories/CategoryForm';
import { CategoryTable } from '@/components/admin/categories/CategoryTable';
// ১. ⚠️ Global Loading import
import GlobalLoading from '@/app/loading'; 

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isDeptLoading, setIsDeptLoading] = useState(true);
  
  // Form States
  const [name, setName] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [description, setDescription] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch categories and departments on component mount
  const fetchData = async () => {
    setIsLoading(true);
    setIsDeptLoading(true);
    try {
      const [catRes, deptRes] = await Promise.all([
        getAllCategories(),
        getAllDepartments()
      ]);
      
      if (catRes.success && catRes.data) setCategories(catRes.data);
      if (deptRes.success && deptRes.data) setDepartments(deptRes.data);
    } catch (err: any) {
      console.error('Failed to fetch data', err);
    } finally {
      setIsLoading(false);
      setIsDeptLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentId) {
      setError('Please select a department.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await createCategory({ name, departmentId, description });
      if (res.success) {
        setSuccess('Category created successfully!');
        setName('');
        setDepartmentId('');
        setDescription('');
        
        // Fetch the updated categories list after successful creation
        const updatedCatRes = await getAllCategories();
        if (updatedCatRes.success) setCategories(updatedCatRes.data);
        
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ২. ⚠️ ডেটা লোড হওয়ার সময় গ্লোবাল স্কেলিটন দেখানো হবে
  if (isLoading) {
    return <GlobalLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground">Service Categories</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage specific complaint categories under city departments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ⬅️ Left Column: Form Component */}
        <CategoryForm
          name={name}
          setName={setName}
          departmentId={departmentId}
          setDepartmentId={setDepartmentId}
          description={description}
          setDescription={setDescription}
          departments={departments}
          isDeptLoading={isDeptLoading}
          isSubmitting={isSubmitting}
          error={error}
          success={success}
          onSubmit={handleSubmit}
        />

        {/* ➡️ Right Column: Table Component */}
        <CategoryTable 
          categories={categories} 
          // এখানে isLoading false হবে সবসময়, কারণ গ্লোবাল লোডিং আগেই চেক করা হয়েছে। 
          // তবুও প্রপস হিসেবে পাঠিয়ে রাখলাম।
          isLoading={false} 
        />
      </div>
    </div>
  );
}