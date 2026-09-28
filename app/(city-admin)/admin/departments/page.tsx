// app/(admin)/admin/departments/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Department } from '@/types/department';
import { getAllDepartments, createDepartment } from '@/services/department.service';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form States
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const res = await getAllDepartments();
      if (res.success && res.data) {
        setDepartments(res.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch departments', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await createDepartment({ name, code, description });
      if (res.success) {
        setSuccess('Department created successfully!');
        setName('');
        setCode('');
        setDescription('');
        fetchDepartments(); // নতুন ডেটা টেবিলে দেখানোর জন্য রিলোড
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create department.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Departments</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage city departments and their service categories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* ⬅️ Left Column: Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1 sticky top-24">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Add New Department</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">{error}</div>}
            {success && <div className="p-3 text-sm text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-100">{success}</div>}

            <Input
              label="Department Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Water & Sanitation"
              required
            />
            
            <Input
              label="Department Code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. WASA-01"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the department..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C026D3] focus:border-[#C026D3] outline-none transition-all resize-none text-sm"
              ></textarea>
            </div>

            <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>
              Create Department
            </Button>
          </form>
        </div>

        {/* ➡️ Right Column: Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-800">Department List</h2>
            <span className="px-3 py-1 bg-purple-100 text-[#7E22CE] rounded-full text-xs font-bold">
              Total: {departments.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <th className="p-4">Name</th>
                  <th className="p-4">Code</th>
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
                ) : departments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500 italic">
                      No departments found. Add one to get started.
                    </td>
                  </tr>
                ) : (
                  departments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-bold text-gray-800">{dept.name}</td>
                      <td className="p-4">
                        <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-mono text-xs font-medium border border-gray-200">
                          {dept.code}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 truncate max-w-[200px]" title={dept.description || ''}>
                        {dept.description || '-'}
                      </td>
                      <td className="p-4 text-gray-500 whitespace-nowrap">
                        {new Date(dept.createdAt).toLocaleDateString()}
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