// components/admin/users/UserTable.tsx
'use client';

import React from 'react';
import { SystemUser } from '@/services/admin.service';

interface UserTableProps {
  users: SystemUser[];
  totalUsers: number; // 👈 Asol total count
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onOpenEditModal: (user: SystemUser) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  totalUsers,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onOpenEditModal,
}) => {
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-background/50">
        <h2 className="text-lg font-bold text-gray-800">All Registered Users</h2>
        <span className="px-3 py-1 bg-purple-100 text-[#7E22CE] rounded-full text-xs font-bold">
          Total: {totalUsers} {/* 👈 Ekhane total 18 show korbe */}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
              <th className="p-4">Name & Email</th>
              <th className="p-4">Current Role</th>
              <th className="p-4">Joined Date</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400">
                  <span className="w-8 h-8 border-4 border-[#7E22CE] border-t-transparent rounded-full animate-spin inline-block"></span>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500 italic">No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-background/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{user.name}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{user.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                      user.role === 'CITY_ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      user.role.includes('MANAGER') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      user.role === 'CITIZEN' ? 'bg-background text-gray-600 border-gray-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => onOpenEditModal(user)}
                      className="text-[#C026D3] hover:text-[#7E22CE] font-semibold text-sm bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Change Role
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {!isLoading && totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-background/50">
          <span className="text-xs text-gray-500 font-medium">
            Page <span className="font-bold text-gray-800">{currentPage}</span> of <span className="font-bold text-gray-800">{totalPages}</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-card border border-gray-200 text-gray-700 hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-card border border-gray-200 text-gray-700 hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};