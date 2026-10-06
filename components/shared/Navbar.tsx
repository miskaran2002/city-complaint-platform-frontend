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
  const [isOpen, setIsOpen] = useState(false); 
  
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
    <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
      <nav className="w-full max-w-5xl flex items-center justify-between gap-4 px-6 py-3 bg-white/90 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 text-gray-800 text-sm font-medium">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C026D3] animate-pulse"></span>
          <Link href="/" className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-[#C026D3]">
            SmartCity.
          </Link>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1 font-semibold text-gray-600">
          <Link href="/" className="px-4 py-1.5 rounded-full hover:bg-purple-50 hover:text-purple-600 transition-colors">Home</Link>
          <Link href="/departments" className="px-4 py-1.5 rounded-full hover:bg-purple-50 hover:text-purple-600 transition-colors">Departments</Link>
          <Link href="/category" className="px-4 py-1.5 rounded-full hover:bg-purple-50 hover:text-purple-600 transition-colors">Categories</Link>
          <Link href="/about" className="px-4 py-1.5 rounded-full hover:bg-purple-50 hover:text-purple-600 transition-colors">About Us</Link>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {isMounted && user ? (
            <>
              <button 
                onClick={handleLogout} 
                className="text-gray-700 hover:text-red-500 font-bold px-3 py-1.5 transition-colors cursor-pointer text-sm"
              >
                Logout
              </button>
              <Link 
                href={dashboardLink} 
                className="bg-gradient-to-r from-[#4C1D95] to-[#7E22CE] text-white px-5 py-2 rounded-full font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 text-sm"
              >
                Dashboard
              </Link>
            </>
          ) : (
            isMounted && (
              <>
                <Link href="/login" className="text-gray-700 hover:text-purple-600 font-bold px-3 py-1.5 transition-colors text-sm">
                  Sign In
                </Link>
                <Link href="/sign-up" className="bg-gradient-to-r from-[#4C1D95] to-[#7E22CE] text-white px-5 py-2 rounded-full font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 text-sm">
                  Sign Up
                </Link>
              </>
            )
          )}
        </div>

        {/* 🔴 Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
      </nav>

      {/* 🔴 Mobile Menu Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-20 inset-x-4 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-3xl px-6 py-6 space-y-3 shadow-2xl md:hidden z-50">
          <Link 
            href="/" 
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-600 font-semibold transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/departments" 
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-600 font-semibold transition-colors"
          >
            Departments
          </Link>
          <Link 
            href="/category" 
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-600 font-semibold transition-colors"
          >
            Categories
          </Link>
          <Link 
            href="/about" 
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-600 font-semibold transition-colors"
          >
            About Us
          </Link>

          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
            {isMounted && user ? (
              <>
                <Link 
                  href={dashboardLink} 
                  onClick={() => setIsOpen(false)}
                  className="text-center bg-gradient-to-r from-[#4C1D95] to-[#7E22CE] text-white px-6 py-2.5 rounded-full font-bold shadow-md"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="text-center w-full text-red-600 font-bold py-2 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              isMounted && (
                <>
                  <Link 
                    href="/login" 
                    onClick={() => setIsOpen(false)}
                    className="text-center text-gray-700 hover:text-purple-600 font-bold py-2"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/sign-up" 
                    onClick={() => setIsOpen(false)}
                    className="text-center bg-gradient-to-r from-[#4C1D95] to-[#7E22CE] text-white px-6 py-2.5 rounded-full font-bold shadow-md"
                  >
                    Sign Up
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
};