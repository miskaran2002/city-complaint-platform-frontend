// components/landing/ShowcaseSection.tsx
'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ShowcaseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll tracking for parallax effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Background image slowly zooms in as you scroll down
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  
  // Text moves at a different speed (parallax)
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-[70vh] md:h-[90vh] w-full overflow-hidden flex items-center justify-center bg-[#030014]"
    >
      {/* 🔴 Background Image with Parallax Scale */}
      <motion.div
        style={{ scale: scaleImage }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Dark overlay to make text readable */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        
        {/* Gradient fades at top and bottom to blend with other sections */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-[#030014] z-10" />
        
        {/* Unsplash Real City Street/Skyline Photo */}
        <img
          src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop"
          alt="Smart City Skyline"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* 🔴 Text Content with Parallax Y-Axis Movement */}
      <motion.div
        style={{ y: yText }}
        className="relative z-20 flex flex-col items-center justify-center text-center px-4"
      >
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-purple-300 uppercase tracking-[0.3em] md:tracking-[0.5em] text-xs md:text-sm font-bold mb-4 md:mb-6"
        >
          smartcity · 2026 · Civic · Platform
        </motion.p>
        
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-[18vw] md:text-[14vw] leading-none font-black text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
        >
          Resolve.
        </motion.h2>
      </motion.div>
    </section>
  );
}