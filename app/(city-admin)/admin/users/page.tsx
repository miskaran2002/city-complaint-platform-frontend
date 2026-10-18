// app/(admin)/admin/users/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { SystemUser, getAllUsers, updateUserRole } from '@/services/admin.service';
import { UserTable } from '@/components/admin/users/UserTable';
import { RoleUpdateModal } from '@/components/admin/users/RoleUpdateModal';
import GlobalLoading from '@/app/loading';

export default function UsersPage() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchUsers = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await getAllUsers(page); 
      if (res.success && res.data) {
        const usersArray = Array.isArray(res.data) 
          ? res.data 
          : (res.data.users || res.data.data || []);
          
        setUsers(usersArray);
        
        const meta = res.data.meta || res.meta;
        if (meta) {
          setTotalUsersCount(meta.total || 25);
          setTotalPages(meta.totalPages || Math.ceil(meta.total / meta.limit));
        } else {
          setTotalUsersCount(usersArray.length);
        }
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // 🎯 Search Filtering Logic
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    
    const query = searchQuery.toLowerCase();
    return users.filter((user) => 
      user.name?.toLowerCase().includes(query) || 
      user.email?.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

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
      const res = await updateUserRole(
        editingUser.id, 
        selectedRole as any
      );
      if (res.success) {
        setMessage({ type: 'success', text: 'User role updated successfully!' });
        
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, role: selectedRole as any } : u));
        setTimeout(() => setEditingUser(null), 1500);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to update role.' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <GlobalLoading />;
  }

  return (
    <div className="space-y-6">
      
      {/* 🎯 Page Header & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">System Users</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all registered users and assign administrative or staff roles.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl focus:ring-2 focus:ring-[#C026D3] outline-none text-sm text-foreground transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Users Data Table Component */}
      <UserTable
        users={filteredUsers} // 👈 Updated to use filtered data
        totalUsers={searchQuery ? filteredUsers.length : totalUsersCount} 
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages} 
        onPageChange={(page) => setCurrentPage(page)}
        onOpenEditModal={handleOpenEditModal}
      />

      {/* Role Update Modal Component */}
      <RoleUpdateModal
        editingUser={editingUser}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        isUpdating={isUpdating}
        message={message}
        onUpdateRole={handleUpdateRole}
        onClose={() => setEditingUser(null)}
      />
    </div>
  );
}