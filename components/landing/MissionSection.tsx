// components/landing/MissionSection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function MissionSection() {
  // পার্টিকলগুলো তৈরি করার জন্য একটি ডামি অ্যারে
  const particles = Array.from({ length: 24 });

  return (
    <section className="relative min-h-screen bg-[#030014] overflow-hidden flex flex-col items-center justify-center py-24 border-t border-white/5">
      
      {/* 🔴 Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C026D3]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 🔴 Visual: Particle Sphere (Civic Engine) */}
      <div className="relative w-72 h-72 md:w-[450px] md:h-[450px] mb-16 flex items-center justify-center">
        
        {/* Core Engine Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#4C1D95]/40 to-[#C026D3]/40 blur-3xl" />

        {/* Outer Rotating Dashed Rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-[2px] border-dashed border-purple-500/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute inset-6 border border-dashed border-[#C026D3]/30 rounded-full"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-12 border-[2px] border-dotted border-purple-300/20 rounded-full"
        />

        {/* Orbiting Particles */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          {particles.map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-purple-300 rounded-full shadow-[0_0_10px_#C026D3]"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${(360 / particles.length) * i}deg) translateY(-140px) md:translateY(-200px)`,
                opacity: i % 2 === 0 ? 0.8 : 0.3, // কিছু পার্টিকল উজ্জ্বল, কিছু হালকা
              }}
            />
          ))}
        </motion.div>

        {/* Inner Core Sphere */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#E879F9] to-[#4C1D95] shadow-[0_0_60px_#C026D3] flex items-center justify-center overflow-hidden border border-white/20"
        >
           {/* Core inner highlight */}
          <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-white/20 backdrop-blur-md rounded-full" />
          <span className="relative z-10 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-[0_0_20px_white] animate-pulse" />
        </motion.div>
      </div>

      {/* 🔴 Typography Content (Scroll Animations) */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }} // স্ক্রল করে কাছে আসলেই অ্যানিমেট হবে
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-8"
        >
          Beyond Bureaucracy
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-400 leading-relaxed font-medium"
        >
          Smart City is a civic engine that turns complaints into action — routing issues to the right department, tracking every status change, and keeping citizens informed. <span className="text-purple-300">One platform, every borough, no limits.</span>
        </motion.p>
      </div>
    </section>
  );
}