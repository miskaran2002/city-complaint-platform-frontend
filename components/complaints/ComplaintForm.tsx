// components/complaints/ComplaintForm.tsx
'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Category } from '@/types/category';
import { Priority } from '@/types/complaint';
import { createComplaint } from '@/services/complaint.service';
import { PaymentMethodModal } from './PaymentMethodModal';
import toast from 'react-hot-toast'; // 🎯 Added for AI notifications

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
  const [isAIFetching, setIsAIFetching] = useState(false); // 🎯 AI Loading State
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [notice, setNotice] = useState('');

  // Payment modal control
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingComplaintId, setPendingComplaintId] = useState<string | null>(null);

  const resetForm = () => {
    setTitle('');
    setCategoryId('');
    setAddress('');
    setDescription('');
    setPriority('MEDIUM');
  };

  // 🎯 AI Auto-fill Function
  const handleAutoFillWithAI = async () => {
    if (!description) {
      toast.error('Please write a description first!');
      return;
    }

    setIsAIFetching(true);
    try {
      const token = localStorage.getItem('city_auth_token');
      
      // ⚠️ Note: Nicher port (5000) apnar backend er asol port number diye change kore niben
      const res = await fetch('http://localhost:5000/api/v1/ai/categorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ description })
      });

      const data = await res.json();

      if (data?.success) {
        const { category, priority: aiPriority } = data.data;

        // AI theke asha category namer sathe frontend er category id match kora
        const matchedCategory = categories.find(c =>
          c.name.toLowerCase().includes(category.toLowerCase()) ||
          category.toLowerCase().includes(c.name.toLowerCase())
        );

        if (matchedCategory) {
          setCategoryId(matchedCategory.id);
        } else {
          toast.error(`AI selected "${category}", but please select it manually from dropdown.`);
        }

        if (aiPriority) {
          setPriority(aiPriority.toUpperCase());
        }

        toast.success('✨ AI Categorization Applied!');
      } else {
        toast.error('AI failed to process. Try again.');
      }
    } catch (err) {
      toast.error('Failed to connect to AI server.');
    } finally {
      setIsAIFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Double-click / double-submit guard
    if (isSubmitting || showPaymentModal) return;

    if (!categoryId) {
      setError('Please select a category.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');
    setNotice('');

    try {
      const selectedCat = categories.find((c) => c.id === categoryId);
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
        const created: any = res.data;
        const newComplaintId: string | undefined =
          created?.id || created?.data?.id || created?.complaint?.id;

        const needsPayment =
          created?.requiresPayment === true || (priority as string) === 'EMERGENCY';

        // ---------- EMERGENCY: payment required, complaint is NOT submitted yet ----------
        if (needsPayment) {
          if (!newComplaintId) {
            setError(
              'Complaint was saved but its ID could not be read. Please refresh and use "Pay Now" from your complaint list.'
            );
            setIsSubmitting(false);
            return;
          }

          setPendingComplaintId(newComplaintId);
          setShowPaymentModal(true);
          setIsSubmitting(false);
          return;
        }

        // ---------- Normal complaint: submitted immediately ----------
        setSuccess('Complaint submitted successfully!');
        resetForm();
        onSuccess();
        setTimeout(() => setSuccess(''), 4000);
      }
      setIsSubmitting(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit complaint.');
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowPaymentModal(false);
    setPendingComplaintId(null);
    setNotice(
      'Emergency complaint is saved but NOT submitted yet. Complete the payment from "Tracking History" (Pay Now) to submit it.'
    );
    resetForm();
    onSuccess();
    setTimeout(() => setNotice(''), 8000);
  };

  return (
    <div className="bg-card dark:bg-[#0A0515] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-border transition-colors duration-300">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b dark:border-border pb-2 transition-colors duration-300">
        Report an Issue
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-100 dark:border-red-500/20">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
            {success}
          </div>
        )}
        {notice && (
          <div className="p-3 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-100 dark:border-amber-500/20">
            {notice}
          </div>
        )}

        <Input
          label="Issue Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Severe Mosquito Outbreak"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 focus:ring-2 focus:ring-[#C026D3] focus:border-[#C026D3] outline-none transition-all text-sm bg-card dark:bg-[#030014] text-foreground dark:text-white"
          >
            <option value="" disabled>
              -- Select Category --
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority Level
          </label>
          <select
            value={priority as string}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 focus:ring-2 focus:ring-[#C026D3] focus:border-[#C026D3] outline-none transition-all text-sm bg-card dark:bg-[#030014] text-foreground dark:text-white"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="EMERGENCY">Emergency (payment required)</option>
          </select>
          {(priority as string) === 'EMERGENCY' && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Emergency complaints are submitted only after the payment is completed.
            </p>
          )}
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in detail..."
            rows={3}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 focus:ring-2 focus:ring-[#C026D3] focus:border-[#C026D3] outline-none transition-all resize-none text-sm bg-card dark:bg-[#030014] text-foreground dark:text-white"
          ></textarea>
          
          {/* 🎯 AI Button added right below the textarea */}
          <div className="mt-3">
            <button
              type="button"
              onClick={handleAutoFillWithAI}
              disabled={isAIFetching || !description}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 text-sm font-bold bg-gradient-to-r from-purple-600 to-[#C026D3] text-white rounded-xl shadow-md hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isAIFetching ? (
                <span className="animate-pulse">🧠 AI is analyzing...</span>
              ) : (
                '✨ Auto-select Category & Priority'
              )}
            </button>
            <p className="text-[11px] text-gray-500 mt-1.5 ml-1">
              Write your issue in detail and let AI automatically select the appropriate category and priority.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-4 bg-gradient-to-r from-[#4C1D95] to-[#7E22CE] text-white"
          isLoading={isSubmitting}
        >
          {(priority as string) === 'EMERGENCY' ? 'Continue to Payment' : 'Submit Complaint'}
        </Button>
      </form>

      {showPaymentModal && pendingComplaintId && (
        <PaymentMethodModal complaintId={pendingComplaintId} onClose={handleModalClose} />
      )}
    </div>
  );
};