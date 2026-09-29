'use client';

import React from 'react';
import { Department } from '@/types/department';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface CategoryFormProps {
  name: string;
  setName: (val: string) => void;
  departmentId: string;
  setDepartmentId: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  departments: Department[];
  isDeptLoading: boolean;
  isSubmitting: boolean;
  error: string;
  success: string;
  onSubmit: (e: React.FormEvent) => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  name,
  setName,
  departmentId,
  setDepartmentId,
  description,
  setDescription,
  departments,
  isDeptLoading,
  isSubmitting,
  error,
  success,
  onSubmit,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1 sticky top-24">
      <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Add New Category</h2>
      
      <form onSubmit={onSubmit} className="space-y-4">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Department <span className="text-red-500">*</span>
          </label>
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
  );
};