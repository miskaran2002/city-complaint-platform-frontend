// components/landing/HeroSection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  // Unsplash theke smart city ebong civic images er ekta list
  const carouselImages = [
    {
      title: "Smart Traffic",
      image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "City Skyline",
      image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Digital Infrastructure",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Urban Planning",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Civic Services",
      image: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#030014] overflow-hidden flex flex-col justify-center pt-24 pb-16">
      
      {/* 🔴 Background Running Text (Marquee) */}
      <div className="absolute top-28 w-full overflow-hidden whitespace-nowrap opacity-10 pointer-events-none select-none">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex gap-10 text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-purple-600"
        >
          <span>SMART BARISHAL • CIVIC PORTAL • REPORT • TRACK • RESOLVE •</span>
          <span>SMART BARISHAL • CIVIC PORTAL • REPORT • TRACK • RESOLVE •</span>
        </motion.div>
      </div>

      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#4C1D95]/30 blur-[140px] pointer-events-none" />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 z-10 w-full mb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6"
        >
          Your City, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-[#C026D3] to-purple-600">
            Your Voice
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-medium"
        >
          Report civic issues, track resolutions, and build a better city — together.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#4C1D95] to-[#C026D3] text-white font-bold text-lg shadow-[0_0_20px_rgba(192,38,211,0.3)] hover:shadow-[0_0_35px_rgba(192,38,211,0.6)] transition-all duration-300 hover:-translate-y-1 text-center"
          >
            Get Started
          </Link>
          <Link
            href="/category"
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 font-bold text-lg backdrop-blur-md hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 text-center"
          >
            Report an Issue
          </Link>
        </motion.div>
      </div>

      {/* 🔴 3D Infinite Moving Card Carousel with Center Focus */}
      <div className="relative w-full overflow-hidden py-10">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-6 w-max px-4"
        >
          {/* Duplicate array to make seamless infinite loop */}
          {[...carouselImages, ...carouselImages, ...carouselImages].map((item, index) => (
            <div
              key={index}
              className="relative w-64 md:w-80 h-48 md:h-60 rounded-2xl overflow-hidden border border-border shadow-2xl group flex-shrink-0 bg-[#0A0515]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                <span className="text-white font-bold text-lg md:text-xl tracking-wide drop-shadow-md">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

    </div>
  );
}