// app/(citizen)/citizen/payments/page.tsx
'use client';

import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import apiClient from '@/lib/axios';
import GlobalLoading from '@/app/loading';
import { PaymentMethodModal } from '@/components/complaints/PaymentMethodModal';

// ⚠️ Backend e Stripe verify route er path ja ache seta ekhane boshan
// (payment.routes.ts e `verifyStripePayment` kon path e ache dekhe nin)
const STRIPE_VERIFY_URL = '/payments/stripe/verify';

interface Payment {
  id: string;
  complaintId: string;
  amount: number;
  status: string;
  gateway: string;
  transactionId: string;
  createdAt: string;
}

type Banner = { type: 'success' | 'error' | 'info'; text: string } | null;

function PaymentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Stripe redirects back with these query params
  const sessionId = searchParams.get('session_id');
  const complaintId = searchParams.get('complaintId');
  const returnStatus = searchParams.get('status'); // success | cancelled

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<Banner>(null);
  const [retryComplaintId, setRetryComplaintId] = useState<string | null>(null); // kon complaint er payment retry hobe
  const [showModal, setShowModal] = useState(false);

  // React strict mode e effect 2 bar chole, tai ekbar-i verify korar guard
  const verifyStarted = useRef(false);

  const fetchPayments = useCallback(async () => {
    try {
      const res = await apiClient.get('/payments');
      setPayments(res.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch payment history', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      // ---- Case 1: Stripe payment shesh, ebar backend e verify korte hobe ----
      if (returnStatus === 'success' && sessionId && complaintId) {
        if (verifyStarted.current) return;
        verifyStarted.current = true;

        setBanner({ type: 'info', text: 'Verifying your payment, please wait...' });
        try {
          await apiClient.post(STRIPE_VERIFY_URL, { sessionId, complaintId });
          setBanner({
            type: 'success',
            text: 'Payment successful! Your emergency complaint has been submitted.',
          });
        } catch (err: any) {
          setBanner({
            type: 'error',
            text:
              err?.response?.data?.message ||
              'Payment could not be verified. If money was deducted, please contact support.',
          });
        }
        // URL theke session_id muche felo, jate refresh korle abar verify na hoy
        router.replace('/citizen/payments');
      }

      // ---- Case 2: user Stripe page theke cancel kore fire eseche ----
      else if (returnStatus === 'cancelled') {
        setBanner({
          type: 'info',
          text: 'Payment cancelled. Your complaint is saved but NOT submitted yet. You can choose a payment method again.',
        });
        if (complaintId) {
          setRetryComplaintId(complaintId);
          setShowModal(true);
        }
        router.replace(
          complaintId ? `/citizen/payments?complaintId=${complaintId}` : '/citizen/payments'
        );
      }

      await fetchPayments();
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && !banner) return <GlobalLoading />;

  const bannerStyle =
    banner?.type === 'success'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : banner?.type === 'error'
      ? 'bg-red-50 text-red-700 border-red-200'
      : 'bg-amber-50 text-amber-700 border-amber-200';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-foreground">Payment History</h1>

      {banner && (
        <div className={`p-4 rounded-xl border text-sm ${bannerStyle}`}>
          <p>{banner.text}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {retryComplaintId && (
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 rounded-lg bg-[#7E22CE] text-white text-xs font-bold"
              >
                Choose payment method
              </button>
            )}
            <Link
              href="/citizen/complaints"
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-xs font-bold"
            >
              Go to My Complaints
            </Link>
          </div>
        </div>
      )}

      {payments.length === 0 ? (
        <div className="bg-card p-8 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
          No payments made yet.
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-background text-gray-600 text-left">
                <tr>
                  <th className="px-4 py-3">Gateway</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Transaction ID</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{p.gateway}</td>
                    <td className="px-4 py-3">{p.amount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          p.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-600'
                            : p.status === 'FAILED'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{p.transactionId}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cancel korar por abar method bachar jonno (bKash <-> Stripe switch) */}
      {showModal && retryComplaintId && (
        <PaymentMethodModal
          complaintId={retryComplaintId}
          onClose={() => {
            setShowModal(false);
            fetchPayments();
          }}
        />
      )}
    </div>
  );
}

export default function PaymentHistoryPage() {
  // useSearchParams() er jonno Suspense lage (Next.js build error eray)
  return (
    <Suspense fallback={<GlobalLoading />}>
      <PaymentsContent />
    </Suspense>
  );
}