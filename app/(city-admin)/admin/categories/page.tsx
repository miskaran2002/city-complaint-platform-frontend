// app/(admin)/admin/categories/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Category } from '@/types/category';
import { Department } from '@/types/department';
import { getAllCategories, createCategory } from '@/services/category.service';
import { getAllDepartments } from '@/services/department.service';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

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

  // ডেটা ফেচ করার ফাংশন
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
        
        // শুধু ক্যাটাগরি লিস্ট রিফ্রেশ করা
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

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Service Categories</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage specific complaint categories under city departments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* ⬅️ Left Column: Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1 sticky top-24">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Add New Category</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">{error}</div>}
            {success && <div className="p-3 text-sm text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-100">{success}</div>}

            <Input
              label="Category Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Water Leakage"
              required
            />
            
            {/* Department Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Department <span className="text-red-500">*</span></label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C026D3] focus:border-[#C026D3] outline-none transition-all text-sm bg-white"
              >
                <option value="" disabled>-- Select a Department --</option>
                {isDeptLoading ? (
                  <option disabled>Loading departments...</option>
                ) : (
                  departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name} ({dept.code})</option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details about this category..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C026D3] focus:border-[#C026D3] outline-none transition-all resize-none text-sm"
              ></textarea>
            </div>

            <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>
              Create Category
            </Button>
          </form>
        </div>

        {/* ➡️ Right Column: Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-800">Category List</h2>
            <span className="px-3 py-1 bg-purple-100 text-[#7E22CE] rounded-full text-xs font-bold">
              Total: {categories.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <th className="p-4">Category Name</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-400">
                      <span className="w-8 h-8 border-4 border-[#7E22CE] border-t-transparent rounded-full animate-spin inline-block"></span>
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500 italic">
                      No categories found. Add one to get started.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-bold text-gray-800">{cat.name}</td>
                      <td className="p-4">
                        <span className="bg-purple-50 text-[#7E22CE] px-2.5 py-1 rounded-md text-xs font-bold border border-purple-100 whitespace-nowrap">
                          {cat.department?.name || 'Unknown Dept'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 truncate max-w-[200px]" title={cat.description || ''}>
                        {cat.description || '-'}
                      </td>
                      <td className="p-4 text-gray-500 whitespace-nowrap">
                        {new Date(cat.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}