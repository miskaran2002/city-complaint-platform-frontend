'use client';

import React from 'react';
import { Category } from '@/types/category';

interface CategoryTableProps {
  categories: Category[];
  isLoading: boolean;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({ categories, isLoading }) => {
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-background/50">
        <h2 className="text-lg font-bold text-gray-800">Category List</h2>
        <span className="px-3 py-1 bg-purple-100 text-[#7E22CE] rounded-full text-xs font-bold">
          Total: {categories.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
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
                <tr key={cat.id} className="hover:bg-background/50 transition-colors">
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
  );
};