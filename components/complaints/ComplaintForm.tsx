// components/complaints/ComplaintForm.tsx
'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Category } from '@/types/category';
import { Priority } from '@/types/complaint';
import { createComplaint } from '@/services/complaint.service';
import apiClient from '@/lib/axios';

interface ComplaintFormProps {
  categories: Category[];
  onSuccess: () => void;
}

export const ComplaintForm = ({ categories, onSuccess }: ComplaintFormProps) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState<Priority | string>('MEDIUM');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      setError('Please select a category.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const selectedCat = categories.find(c => c.id === categoryId);
      const departmentId = selectedCat?.departmentId || '';

      const res = await createComplaint({
        title,
        description,
        categoryId,
        departmentId,
        address,
        priority: priority as Priority,
      });

      if (res.success) {
        const newComplaintId = res.data?.id || res.data?.data?.id || res?.data?.complaint?.id; 
        console.log("Newly Created Complaint ID:", newComplaintId);

        // 🔴 TS Error Fix: priority কে স্ট্রিং হিসেবে চেক করা হচ্ছে
        if ((priority as string) === 'EMERGENCY' && newComplaintId) {
          try {
            console.log("Initiating payment for:", newComplaintId);
            const paymentRes = await apiClient.post('/payments/stripe/create', {
              complaintId: newComplaintId,
              amount: 100
            });

            console.log("Payment API Response:", paymentRes.data);
            const paymentUrl = paymentRes.data?.data?.paymentUrl || paymentRes.data?.paymentUrl;
            
            if (paymentUrl) {
              window.location.href = paymentUrl; 
              return; 
            } else {
              setError("Payment URL not received from server.");
              setIsSubmitting(false);
              return;
            }
          } catch (paymentErr) {
            console.log('Payment API Error:', paymentErr);
            setError('Failed to initiate payment. Please check your network tab.');
            setIsSubmitting(false);
            return;
          }
        }

        setSuccess('Complaint submitted successfully!');
        setTitle('');
        setCategoryId('');
        setAddress('');
        setDescription('');
        setPriority('MEDIUM');
        onSuccess(); 
        
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit complaint.');
    } finally {
      // 🔴 TS Error Fix: priority কে স্ট্রিং হিসেবে চেক করা হচ্ছে
      if ((priority as string) !== 'EMERGENCY') {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Report an Issue</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">{error}</div>}
        {success && <div className="p-3 text-sm text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-100">{success}</div>}

        <Input
          label="Issue Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Severe Mosquito Outbreak"
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C026D3] focus:border-[#C026D3] outline-none transition-all text-sm bg-white"
          >
            <option value="" disabled>-- Select Category --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
          <select
            value={priority as string}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C026D3] focus:border-[#C026D3] outline-none transition-all text-sm bg-white"
          >
            {/* 🔴 TS Error Fix: সরাসরি স্ট্রিং ভ্যালু দেওয়া হলো */}
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
        </div>

        <Input
          label="Address / Location"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g. Rupatali Housing Estate, Barishal"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in detail..."
            rows={3}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C026D3] focus:border-[#C026D3] outline-none transition-all resize-none text-sm"
          ></textarea>
        </div>

        <Button type="submit" className="w-full mt-2 bg-gradient-to-r from-[#4C1D95] to-[#7E22CE]" isLoading={isSubmitting}>
          {isSubmitting && (priority as string) === 'EMERGENCY' ? 'Redirecting to Payment...' : 'Submit Complaint'}
        </Button>
      </form>
    </div>
  );
};