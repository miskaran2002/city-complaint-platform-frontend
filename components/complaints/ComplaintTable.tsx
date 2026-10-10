// components/complaints/ComplaintTable.tsx
'use client';

import React, { useState } from 'react';
import { Complaint, ComplaintStatus } from '@/types/complaint';
import { PaymentMethodModal } from './PaymentMethodModal';

interface ComplaintTableProps {
  complaints: Complaint[];
  isLoading: boolean;
  onRefresh?: () => void; // optional: refetch list after the payment modal closes
}

export const ComplaintTable = ({ complaints, isLoading, onRefresh }: ComplaintTableProps) => {
  const [payingComplaintId, setPayingComplaintId] = useState<string | null>(null);

  const getStatusBadge = (status: ComplaintStatus) => {
    // Unpaid emergency complaint (saved, but not submitted yet)
    if ((status as string) === 'PENDING_PAYMENT') {
      return (
        <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-md text-xs font-bold border border-orange-200 whitespace-nowrap">
          Payment Pending
        </span>
      );
    }

    switch (status) {
      case ComplaintStatus.PENDING:
        return (
          <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-md text-xs font-bold border border-amber-200">
            Pending
          </span>
        );
      case ComplaintStatus.ASSIGNED:
        return (
          <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md text-xs font-bold border border-purple-200">
            Assigned
          </span>
        );
      case ComplaintStatus.IN_PROGRESS:
        return (
          <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold border border-blue-200">
            In Progress
          </span>
        );
      case ComplaintStatus.RESOLVED:
        return (
          <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-200">
            Resolved
          </span>
        );
      case ComplaintStatus.REJECTED:
        return (
          <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-md text-xs font-bold border border-red-200">
            Rejected
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-background/50">
        <h2 className="text-lg font-bold text-gray-800">Tracking History</h2>
        <span className="px-3 py-1 bg-purple-100 text-[#7E22CE] rounded-full text-xs font-bold">
          Total Reports: {complaints.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
              <th className="p-4">Issue Details</th>
              <th className="p-4">Category</th>
              <th className="p-4 text-center">Priority</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">
                  <span className="w-8 h-8 border-4 border-[#7E22CE] border-t-transparent rounded-full animate-spin inline-block"></span>
                </td>
              </tr>
            ) : complaints.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 italic">
                  You haven't submitted any complaints yet.
                </td>
              </tr>
            ) : (
              complaints.map((comp) => {
                const needsPayment = (comp.status as string) === 'PENDING_PAYMENT';

                return (
                  <tr key={comp.id} className="hover:bg-background/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{comp.title}</div>
                      <div
                        className="text-gray-500 text-xs mt-1 truncate max-w-[200px]"
                        title={comp.address || ''}
                      >
                        📍 {comp.address || 'No address provided'}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{comp.category?.name || 'Unknown'}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                          comp.priority === 'EMERGENCY'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : comp.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {comp.priority}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        {getStatusBadge(comp.status)}
                        {needsPayment && (
                          <button
                            type="button"
                            onClick={() => setPayingComplaintId(comp.id)}
                            className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#4C1D95] to-[#7E22CE] hover:opacity-90 transition"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-500 whitespace-nowrap">
                      {new Date(comp.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {payingComplaintId && (
        <PaymentMethodModal
          complaintId={payingComplaintId}
          onClose={() => {
            setPayingComplaintId(null);
            onRefresh?.();
          }}
        />
      )}
    </div>
  );
};