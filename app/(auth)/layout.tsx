// app/(auth)/layout.tsx
'use client';

import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* 🟦 Left Partition - Professional Brand & CSS Visual Animation */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 flex-col justify-between items-center p-12 text-white relative overflow-hidden">
        
        {/* Background glowing abstract circles */}
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Branding */}
        <div className="relative z-10 w-full max-w-lg">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-md text-blue-100 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Smart Civic Portal
          </div>
        </div>

        {/* Center Content & Modern CSS Pulse Animation Graphic */}
        <div className="relative z-10 max-w-lg text-center space-y-8 my-auto">
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            {/* Outer glowing rings */}
            <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping"></div>
            <div className="absolute inset-4 rounded-full bg-blue-500/30 animate-pulse"></div>
            
            {/* Inner Core Icon / Badge */}
            <div className="relative z-20 w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
              Building Smarter Cities Together
            </h1>
            <p className="text-blue-100/90 text-base leading-relaxed max-w-md mx-auto">
              Report civic issues, track municipal requests in real-time, and collaborate with city authorities for a cleaner community.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-blue-200/60">
          &copy; 2026 Smart City Governance Platform. All rights reserved.
        </div>
      </div>

      {/* ⚪ Right Partition - Form Container (Login / Register) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50/50">
        <div className="w-full max-w-md">
          
          {/* Mobile Header */}
          <div className="text-center lg:hidden mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Smart City Portal</h2>
            <p className="text-gray-600 mt-2 text-sm">Citizen Complaint & Service Request Platform</p>
          </div>
          
          {/* Main Form Page Renders Here */}
          {children}
        </div>
      </div>

    </div>
  );
}