'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface DepartmentFormProps {
  name: string;
  setName: (val: string) => void;
  code: string;
  setCode: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  // 🔴 image url
  imageUrl: string;
  setImageUrl: (val: string) => void;
  isSubmitting: boolean;
  error: string;
  success: string;
  onSubmit: (e: React.FormEvent) => void;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({
  name,
  setName,
  code,
  setCode,
  description,
  setDescription,
  imageUrl, 
  setImageUrl, 
  isSubmitting,
  error,
  success,
  onSubmit,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1 sticky top-24">
      <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Add New Department</h2>
      
      <form onSubmit={onSubmit} className="space-y-4">
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

        {/* 🔴 Image URL add field */}
        <Input
          label="Image URL (Optional)"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://images.unsplash.com/..."
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
  );
};