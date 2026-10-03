'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import Link from 'next/link';
import apiClient from '@/lib/axios';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get session_id and complaintId from query parameters
  const sessionId = searchParams.get('session_id');
  const complaintId = searchParams.get('complaintId');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const verifyAndUpdatePayment = async () => {
      if (!sessionId || !complaintId) {
        setStatus('error');
        return;
      }

      try {
        // Verify payment session with backend (Stripe) and update complaint priority
        const res = await apiClient.post('/payments/stripe/verify', {
          sessionId,
          complaintId
        });

        if (res.data?.success) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error: any) {
        console.error('Failed to verify payment', error);
        setStatus('error');
      }
    };

    verifyAndUpdatePayment();
  }, [sessionId, complaintId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
        
        {status === 'loading' && (
          <div className="space-y-4">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <h2 className="text-2xl font-bold text-gray-800">Verifying Payment...</h2>
            <p className="text-gray-500 text-sm">Please do not close this window.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center text-4xl mb-5 shadow-inner">
              ✅
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Payment Successful!</h2>
            <p className="text-gray-500 mt-2 text-sm">Your payment for the emergency service has been processed and activated.</p>
            
            <div className="mt-8">
              <Link 
                href="/citizen/dashboard" 
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all block shadow-md hover:shadow-lg"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full mx-auto flex items-center justify-center text-4xl mb-5 shadow-inner">
              ❌
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Verification Failed</h2>
            <p className="text-gray-500 mt-2 text-sm">We could not verify your payment. If money was deducted, please contact support.</p>
            
            <div className="mt-8">
              <button 
                onClick={() => router.push('/citizen/dashboard')} 
                className="bg-gray-100 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all w-full border border-gray-200"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}