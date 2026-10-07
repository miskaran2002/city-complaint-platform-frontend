// components/complaints/ComplaintForm.tsx
'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Category } from '@/types/category';
import { Priority } from '@/types/complaint';
import { createComplaint } from '@/services/complaint.service';
import { PaymentMethodModal } from './PaymentMethodModal';

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

  // ✅ নতুন state — payment method modal control করার জন্য
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingComplaintId, setPendingComplaintId] = useState<string | null>(null);

  const resetForm = () => {
    setTitle('');
    setCategoryId('');
    setAddress('');
    setDescription('');
    setPriority('MEDIUM');
  };

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

        // ✅ Emergency হলে সরাসরি payment gateway-তে না পাঠিয়ে, method বেছে নেওয়ার modal দেখাও
        if ((priority as string) === 'EMERGENCY' && newComplaintId) {
          setPendingComplaintId(newComplaintId);
          setShowPaymentModal(true);
          setIsSubmitting(false);
          return;
        }

        setSuccess('Complaint submitted successfully!');
        resetForm();
        onSuccess(); 
        
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit complaint.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card dark:bg-[#0A0515] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-border transition-colors duration-300">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b dark:border-border pb-2 transition-colors duration-300">Report an Issue</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-100 dark:border-red-500/20">{error}</div>}
        {success && <div className="p-3 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-100 dark:border-emerald-500/20">{success}</div>}

        <Input
          label="Issue Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Severe Mosquito Outbreak"
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category <span className="text-red-500">*</span></label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 focus:ring-2 focus:ring-[#C026D3] focus:border-[#C026D3] outline-none transition-all text-sm bg-card dark:bg-[#030014] text-foreground dark:text-white"
          >
            <option value="" disabled>-- Select Category --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority Level</label>
          <select
            value={priority as string}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 focus:ring-2 focus:ring-[#C026D3] focus:border-[#C026D3] outline-none transition-all text-sm bg-card dark:bg-[#030014] text-foreground dark:text-white"
          >
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in detail..."
            rows={3}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 focus:ring-2 focus:ring-[#C026D3] focus:border-[#C026D3] outline-none transition-all resize-none text-sm bg-card dark:bg-[#030014] text-foreground dark:text-white"
          ></textarea>
        </div>

        <Button type="submit" className="w-full mt-2 bg-gradient-to-r from-[#4C1D95] to-[#7E22CE] text-white" isLoading={isSubmitting}>
          Submit Complaint
        </Button>
      </form>

      {/* ✅ Payment Method Modal — Emergency complaint submit হওয়ার পর দেখাবে */}
      {showPaymentModal && pendingComplaintId && (
        <PaymentMethodModal
          complaintId={pendingComplaintId}
          onClose={() => {
            setShowPaymentModal(false);
            setPendingComplaintId(null);
            setSuccess('Complaint submitted! You can pay the emergency fee later from the complaint details page.');
            resetForm();
            onSuccess();
            setTimeout(() => setSuccess(''), 5000);
          }}
        />
      )}
    </div>
  );
};