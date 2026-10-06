// components/landing/FeatureStackSection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function FeatureStackSection() {
  const features = [
    {
      id: "01",
      title: "Report Instantly",
      description: "Citizens can report civic issues anytime, anywhere. Snap a photo, drop a location pin, and submit your complaint directly to the Smart City network in seconds.",
      icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
      gradient: "from-[#1E1B4B] to-[#4C1D95]",
      border: "border-purple-500/30"
    },
    {
      id: "02",
      title: "Track in Real-Time",
      description: "No more guessing. Watch your report move from pending to resolved with live status timelines. Stay informed and connected at every single step of the process.",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      gradient: "from-[#4C1D95] to-[#7E22CE]",
      border: "border-fuchsia-500/30"
    },
    {
      id: "03",
      title: "Priority with bKash",
      description: "Need immediate emergency attention? Access premium routing and emergency services securely using our integrated bKash and Stripe payment gateways.",
      icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
      gradient: "from-[#7E22CE] to-[#C026D3]",
      border: "border-pink-500/30"
    },
    {
      id: "04",
      title: "Resolved by Experts",
      description: "Our AI-driven smart routing instantly assigns your issue to the exact right department and field technician, ensuring fast, expert, and permanent resolutions.",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      gradient: "from-[#1E1B4B] to-[#030014]",
      border: "border-blue-500/30"
    }
  ];

  return (
    <section className="relative bg-[#030014] py-24 md:py-32 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#C026D3]">Works</span>
          </h2>
          <p className="text-xl text-gray-400 font-medium">A seamless experience designed for the modern citizen.</p>
        </motion.div>

        {/* 🔴 Sticky Card Stack Container */}
        <div className="flex flex-col gap-6 pb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className={`sticky shadow-2xl rounded-[2rem] border ${feature.border} overflow-hidden`}
              style={{ 
                // 🔴 এই লাইনটির জন্যই কার্ডগুলো একটির ওপর আরেকটি স্ট্যাক হবে
                top: `calc(10vh + ${index * 40}px)`,
                zIndex: index + 10 
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-90`} />
              
              <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start md:items-center">
                
                {/* Icon & ID */}
                <div className="flex flex-col items-center justify-center shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
                  <span className="absolute top-2 right-3 text-white/20 font-black text-2xl italic">{feature.id}</span>
                  <svg className="w-10 h-10 md:w-14 md:h-14 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                  </svg>
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <h3 className="text-2xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-base md:text-lg text-purple-100/70 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}