// components/shared/Footer.tsx
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-[#05000A] pt-20 pb-8 border-t border-border z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Top Section: Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Brand & Intro */}
          <div className="space-y-5 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C026D3] animate-pulse"></span>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-[#C026D3]">
                SmartCity.
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed font-medium">
              Empowering Barishal with next-generation digital civic solutions. Report issues, track progress, and build a better city together.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5">Quick Links</h3>
            <ul className="space-y-3 text-sm font-medium text-gray-400">
              <li><Link href="/" className="hover:text-purple-400 transition-colors">Home</Link></li>
              <li><Link href="/departments" className="hover:text-purple-400 transition-colors">City Departments</Link></li>
              <li><Link href="/category" className="hover:text-purple-400 transition-colors">Service Categories</Link></li>
              <li><Link href="/about" className="hover:text-purple-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* 3. Civic Services */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5">Civic Services</h3>
            <ul className="space-y-3 text-sm font-medium text-gray-400">
              <li><Link href="/login" className="hover:text-purple-400 transition-colors">Report an Issue</Link></li>
              <li><Link href="/login" className="hover:text-purple-400 transition-colors">Track Complaint Status</Link></li>
              <li><Link href="/login" className="hover:text-purple-400 transition-colors">Emergency via bKash</Link></li>
              <li><Link href="/admin/dashboard" className="hover:text-purple-400 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5">Contact Barishal</h3>
            <ul className="space-y-3 text-sm font-medium text-gray-400">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Fazlul Huq Avenue,<br/>Barishal 8200, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@smartbarishal.gov.bd</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium">
          <p className="text-gray-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} Smart City Barishal. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}