'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation'; 

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter(); 

  // Handle logout function
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-8 text-black">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4">Welcome to Dashboard</h1>
          
          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> <span className="uppercase text-blue-600 font-bold">{user?.role}</span></p>
          </div>

          <button 
            onClick={handleLogout} // এখানে ফাংশনটি কল করুন
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}