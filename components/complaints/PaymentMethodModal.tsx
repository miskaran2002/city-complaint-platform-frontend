'use client';

import React, { useState } from 'react';
import { initiateStripePayment, initiateBkashPayment } from '@/services/payment.service';

interface PaymentMethodModalProps {
  complaintId: string;
  onClose: () => void;
}

export const PaymentMethodModal = ({ complaintId, onClose }: PaymentMethodModalProps) => {
  const [loadingMethod, setLoadingMethod] = useState<'bkash' | 'stripe' | null>(null);
  const [error, setError] = useState('');

  const handlePayment = async (method: 'bkash' | 'stripe') => {
    setLoadingMethod(method);
    setError('');
    try {
      const res = method === 'bkash'
        ? await initiateBkashPayment(complaintId)
        : await initiateStripePayment(complaintId);

      const paymentUrl = res?.data?.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        setError('Payment URL not received. Please try again.');
        setLoadingMethod(null);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to initiate payment.');
      setLoadingMethod(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in duration-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Choose Payment Method</h2>
          <p className="text-gray-500 text-sm mt-1">
            Pay a one-time emergency priority fee to fast-track your complaint.
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {/* bKash Option */}
          <button
            onClick={() => handlePayment('bkash')}
            disabled={loadingMethod !== null}
            className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-pink-200 bg-pink-50 hover:bg-pink-100 transition-all disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-sm">
                বি
              </span>
              <div className="text-left">
                <p className="font-bold text-gray-900">bKash</p>
                <p className="text-xs text-gray-500">Pay with your bKash wallet</p>
              </div>
            </div>
            {loadingMethod === 'bkash' ? (
              <span className="text-xs text-pink-600 font-medium">Redirecting...</span>
            ) : (
              <span className="text-pink-600 font-bold">৳</span>
            )}
          </button>

          {/* Stripe Option */}
          <button
            onClick={() => handlePayment('stripe')}
            disabled={loadingMethod !== null}
            className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-all disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                S
              </span>
              <div className="text-left">
                <p className="font-bold text-gray-900">Card (Stripe)</p>
                <p className="text-xs text-gray-500">Pay with debit/credit card</p>
              </div>
            </div>
            {loadingMethod === 'stripe' ? (
              <span className="text-xs text-indigo-600 font-medium">Redirecting...</span>
            ) : (
              <span className="text-indigo-600 font-bold">$</span>
            )}
          </button>
        </div>

        <button
          onClick={onClose}
          disabled={loadingMethod !== null}
          className="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2 disabled:opacity-50"
        >
          Cancel, I&apos;ll pay later
        </button>
      </div>
    </div>
  );
};