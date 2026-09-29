'use client';

import React from 'react';
import { Department } from '@/types/department';

interface DepartmentTableProps {
  departments: Department[];
  isLoading: boolean;
}

export const DepartmentTable: React.FC<DepartmentTableProps> = ({ departments, isLoading }) => {
  return (
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
  );
};