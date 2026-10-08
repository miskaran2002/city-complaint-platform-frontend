// components/landing/FeatureStackSection.tsx
'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

type Feature = {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  tags: string[];
  visual?: 'payments';
};

const features: Feature[] = [
  {
    id: '01',
    title: 'Report Instantly',
    description:
      'Report a civic issue anytime, anywhere. Pick a category, drop a location pin, attach photos and submit your complaint to the city network in seconds.',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    gradient: 'from-[#1E1B4B] to-[#4C1D95]',
    tags: ['Categories', 'Location pin', 'Photo upload'],
  },
  {
    id: '02',
    title: 'Smart Routing',
    description:
      'Your complaint is assigned to the right department automatically, then handed to a staff member or technician, so nothing waits in the wrong inbox.',
    icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
    gradient: 'from-[#2E1065] to-[#5B21B6]',
    tags: ['Department assignment', 'Staff and technician', 'No manual sorting'],
  },
  {
    id: '03',
    title: 'Track in Real Time',
    description:
      'No more guessing. Watch your report move from received to resolved on a live status timeline, with an update at every step.',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    gradient: 'from-[#4C1D95] to-[#7E22CE]',
    tags: ['Live status', 'Full timeline', 'Work updates'],
  },
  {
    id: '04',
    title: 'Priority with bKash or Stripe',
    description:
      'Need faster attention or a premium service? Pay securely with bKash or with a card through Stripe. Choose whichever suits you at checkout.',
    icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    gradient: 'from-[#6B21A8] to-[#A21CAF]',
    tags: ['bKash', 'Stripe (cards)', 'Secure checkout'],
    visual: 'payments',
  },
  {
    id: '05',
    title: 'Technician Updates',
    description:
      'Field technicians post progress as they work, with notes and photos, so you can see the repair happening instead of waiting for a call.',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    gradient: 'from-[#3B0764] to-[#6D28D9]',
    tags: ['Progress notes', 'Photo proof', 'On-site status'],
  },
  {
    id: '06',
    title: 'Notifications and SLA',
    description:
      'Get notified whenever the status changes. Every complaint has a response deadline, and managers see overdue items before they become a problem.',
    icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
    gradient: 'from-[#1E1B4B] to-[#581C87]',
    tags: ['Status alerts', 'SLA deadlines', 'Overdue warnings'],
  },
  {
    id: '07',
    title: 'Resolved and Rated',
    description:
      'When the work is done, confirm the fix and rate the service. Your feedback helps city admins improve every department.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    gradient: 'from-[#4C1D95] to-[#C026D3]',
    tags: ['Confirm the fix', 'Citizen feedback', 'Public statistics'],
  },
];

function PaymentTiles() {
  return (
    <div className="hidden lg:flex flex-col gap-3 shrink-0">
      <div className="w-44 rounded-2xl p-4 bg-gradient-to-br from-[#E2136E] to-[#9D174D] border border-pink-300/30 shadow-xl">
        <div className="text-white font-black text-xl italic tracking-tighter">bKash</div>
        <div className="text-white/80 text-xs mt-1">Mobile wallet</div>
      </div>
      <div className="w-44 rounded-2xl p-4 bg-gradient-to-br from-[#635BFF] to-[#4338CA] border border-indigo-300/30 shadow-xl">
        <div className="text-white font-black text-xl tracking-tight">stripe</div>
        <div className="text-white/80 text-xs mt-1">Debit and credit cards</div>
      </div>
    </div>
  );
}

function StackCard({
  feature,
  index,
  total,
  progress,
}: {
  feature: Feature;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // porer card upore ashle ager card ektu choto hoye pichone jay
  const targetScale = 1 - (total - 1 - index) * 0.035;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div className="sticky" style={{ top: `calc(15vh + ${index * 26}px)`, zIndex: index + 10 }}>
      <motion.div
        style={{ scale, transformOrigin: 'top center' }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient}`} />
        <div className="absolute inset-0 bg-[#030014]/30" />

        <div className="relative z-10 p-7 md:p-10 flex flex-col md:flex-row gap-7 md:gap-10 items-start md:items-center">
          {/* icon + number */}
          <div className="relative shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-md grid place-items-center">
            <span className="absolute top-2 right-3 text-white/25 font-light text-2xl">{feature.id}</span>
            <svg className="w-10 h-10 md:w-14 md:h-14 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
            </svg>
          </div>

          {/* text */}
          <div className="flex-1">
            <h3 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-3">{feature.title}</h3>
            <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-2xl">{feature.description}</p>
            <div className="flex flex-wrap gap-2 mt-5">
              {feature.tags.map((t) => (
                <span key={t} className="px-3 py-1 rounded-full text-xs text-white/80 bg-white/10 border border-white/15">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {feature.visual === 'payments' && <PaymentTiles />}
        </div>
      </motion.div>
    </div>
  );
}

export default function FeatureStackSection() {
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start start', 'end end'] });

  return (
    <section className="relative bg-[#030014] text-white py-28 md:py-36 px-6 lg:px-8 border-t border-white/5">
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-[#4C1D95]/20 blur-[140px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-light tracking-tight leading-[0.98] mb-5">
            How it{' '}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
              works
            </span>
          </h2>
          <p className="text-lg md:text-xl text-white/60 max-w-xl">
            From the first report to the final rating, one smooth flow for every citizen.
          </p>
        </motion.div>

        {/* sticky card stack */}
        <div ref={stackRef} className="flex flex-col gap-10 pb-24">
          {features.map((f, i) => (
            <StackCard key={f.id} feature={f} index={i} total={features.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}