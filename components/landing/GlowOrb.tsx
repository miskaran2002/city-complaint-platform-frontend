'use client';

import React from 'react';

export const GlowOrb = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
      {/* Outer soft glow */}
      <div className="absolute w-[420px] h-[420px] rounded-full bg-[#7E22CE]/30 blur-[100px]" />

      {/* Rotating gradient ring */}
      <div
        className="absolute w-[340px] h-[340px] rounded-[40%_60%_55%_45%/45%_40%_60%_55%] opacity-90"
        style={{
          background: 'conic-gradient(from 0deg, #4C1D95, #C026D3, #7E22CE, #4C1D95)',
          animation: 'spin-slow 14s linear infinite',
        }}
      />

      {/* Inner chrome-like core */}
      <div
        className="absolute w-[260px] h-[260px] rounded-[45%_55%_60%_40%/55%_45%_40%_60%]"
        style={{
          background: 'radial-gradient(circle at 35% 30%, #F5F3FF 0%, #C4B5FD 25%, #6D28D9 65%, #1E1B4B 100%)',
          animation: 'spin-slow-reverse 18s linear infinite',
          boxShadow: '0 0 80px rgba(192, 38, 211, 0.4)',
        }}
      />

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
};