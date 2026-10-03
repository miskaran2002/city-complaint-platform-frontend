// app/page.tsx

import { Navbar } from '@/components/shared/Navbar';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Blobs (ভবিষ্যতে মোশন অ্যানিমেশনে কাজে লাগবে) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      {/* Navigation Bar */}
      <Navbar />
      
      {/* Hero Section */}
      <main className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[85vh] text-center">
        
        <div className="inline-block px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-600 font-semibold text-sm mb-6">
          🚀 Welcome to the Future of Civic Services
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
          Build a Better <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4C1D95] to-[#C026D3]">
            Smart City Together
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Report civic issues, track your complaints, and pay for emergency services all in one unified, secure, and modern platform.
        </p>
        
        {/* Call to Action (CTA) Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/citizen/complaints" 
            className="bg-gradient-to-r from-[#4C1D95] to-[#7E22CE] text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 w-full sm:w-auto"
          >
            Report an Issue
          </Link>
          <Link 
            href="/citizen/dashboard" 
            className="bg-white text-gray-800 border-2 border-gray-100 px-8 py-4 rounded-full text-lg font-bold shadow-sm hover:border-purple-200 hover:text-purple-600 transition-all w-full sm:w-auto"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>

    </div>
  );
}