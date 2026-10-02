'use client';

import apiClient from '@/lib/axios';
import React, { useState } from 'react';

import toast from 'react-hot-toast';

interface PaymentButtonProps {
  complaintId: string;
  amount: number;
}

export const PaymentButton = ({ complaintId, amount }: PaymentButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      
      // Backend theke Stripe checkout session create kore paymentUrl ana hocche
      const res = await apiClient.post('/payments/stripe/create', {
        complaintId,
        amount
      });

      const paymentUrl = res.data?.data?.paymentUrl; 

      if (paymentUrl) {
        // Direct Stripe checkout page-e redirect kora hocche
        window.location.href = paymentUrl;
      } else {
        toast.error('Failed to create payment session.');
      }
    } catch (err: any) {
      console.error('Payment Error:', err);
      toast.error(err.response?.data?.message || 'Something went wrong during payment processing.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
    >
      {isLoading ? 'Processing...' : '💳 Pay with Stripe'}
    </button>
  );
};