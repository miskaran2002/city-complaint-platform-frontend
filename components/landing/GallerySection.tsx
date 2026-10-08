// components/landing/GallerySection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

const IMAGES = {
  cityView: {
    src: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=1600&auto=format&fit=crop',
    alt: 'City street at night',
  },
  skyline: {
    src: 'https://plus.unsplash.com/premium_photo-1669927131902-a64115445f0f?q=80&w=875&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'City skyline',
  },
  civic: {
    src: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?q=80&w=1600&auto=format&fit=crop',
    alt: 'Civic services',
  },
};

type Item = {
  title: string;
  description: string;
  span: string;
  image?: { src: string; alt: string };
  badge?: string;
  content?: React.ReactNode;
};

const Pill = ({ children, tone }: { children: React.ReactNode; tone: 'purple' | 'fuchsia' | 'white' }) => {
  const tones = {
    purple: 'bg-purple-500/20 text-purple-700 dark:text-purple-200 border-purple-400/30',
    fuchsia: 'bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-200 border-fuchsia-400/30',
    white: 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white/70 border-gray-300 dark:border-white/15',
  };
  return <span className={`px-2.5 py-1 rounded-full text-[11px] border font-medium ${tones[tone]}`}>{children}</span>;
};

const items: Item[] = [
  {
    title: 'Citizen Dashboard',
    description: 'One place to follow every report you have filed.',
    span: 'md:col-span-2 lg:col-span-2 lg:row-span-2',
    content: (
      <div className="absolute right-0 bottom-0 w-[82%] h-[68%] bg-background rounded-tl-2xl border-t border-l border-border shadow-2xl p-5 flex flex-col gap-3">
        <div className="flex justify-between items-center border-b border-border pb-3">
          <div className="w-24 h-3 bg-purple-200 dark:bg-white/15 rounded-full" />
          <div className="w-7 h-7 rounded-full bg-fuchsia-500/30" />
        </div>
        {[
          { t: 'Broken street light', s: 'In progress', tone: 'purple' as const },
          { t: 'Water leakage', s: 'Resolved', tone: 'fuchsia' as const },
          { t: 'Garbage collection', s: 'Received', tone: 'white' as const },
        ].map((r) => (
          <div key={r.t} className="flex items-center justify-between rounded-xl bg-card border border-border px-4 py-3">
            <span className="text-sm font-medium text-foreground">{r.t}</span>
            <Pill tone={r.tone}>{r.s}</Pill>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Quick Complaint Form',
    description: 'Report an issue in three simple steps.',
    span: 'lg:col-span-1',
    content: (
      <div className="absolute top-24 left-6 right-6 bottom-0 bg-background rounded-t-xl border-t border-x border-border p-4 space-y-3">
        <div className="w-full h-7 bg-purple-100 dark:bg-white/[0.06] rounded-md" />
        <div className="w-full h-7 bg-purple-100 dark:bg-white/[0.06] rounded-md" />
        <div className="w-3/4 h-7 bg-purple-100 dark:bg-white/[0.06] rounded-md" />
        <div className="w-full h-9 bg-gradient-to-r from-[#4C1D95] to-[#C026D3] rounded-md" />
      </div>
    ),
  },
  {
    title: 'Real-time City View',
    description: 'See what is happening on the streets right now.',
    span: 'lg:col-span-1 lg:row-span-2',
    image: IMAGES.cityView,
    badge: 'Live',
  },
  {
    title: 'Secure Payments',
    description: 'Pay for premium services with bKash or Stripe.',
    span: 'lg:col-span-1',
    content: (
      <div className="absolute right-[-12%] bottom-[-18%] w-[110%] h-[110%] flex items-center justify-center">
        <div className="w-28 h-40 bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl rotate-12" />
        <div className="absolute w-28 h-40 bg-gradient-to-br from-[#C026D3] to-[#4C1D95] rounded-2xl shadow-2xl -rotate-6 z-10 p-4 flex flex-col justify-between border border-fuchsia-300/40">
          <div className="text-white font-black text-lg italic tracking-tighter">bKash</div>
          <div className="text-white/80 text-[10px] font-mono">**** 1234</div>
        </div>
      </div>
    ),
  },
  {
    title: 'Admin Control',
    description: 'Powerful tools for city managers and departments.',
    span: 'md:col-span-2 lg:col-span-2',
    content: (
      <div className="absolute inset-x-8 bottom-0 top-24 bg-background rounded-t-xl border-t border-x border-border p-4 flex gap-4">
        <div className="w-1/4 h-full bg-purple-100 dark:bg-white/[0.05] rounded-lg" />
        <div className="w-3/4 h-full flex flex-col gap-4">
          <div className="w-full h-1/3 bg-gradient-to-r from-purple-500/20 to-transparent rounded-lg border border-purple-400/20" />
          <div className="w-full flex-1 flex gap-4">
            <div className="w-1/2 h-full bg-purple-100 dark:bg-white/[0.05] rounded-lg" />
            <div className="w-1/2 h-full bg-purple-100 dark:bg-white/[0.05] rounded-lg" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Every Department, One Portal',
    description: 'Roads, water, power and waste, all connected.',
    span: 'md:col-span-2 lg:col-span-2',
    image: IMAGES.skyline,
  },
];

export default function GallerySection() {
  return (
    <section className="relative bg-background text-foreground py-28 md:py-36 border-t border-border overflow-hidden transition-colors duration-300">
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-[#4C1D95]/15 blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-5xl md:text-7xl font-light tracking-tight leading-[0.98] mb-6"
          >
            A platform
            <br />
            <span className="bg-gradient-to-r from-[#4C1D95] via-[#C026D3] to-purple-600 dark:from-purple-300 dark:via-fuchsia-400 dark:to-purple-400 bg-clip-text text-transparent">
              built for everyone
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium"
          >
            Everything you need to work with your city administration, organised in one portal.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[260px]">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: (index % 3) * 0.1 }}
              className={`group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300 ${item.span}`}
            >
              {/* Photo background */}
              {item.image && (
                <>
                  <img
                    src={item.image.src}
                    alt={item.image.alt}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-[#4C1D95]/20 mix-blend-multiply" />
                </>
              )}

              {/* Mockup card background glow */}
              {!item.image && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-[#C026D3]/10 opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              )}

              {item.content}

              {item.badge && (
                <span className="absolute top-5 right-5 z-20 inline-flex items-center gap-2 rounded-full bg-black/50 backdrop-blur border border-white/20 px-3 py-1 text-xs text-white">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-fuchsia-400" />
                  </span>
                  {item.badge}
                </span>
              )}

              {/* Title & Description */}
              <div className={`absolute left-0 z-20 p-6 ${item.image ? 'bottom-0 text-white' : 'top-0 text-foreground'}`}>
                <h3 className={`text-xl font-semibold tracking-tight mb-1 transition-colors ${item.image ? 'text-white group-hover:text-purple-200' : 'text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400'}`}>
                  {item.title}
                </h3>
                <p className={`text-sm max-w-[85%] ${item.image ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
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