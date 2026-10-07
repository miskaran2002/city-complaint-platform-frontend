'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/axios';
import GlobalLoading from '@/app/loading';

interface Payment {
  id: string;
  complaintId: string;
  amount: number;
  status: string;
  gateway: string;
  transactionId: string;
  createdAt: string;
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await apiClient.get('/payments'); 
        setPayments(res.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch payment history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <GlobalLoading />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-foreground">Payment History</h1>

      {payments.length === 0 ? (
        <div className="bg-card p-8 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
          No payments made yet.
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      p.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-cardmber-50 text-amber-600'
                    }`}>
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
      )}
    </div>
  );
}