// components/Navbar.tsx
'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

export const Navbar = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state: any) => state.clearAuth);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    if (clearAuth) {
      clearAuth();
    } else {
      useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
    }
    localStorage.removeItem('city_auth_token');
    localStorage.removeItem('user');
    
    toast.success('Logout successful!'); 
    
    router.push('/login');
  };

  // 🔴 sidebar == main navbar
  const getDashboardLink = (role?: string) => {
    switch (role) {
      case 'CITIZEN': return '/citizen/dashboard';
      case 'TECHNICIAN': return '/technician/dashboard';
      case 'DEPARTMENT_STAFF': return '/staff/dashboard';
      case 'DEPARTMENT_MANAGER': return '/manager/dashboard';
      case 'CITY_ADMIN': return '/admin/dashboard';
      default: return '/dashboard';
    }
  };

  const dashboardLink = getDashboardLink(user?.role);

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-[#C026D3]">
              SmartCity.
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-gray-600 hover:text-purple-600 font-semibold transition-colors">Home</Link>
            <Link href="/departments" className="text-gray-600 hover:text-purple-600 font-semibold transition-colors">Departments</Link>
            <Link href="/about" className="text-gray-600 hover:text-purple-600 font-semibold transition-colors">About Us</Link>
            <Link href="/category" className="text-gray-600 hover:text-purple-600 font-semibold transition-colors">Categories</Link>
          </div>

          <div className="flex items-center space-x-4">
            {isMounted && user ? (
              <>
                <button 
                  onClick={handleLogout} 
                  className="hidden sm:block text-gray-700 hover:text-red-500 font-bold transition-colors cursor-pointer"
                >
                  Logout
                </button>
                <Link 
                  href={dashboardLink} 
                  className="bg-gradient-to-r from-[#4C1D95] to-[#7E22CE] text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              isMounted && (
                <>
                  <Link href="/login" className="hidden sm:block text-gray-700 hover:text-purple-600 font-bold transition-colors">
                    Sign In
                  </Link>
                  <span className="hidden sm:block text-gray-300">|</span>
                  <Link href="/sign-up" className="bg-gradient-to-r from-[#4C1D95] to-[#7E22CE] text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                    Sign Up
                  </Link>
                </>
              )
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
};