// components/Navbar.tsx
'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { useTheme } from 'next-themes'; // 🔴 Theme hook import করা হয়েছে

export const Navbar = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false); 
  
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state: any) => state.clearAuth);
  
  // 🔴 Theme state
  const { theme, setTheme } = useTheme();

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
      {/* 🔴 Dark mode support added to nav background and text */}
      <nav className="w-full max-w-5xl flex items-center justify-between gap-4 px-6 py-3 bg-card/90 dark:bg-[#0A0515]/90 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 dark:border-border text-gray-800 dark:text-gray-200 text-sm font-medium transition-colors duration-300">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C026D3] animate-pulse"></span>
          <Link href="/" className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-[#C026D3] dark:from-purple-400 dark:to-[#C026D3]">
            SmartCity.
          </Link>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1 font-semibold text-gray-600 dark:text-gray-300">
          <Link href="/" className="px-4 py-1.5 rounded-full hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Home</Link>
          <Link href="/departments" className="px-4 py-1.5 rounded-full hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Departments</Link>
          <Link href="/category" className="px-4 py-1.5 rounded-full hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Categories</Link>
          <Link href="/about" className="px-4 py-1.5 rounded-full hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">About Us</Link>
        </div>

        {/* Desktop Action Buttons & Theme Toggle */}
        <div className="hidden md:flex items-center space-x-3">
          
          {/* 🔴 Theme Toggle Button (Desktop) */}
          {isMounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-gray-100 dark:bg-card/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-card/20 transition-all focus:outline-none"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          )}

          {isMounted && user ? (
            <>
              <button 
                onClick={handleLogout} 
                className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-bold px-3 py-1.5 transition-colors cursor-pointer text-sm"
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
                <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-bold px-3 py-1.5 transition-colors text-sm">
                  Sign In
                </Link>
                <Link href="/sign-up" className="bg-gradient-to-r from-[#4C1D95] to-[#7E22CE] text-white px-5 py-2 rounded-full font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 text-sm">
                  Sign Up
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile Buttons (Theme + Hamburger) */}
        <div className="flex md:hidden items-center gap-2">
          {/* 🔴 Theme Toggle Button (Mobile) */}
          {isMounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-gray-100 dark:bg-card/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-card/20 transition-all focus:outline-none"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          )}

          {/* Hamburger Toggle Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors focus:outline-none"
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

      {/* Mobile Menu Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-20 inset-x-4 bg-card/95 dark:bg-[#0A0515]/95 backdrop-blur-xl border border-gray-100 dark:border-border rounded-3xl px-6 py-6 space-y-3 shadow-2xl md:hidden z-50 transition-colors duration-300">
          <Link 
            href="/" 
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/departments" 
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition-colors"
          >
            Departments
          </Link>
          <Link 
            href="/category" 
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition-colors"
          >
            Categories
          </Link>
          <Link 
            href="/about" 
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition-colors"
          >
            About Us
          </Link>

          <div className="pt-4 border-t border-gray-100 dark:border-border flex flex-col space-y-3">
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
                  className="text-center w-full text-red-600 dark:text-red-400 font-bold py-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
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
                    className="text-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-bold py-2"
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