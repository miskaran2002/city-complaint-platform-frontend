'use client';

import React from 'react';

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
      
      {/* Mobile Menu Button (Hamburger) */}
      <div className="flex items-center lg:hidden">
        <button className="text-gray-500 hover:text-[#7E22CE] focus:outline-none transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Page Title (Hidden on mobile) */}
      <div className="hidden lg:block text-gray-700 font-bold text-lg">
        Dashboard
      </div>

      {/* Right side - Profile & Notifications */}
      <div className="flex items-center gap-5 ml-auto">
        
        {/* Notification Bell */}
        <button className="text-gray-400 hover:text-[#7E22CE] transition-colors relative">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-0 right-1 block h-2.5 w-2.5 rounded-full bg-[#C026D3] ring-2 ring-white"></span>
        </button>

        {/* Profile Avatar Dropdown Placeholder */}
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#4C1D95] to-[#7E22CE] flex items-center justify-center text-white font-bold cursor-pointer shadow-md hover:shadow-lg transition-all">
          U
        </div>
      </div>
    </header>
  );
}