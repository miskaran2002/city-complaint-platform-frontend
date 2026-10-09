'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import apiClient from '@/lib/axios';

interface PaymentModalProps {
  complaintId: string;
  onClose: () => void;
}

export const PaymentModal = ({ complaintId, onClose }: PaymentModalProps) => {
  const [selectedGateway, setSelectedGateway] = useState<'bkash' | 'stripe'>('stripe');
  const [isLoading, setIsLoading] = useState(false);

  const handleProceedPayment = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      // Dynamically set endpoint based on gateway selection
      const endpoint = selectedGateway === 'stripe' 
        ? '/payments/stripe/create' 
        : '/payments/bkash/create';

      const res = await apiClient.post(endpoint, { complaintId });
      const paymentUrl = res.data?.data?.paymentUrl;

      if (paymentUrl) {
        toast.loading('Redirecting to secure payment gateway...');
        window.location.href = paymentUrl; // Redirect to Hosted Checkout
      } else {
        toast.error(`Failed to get ${selectedGateway.toUpperCase()} payment URL`);
      }
    } catch (err: any) {
      console.error('Payment initiation failed', err);
      toast.error(err.response?.data?.message || 'Failed to initiate payment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-6 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-gray-700/50 pb-4">
          <h3 className="text-xl font-extrabold text-foreground">Select Payment Gateway</h3>
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="text-gray-400 hover:text-foreground font-bold text-lg disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-400">
          Choose your preferred payment method to activate and dispatch rapid emergency services.
        </p>

        {/* Gateway Options */}
        <div className="grid grid-cols-2 gap-4">
          {/* Stripe Option */}
          <button
            type="button"
            onClick={() => setSelectedGateway('stripe')}
            disabled={isLoading}
            className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center transition-all ${
              selectedGateway === 'stripe' 
                ? 'border-purple-600 bg-purple-500/10 shadow-md' 
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="text-3xl mb-2">💳</div>
            <span className="font-bold text-foreground text-sm">Stripe / Card</span>
          </button>

          {/* bKash Option */}
          <button
            type="button"
            onClick={() => setSelectedGateway('bkash')}
            disabled={isLoading}
            className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center transition-all ${
              selectedGateway === 'bkash' 
                ? 'border-pink-600 bg-pink-500/10 shadow-md' 
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="text-3xl mb-2">📱</div>
            <span className="font-bold text-foreground text-sm">bKash</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-700/50">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 border border-gray-700 text-gray-300 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleProceedPayment}
            disabled={isLoading}
            className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800/60 text-white rounded-xl font-bold shadow-md transition-all text-sm flex items-center justify-center gap-2"
          >
            {isLoading ? 'Redirecting...' : 'Proceed to Pay'}
          </button>
        </div>

      </div>
    </div>
  );
};