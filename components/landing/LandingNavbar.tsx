'use client';

import React from 'react';
import Link from 'next/link';

export const LandingNavbar = () => {
  const links = [
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Features', href: '#features' },
    { name: 'Departments', href: '#departments' },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-3xl">
      <div className="flex items-center justify-between bg-card/10 backdrop-blur-xl border border-border rounded-full px-5 py-2.5 shadow-lg shadow-black/20">
        <Link href="/" className="flex items-center gap-2 pr-3">
          <span className="w-2 h-2 rounded-full bg-[#C026D3] shadow-[0_0_8px_#C026D3]" />
          <span className="text-white font-bold text-sm tracking-tight">Smart City</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-purple-200/80 hover:text-white text-sm px-3 py-1.5 rounded-full hover:bg-card/5 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        <Link
          href="/login"
          className="bg-card text-[#1E1B4B] text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-purple-50 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
};