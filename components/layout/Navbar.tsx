// components/layout/Navbar.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useTheme } from 'next-themes'; // 🔴 Theme hook import করা হয়েছে

export default function Navbar() {
  // Zustand store
  const user = useAuthStore((state) => state.user);
  
  // 🔴 Theme state
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-white dark:bg-[#0A0515] border-b border-gray-200 dark:border-white/10 h-16 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0 shadow-sm transition-colors duration-300">
      
      {/* Mobile Menu Button (Hamburger) -only on mobile */}
      <div className="flex items-center lg:hidden">
        <button className="text-gray-500 dark:text-gray-400 hover:text-[#7E22CE] dark:hover:text-[#C026D3] focus:outline-none transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Page Title (Hidden on mobile) */}
      <div className="hidden lg:block text-gray-700 dark:text-gray-200 font-bold text-lg">
        Dashboard Overview
      </div>

      {/* Right side - Profile & Notifications */}
      <div className="flex items-center gap-4 md:gap-6 ml-auto">
        
        {/* 🔴 Theme Toggle Button */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-all focus:outline-none"
            aria-label="Toggle Theme"
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

        {/* Notification Bell */}
        <button className="text-gray-400 dark:text-gray-400 hover:text-[#7E22CE] dark:hover:text-[#C026D3] transition-colors relative group p-1">
          <svg className="w-6 h-6 group-hover:animate-swing" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-[#C026D3] ring-2 ring-white dark:ring-[#0A0515]"></span>
        </button>

        {/* User Info & Avatar */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
              {user?.name || 'Guest User'}
            </p>
            <p className="text-xs font-semibold text-[#7E22CE] dark:text-[#C026D3] uppercase tracking-wider">
              {user?.role?.replace('_', ' ') || 'User'}
            </p>
          </div>
          
          {/* Avatar (Civic Plum Gradient) */}
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#1E1B4B] to-[#7E22CE] flex items-center justify-center text-white font-bold cursor-pointer shadow-md hover:shadow-lg hover:scale-105 transition-all border-2 border-white dark:border-white/20">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
        
      </div>
    </header>
  );
}