// app/(admin)/admin/users/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { SystemUser, getAllUsers, updateUserRole } from '@/services/admin.service';
import { UserTable } from '@/components/admin/users/UserTable';
import { RoleUpdateModal } from '@/components/admin/users/RoleUpdateModal';

export default function UsersPage() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // ⚠️ fetchUsers এখন page নাম্বার গ্রহণ করবে
  const fetchUsers = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await getAllUsers(page); // ব্যাকএন্ড থেকে নির্দিষ্ট পেজের ডেটা আনা
      if (res.success && res.data) {
        const usersArray = Array.isArray(res.data) 
          ? res.data 
          : (res.data.users || res.data.data || []);
          
        setUsers(usersArray);
        
        // ব্যাকএন্ডের meta থেকে সঠিক টোটাল কাউন্ট এবং পেজ সেট করা
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

  // ⚠️ currentPage পরিবর্তন হলে নতুন ডেটা ফেচ হবে
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">System Users</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage all registered users and assign administrative or staff roles.
        </p>
      </div>

      {/* Users Data Table Component */}
      <UserTable
        users={users} // 👈 স্লাইস (slice) করা বাদ দিয়ে সরাসরি ব্যাকএন্ডের অ্যারে পাঠানো হলো
        totalUsers={totalUsersCount} // 👈 Total 25 দেখাবে[cite: 12]
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages} // 👈 ব্যাকএন্ডের হিসাব অনুযায়ী মোট পেজ দেখাবে (যেমন: ৩)
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