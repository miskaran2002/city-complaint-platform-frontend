// components/landing/GallerySection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function GallerySection() {
  // Bento Grid এর জন্য আইটেম ডাটাবেস
  const gridItems = [
    {
      title: "Citizen Dashboard",
      description: "A centralized hub to monitor your community reports.",
      colSpan: "md:col-span-2 lg:col-span-2",
      rowSpan: "row-span-1 md:row-span-2",
      gradient: "from-[#4C1D95]/40 to-[#1E1B4B]/80",
      content: (
        <div className="absolute right-0 bottom-0 w-3/4 h-3/4 bg-[#0A0515] rounded-tl-xl border-t border-l border-white/10 shadow-2xl p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div className="w-20 h-4 bg-white/10 rounded-full" />
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-[#C026D3]/20" />
            </div>
          </div>
          <div className="flex-1 bg-gradient-to-br from-purple-500/10 to-transparent rounded-lg border border-purple-500/20 mt-2" />
          <div className="flex gap-2 h-1/3">
             <div className="w-1/2 bg-blue-500/10 rounded-lg border border-blue-500/20" />
             <div className="w-1/2 bg-emerald-500/10 rounded-lg border border-emerald-500/20" />
          </div>
        </div>
      ),
    },
    {
      title: "Quick Complaint Form",
      description: "Report issues in 3 simple steps.",
      colSpan: "col-span-1",
      rowSpan: "row-span-1",
      gradient: "from-blue-900/40 to-[#030014]",
      content: (
         <div className="absolute top-12 left-6 right-6 bottom-0 bg-[#0A0515] rounded-t-xl border-t border-l border-r border-white/10 p-4 space-y-3">
           <div className="w-full h-8 bg-white/5 rounded-md" />
           <div className="w-full h-8 bg-white/5 rounded-md" />
           <div className="w-3/4 h-8 bg-white/5 rounded-md" />
           <div className="w-full h-10 mt-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded-md" />
         </div>
      ),
    },
    {
      title: "Real-time City View",
      description: "Monitor civic activities directly from the streets.",
      colSpan: "col-span-1",
      rowSpan: "row-span-2",
      gradient: "from-transparent to-transparent",
      bgImage: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=2070&auto=format&fit=crop", // Unsplash City Night
      content: null,
    },
    {
      title: "Secure Payments",
      description: "Pay for premium services via bKash or Stripe.",
      colSpan: "col-span-1 md:col-span-2 lg:col-span-1",
      rowSpan: "row-span-1",
      gradient: "from-[#C026D3]/30 to-[#030014]",
      content: (
        <div className="absolute right-[-20%] bottom-[-20%] w-[120%] h-[120%] flex items-center justify-center">
            <div className="w-32 h-48 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl rotate-12 flex flex-col justify-between p-4">
               <div className="w-6 h-6 rounded-full bg-pink-500/50" />
               <div className="space-y-2">
                 <div className="w-full h-2 bg-white/20 rounded" />
                 <div className="w-2/3 h-2 bg-white/20 rounded" />
               </div>
            </div>
            <div className="absolute w-32 h-48 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl shadow-2xl -rotate-6 z-10 p-4 flex flex-col justify-between border border-pink-400/50">
               <div className="text-white font-black text-xl italic tracking-tighter">bKash</div>
               <div className="text-white/80 text-xs font-mono">**** **** **** 1234</div>
            </div>
        </div>
      )
    },
    {
      title: "Admin Control",
      description: "Powerful tools for City Managers.",
      colSpan: "col-span-1 md:col-span-3 lg:col-span-2",
      rowSpan: "row-span-1",
      gradient: "from-emerald-900/30 to-[#030014]",
      content: (
         <div className="absolute inset-x-8 bottom-0 top-16 bg-[#0A0515] rounded-t-xl border-t border-x border-emerald-500/20 p-4 flex gap-4">
            <div className="w-1/4 h-full bg-white/5 rounded-lg" />
            <div className="w-3/4 h-full flex flex-col gap-4">
              <div className="w-full h-1/3 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-lg border border-emerald-500/20" />
              <div className="w-full flex-1 flex gap-4">
                <div className="w-1/2 h-full bg-white/5 rounded-lg" />
                <div className="w-1/2 h-full bg-white/5 rounded-lg" />
              </div>
            </div>
         </div>
      )
    }
  ];

  return (
    <section className="py-24 bg-[#030014] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="mb-16 text-center lg:text-left">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-4"
          >
            A Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#C026D3]">Built for Everyone</span>
          </motion.h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Everything you need to interact with your city administration, beautifully organized in one powerful portal.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]">
          {gridItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-3xl border border-white/10 group bg-[#0A0515] ${item.colSpan} ${item.rowSpan}`}
            >
              {/* Background Image (If provided) */}
              {item.bgImage && (
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-700 mix-blend-luminosity"
                  style={{ backgroundImage: `url(${item.bgImage})` }}
                />
              )}

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-50 group-hover:opacity-80 transition-opacity duration-500`} />
              
              {/* Abstract UI Content */}
              {item.content}

              {/* Text Content */}
              <div className="absolute top-0 left-0 p-6 z-20">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors drop-shadow-md">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-300 font-medium drop-shadow-md max-w-[80%]">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}