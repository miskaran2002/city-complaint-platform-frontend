// components/shared/Footer.tsx
import React from 'react';
import Link from 'next/link';

const Sparkle = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M12 0c.6 5.5 2.5 9.6 6 11.3C21.5 12.4 23 12 24 12c-1 0-2.5-.4-6 .7-3.5 1.7-5.4 5.8-6 11.3-.6-5.5-2.5-9.6-6-11.3C2.5 11.6 1 12 0 12c1 0 2.5.4 6-.7C9.5 9.6 11.4 5.5 12 0z" />
  </svg>
);

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'City Departments', href: '/departments' },
  { label: 'Service Categories', href: '/category' },
  { label: 'About Us', href: '/about' },
];

export default function Footer() {
  return (
    <footer className="relative z-50 overflow-hidden text-white bg-gradient-to-b from-[#030014] via-[#14052e] to-[#2E1065]">
      {/* glows */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#C026D3]/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full bg-[#7C3AED]/25 blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24">
       
       

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-16">
          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="grid place-items-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#7C3AED] via-[#A21CAF] to-[#4C1D95] shadow-[0_0_25px_rgba(192,38,211,0.45)] border border-white/20">
                <Sparkle />
              </span>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-purple-300 to-fuchsia-400 bg-clip-text text-transparent">
                SmartCity.
              </span>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed max-w-xs font-medium">
              Empowering Barishal with next-generation digital civic solutions. Report issues, track progress and build a better city together.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm uppercase tracking-widest text-white/50 font-bold mb-5">Quick Links</h3>
            <ul className="space-y-3 text-white/80">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-fuchsia-300 transition-colors font-medium">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm uppercase tracking-widest text-white/50 font-bold mb-5">Contact Barishal</h3>
            <ul className="space-y-4 text-white/80 text-sm">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-fuchsia-300 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium text-white/80">
                  Fazlul Huq Avenue,
                  <br />
                  Barishal 8200, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-fuchsia-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium text-white/80">support@smartbarishal.gov.bd</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/15 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-white/60 text-center md:text-left font-medium">
            &copy; {new Date().getFullYear()} Smart City Barishal. All rights reserved.
          </p>
          <div className="flex gap-6 font-medium">
            <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/60 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Giant logo wordmark */}
      <div
        aria-hidden
        className="relative select-none pointer-events-none text-center font-black leading-[0.8] tracking-tighter text-[22vw] md:text-[18vw] whitespace-nowrap -mb-[3vw] bg-gradient-to-b from-white/30 via-fuchsia-300/10 to-transparent bg-clip-text text-transparent"
      >
        SmartCity
      </div>
    </footer>
  );
}