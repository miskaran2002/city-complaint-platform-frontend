'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import apiClient from '@/lib/axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentModalProps {
  complaintId: string;
  onClose: () => void;
}

export const PaymentModal = ({ complaintId, onClose }: PaymentModalProps) => {
  const [selectedGateway, setSelectedGateway] = useState<'bkash' | 'stripe'>('stripe');
  const [isLoading, setIsLoading] = useState(false);

  const handleProceedPayment = async () => {
    try {
      setIsLoading(true);

      if (selectedGateway === 'stripe') {
        // Stripe Payment Call
        const res = await apiClient.post('/payments/stripe/create', { complaintId });
        const paymentUrl = res.data?.data?.paymentUrl;
        
        if (paymentUrl) {
          window.location.href = paymentUrl; // Redirect to Stripe Checkout
        } else {
          toast.error('Failed to get Stripe payment URL');
        }
      } else {
        // bKash Payment Call
        const res = await apiClient.post('/payments/bkash/create', { complaintId });
        const paymentUrl = res.data?.data?.paymentUrl;

        if (paymentUrl) {
          window.location.href = paymentUrl; // Redirect to bKash sandbox/live page
        } else {
          toast.error('Failed to get bKash payment URL');
        }
      }
    } catch (err: any) {
      console.error('Payment initiation failed', err);
      toast.error(err.response?.data?.message || 'Failed to initiate payment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-6 animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <h3 className="text-xl font-extrabold text-foreground">Select Payment Gateway</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
        </div>

        <p className="text-sm text-gray-500">
          Choose your preferred payment method to upgrade this emergency complaint and dispatch rapid services.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* Stripe Option */}
          <div 
            onClick={() => setSelectedGateway('stripe')}
            className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center transition-all ${
              selectedGateway === 'stripe' ? 'border-purple-600 bg-purple-50/50 shadow-md' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-3xl mb-2">💳</div>
            <span className="font-bold text-foreground text-sm">Stripe / Card</span>
          </div>

          {/* bKash Option */}
          <div 
            onClick={() => setSelectedGateway('bkash')}
            className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center transition-all ${
              selectedGateway === 'bkash' ? 'border-pink-600 bg-pink-50/50 shadow-md' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-3xl mb-2">📱</div>
            <span className="font-bold text-foreground text-sm">bKash</span>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-background transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleProceedPayment}
            disabled={isLoading}
            className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-xl font-bold shadow-md transition-all text-sm"
          >
            {isLoading ? 'Redirecting...' : 'Proceed to Pay'}
          </button>
        </div>

      </div>
    </div>
  );
};