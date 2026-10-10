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

export const verifyStripePayment = async (sessionId: string, complaintId: string) => {
  const res = await apiClient.post('/payments/stripe/verify', { sessionId, complaintId });
  return res.data;
};

export const getMyPayments = async () => {
  const res = await apiClient.get('/payments');
  return res.data;
};