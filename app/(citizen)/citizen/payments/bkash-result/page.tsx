'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BkashResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get('status');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6">
        {status === 'success' ? (
          <>
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center text-4xl mb-5 shadow-inner">✅</div>
            <h2 className="text-2xl font-extrabold text-foreground">bKash Payment Successful!</h2>
            <p className="text-gray-500 mt-2 text-sm">Your complaint has been marked as Emergency.</p>
            <Link href="/citizen/dashboard" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all block shadow-md">
              Return to Dashboard
            </Link>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full mx-auto flex items-center justify-center text-4xl mb-5 shadow-inner">❌</div>
            <h2 className="text-2xl font-extrabold text-foreground">Payment Failed</h2>
            <p className="text-gray-500 mt-2 text-sm">Your bKash payment was not completed. Please try again.</p>
            <button onClick={() => router.push('/citizen/dashboard')} className="bg-gray-100 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 w-full border border-gray-200">
              Go Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}