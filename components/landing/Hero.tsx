'use client';

import React from 'react';
import Link from 'next/link';
import { GlowOrb } from './GlowOrb';

export const Hero = () => {
  return (
    <section className="relative min-h-screen bg-[#0D0A1F] overflow-hidden flex items-center">
      {/* Ambient background wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(76,29,149,0.35),transparent_55%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(192,38,211,0.25),transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20 grid md:grid-cols-2 gap-12 items-center w-full">
        {/* Left: Copy */}
        <div className="space-y-7">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-[1.05] tracking-tight">
            Your city,
            <br />
            your voice.
          </h1>

          <p className="text-purple-200/70 text-lg max-w-md leading-relaxed">
            Report a broken streetlight, a pothole, or a water leak in seconds.
            Track it from submission to resolution — no phone calls, no paperwork.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <Link
              href="/register"
              className="bg-gradient-to-r from-[#4C1D95] to-[#C026D3] text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-purple-900/40 hover:shadow-purple-700/50 hover:-translate-y-0.5 transition-all"
            >
              Report an Issue
            </Link>
            <Link
              href="#how-it-works"
              className="text-purple-200 hover:text-white font-medium px-4 py-3.5 transition-colors"
            >
              See how it works
            </Link>
          </div>
        </div>

        {/* Right: Glow Orb */}
        <div className="relative h-[420px] md:h-[520px]">
          <GlowOrb />
        </div>
      </div>
    </section>
  );
};