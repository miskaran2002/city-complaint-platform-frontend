// services/payment.service.ts
import apiClient from '@/lib/axios';

export const initiateStripePayment = async (complaintId: string) => {
  const res = await apiClient.post('/payments/stripe/create', { complaintId });
  return res.data;
};

export const initiateBkashPayment = async (complaintId: string) => {
  const res = await apiClient.post('/payments/bkash/create', { complaintId });
  return res.data;
};