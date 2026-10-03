// components/Navbar.tsx
import Link from 'next/link';
import React from 'react';

export const Navbar = () => {
  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-[#C026D3]">
              SmartCity.
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-gray-600 hover:text-purple-600 font-semibold transition-colors">Home</Link>
            <Link href="/departments" className="text-gray-600 hover:text-purple-600 font-semibold transition-colors">Departments</Link>
            <Link href="/about" className="text-gray-600 hover:text-purple-600 font-semibold transition-colors">About Us</Link>
            <Link href="/services" className="text-gray-600 hover:text-purple-600 font-semibold transition-colors">Services</Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="hidden sm:block text-gray-700 hover:text-purple-600 font-bold transition-colors">
              Login
            </Link>
            <Link href="/citizen/dashboard" className="bg-gradient-to-r from-[#4C1D95] to-[#7E22CE] text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
              Dashboard
            </Link>
          </div>
          
        </div>
      </div>
    </nav>
  );
};