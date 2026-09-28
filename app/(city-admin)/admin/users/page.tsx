// app/(admin)/admin/users/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { SystemUser, getAllUsers, updateUserRole } from '@/services/admin.service';
import { Button } from '@/components/ui/Button';

export default function UsersPage() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await getAllUsers();
      if (res.success && res.data) {
        
        const usersArray = Array.isArray(res.data) 
          ? res.data 
          : (res.data.users || res.data.data || []);
          
        setUsers(usersArray);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenEditModal = (user: SystemUser) => {
    setEditingUser(user);
    setSelectedRole(user.role);
    setMessage({ type: '', text: '' });
  };

  const handleUpdateRole = async () => {
    if (!editingUser) return;
    
    setIsUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await updateUserRole(editingUser.id, selectedRole as 'CITIZEN' | 'DEPARTMENT_STAFF' | 'TECHNICIAN' | 'DEPARTMENT_MANAGER' | 'CITY_ADMIN');
      if (res.success) {
        setMessage({ type: 'success', text: 'User role updated successfully!' });
        // update the local state to reflect the change without refetching
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, role: selectedRole as 'CITIZEN' | 'DEPARTMENT_STAFF' | 'TECHNICIAN' | 'DEPARTMENT_MANAGER' | 'CITY_ADMIN' } : u));
        
        // 1.5 seconds por modal close korar jonno
        setTimeout(() => setEditingUser(null), 1500);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to update role.' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">System Users</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage all registered users and assign administrative or staff roles.
        </p>
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">All Registered Users</h2>
          <span className="px-3 py-1 bg-purple-100 text-[#7E22CE] rounded-full text-xs font-bold">
            Total: {users.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
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
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{user.name}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{user.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                        user.role === 'CITY_ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        user.role.includes('MANAGER') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        user.role === 'CITIZEN' ? 'bg-gray-50 text-gray-600 border-gray-200' :
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
                        onClick={() => handleOpenEditModal(user)}
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
      </div>

      {/* Role Update Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="bg-[#1E1B4B] p-5">
              <h3 className="text-xl font-bold text-white">Update User Role</h3>
              <p className="text-purple-200 text-xs mt-1">Assigning a new role to {editingUser.name}</p>
            </div>
            
            <div className="p-6 space-y-5">
              {message.text && (
                <div className={`p-3 text-sm rounded-lg border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                  {message.text}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select New Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C026D3] focus:border-[#C026D3] outline-none transition-all text-sm font-medium bg-gray-50"
                >
                  <option value="CITIZEN">Citizen</option>
                  <option value="DEPARTMENT_STAFF">Department Staff</option>
                  <option value="TECHNICIAN">Technician</option>
                  <option value="DEPARTMENT_MANAGER">Department Manager</option>
                  <option value="CITY_ADMIN">City Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  type="button" 
                  onClick={handleUpdateRole} 
                  isLoading={isUpdating}
                  className="flex-1 bg-[#C026D3] hover:bg-[#a21caf]"
                >
                  Save Changes
                </Button>
                <button 
                  onClick={() => setEditingUser(null)}
                  disabled={isUpdating}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}