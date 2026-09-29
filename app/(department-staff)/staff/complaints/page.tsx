'use client';

import React, { useState, useEffect } from 'react';
import GlobalLoading from '@/app/loading';

import { AssignModal } from '@/components/department_staff/AssignModal';
import { useAuthStore } from '@/store/useAuthStore'; // 👈 অথ স্টেট ইমপোর্ট
import apiClient from '@/lib/axios';

export default function StaffComplaintsPage() {
  const { user } = useAuthStore(); // বর্তমান লগইন করা ইউজারের তথ্য (যাতে departmentId পাওয়া যায়)
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      // ব্যাকএন্ড থেকে সব কমপ্লেন ফেচ করা হচ্ছে
      const res = await apiClient.get('/complaints');
      if (res.data && res.data.success) {
        const allComplaints = Array.isArray(res.data.data) ? res.data.data : (res.data.data?.complaints || []);
        
        // ⚠️ ফিল্টারিং লজিক: যদি ইউজার STAFF হয় এবং তার departmentId থাকে, 
        // তবে শুধু তার নিজের ডিপার্টমেন্টের কমপ্লেনগুলোই ফিল্টার হবে।
        // (অ্যাডমিন হলে সব দেখতে পাবে)
        if (user?.role === 'DEPARTMENT_STAFF' && user?.departmentId) {
          const filtered = allComplaints.filter((item: any) => item.departmentId === user.departmentId);
          setComplaints(filtered);
        } else {
          setComplaints(allComplaints);
        }
      }
    } catch (err) {
      console.error('Failed to fetch complaints', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [user]); // user লোড হওয়ার পর ফিল্টার হবে

  if (isLoading) {
    return <GlobalLoading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Assigned Department Complaints</h1>
        <p className="text-gray-500 text-sm mt-1">
          Review complaints specific to your department ({user?.departmentId ? 'Filtered by Department' : 'All'}) and assign technicians.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-sm font-medium">
          {successMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">Department Complaints List</h2>
          <span className="px-3 py-1 bg-purple-100 text-[#7E22CE] rounded-full text-xs font-bold">
            Total: {complaints.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-4">Complaint Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 italic">No complaints found for your department.</td>
                </tr>
              ) : (
                complaints.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{item.title}</div>
                      <div className="text-gray-500 text-xs truncate max-w-[250px]">{item.description}</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-purple-50 text-[#7E22CE] px-2.5 py-1 rounded-md text-xs font-bold border border-purple-100">
                        {item.category?.name || 'General'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                        item.priority === 'URGENT' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-gray-700">{item.status}</span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedComplaint(item);
                          setIsModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 bg-[#7E22CE] hover:bg-[#6b1cb0] text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                      >
                        Assign Technician
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedComplaint && (
        <AssignModal
          complaintId={selectedComplaint.id}
          departmentId={selectedComplaint.departmentId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setSuccessMsg('Technician assigned successfully!');
            fetchComplaints();
            setTimeout(() => setSuccessMsg(''), 3000);
          }}
        />
      )}
    </div>
  );
}