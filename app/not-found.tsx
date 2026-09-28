// app/not-found.tsx
'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E1B4B] via-[#2E1065] to-[#581c87] flex items-center justify-center px-6 relative overflow-hidden text-white">
      
      {/* Background Decorative Glowing Animation */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#C026D3]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="max-w-xl w-full text-center relative z-10 space-y-8">
        
        {/* Animated 404 Graphic */}
        <div className="relative flex justify-center items-center">
          <div className="absolute text-[130px] md:text-[190px] font-black text-purple-900/40 select-none animate-bounce">
            404
          </div>
          <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl">
            <svg className="w-20 h-20 md:w-28 md:h-28 mx-auto text-[#C026D3] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Heading & Description */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Oops! Lost in the Smart City
          </h1>
          <p className="text-purple-200 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            The district or page you are looking for doesn’t exist or has been relocated to another sector.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto bg-[#C026D3] hover:bg-[#a21caf] text-white px-8 py-3.5 rounded-xl font-bold shadow-[0_0_20px_rgba(192,38,211,0.5)] hover:shadow-[0_0_25px_rgba(192,38,211,0.8)] transition-all duration-300 transform hover:-translate-y-0.5 text-center"
          >
            🏠 Return Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-purple-100 border border-white/20 px-8 py-3.5 rounded-xl font-bold backdrop-blur-sm transition-all duration-300"
          >
            ⬅️ Go Back
          </button>
        </div>

        {/* Footer Brand Tag */}
        <div className="pt-6 text-xs text-purple-300/60 uppercase tracking-widest font-semibold">
          Smart City Management System
        </div>

      </div>
    </div>
  );
}