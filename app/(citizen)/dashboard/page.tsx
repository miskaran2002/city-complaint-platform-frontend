'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types/user';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <ProtectedRoute allowedRoles={[UserRole.CITIZEN]}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-800">Welcome to Citizen Dashboard</h1>
          <p className="mt-2 text-gray-600">Hello, {user?.name}! Your sign-in was successful.</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}