'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    
    console.error('Global Error Caught:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 border-4 border-red-100">
        <svg 
          className="w-10 h-10" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Oops! Something went wrong.</h1>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        We encountered an unexpected error. Our system administrators have been notified. Please try again.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* relod button*/}
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-[#C026D3] hover:bg-[#a21caf] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          Try Again
        </button>

        {/* dashboard link */}
        <Link 
          href="/"
          className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}