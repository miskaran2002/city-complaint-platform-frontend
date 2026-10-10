// app/(citizen)/citizen/payments/bkash-result/page.tsx
'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PaymentMethodModal } from '@/components/complaints/PaymentMethodModal';
import GlobalLoading from '@/app/loading';

function BkashResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const complaintId = searchParams.get('complaintId');
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6">
        {status === 'success' ? (
          <>
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center text-4xl mb-5 shadow-inner">
              ✅
            </div>
            <h2 className="text-2xl font-extrabold text-foreground">bKash Payment Successful!</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Your emergency complaint has been submitted successfully.
            </p>
            <Link
              href="/citizen/complaints"
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all block shadow-md"
            >
              View My Complaints
            </Link>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full mx-auto flex items-center justify-center text-4xl mb-5 shadow-inner">
              ❌
            </div>
            <h2 className="text-2xl font-extrabold text-foreground">Payment Not Completed</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Your complaint is saved but NOT submitted yet. Complete the payment to submit it.
            </p>

            {complaintId && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-[#4C1D95] to-[#7E22CE] text-white px-6 py-3 rounded-xl font-bold w-full shadow-md"
              >
                Try Again / Change Payment Method
              </button>
            )}

            <Link
              href="/citizen/complaints"
              className="bg-gray-100 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 block border border-gray-200"
            >
              Go to My Complaints
            </Link>
          </>
        )}
      </div>

      {showModal && complaintId && (
        <PaymentMethodModal complaintId={complaintId} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

export default function BkashResultPage() {
  return (
    <Suspense fallback={<GlobalLoading />}>
      <BkashResultContent />
    </Suspense>
  );
}