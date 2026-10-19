// components/complaints/ComplaintForm.tsx
'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Category } from '@/types/category';
import { Priority } from '@/types/complaint';
import { createComplaint } from '@/services/complaint.service';
import { PaymentMethodModal } from './PaymentMethodModal';
import toast from 'react-hot-toast';

interface ComplaintFormProps {
  categories: Category[];
  onSuccess: () => void;
}

interface DuplicateInfo {
  isDuplicate: boolean;
  matchedComplaintId: string | null;
  matchedTitle: string | null;
  reason: string;
}

export const ComplaintForm = ({ categories, onSuccess }: ComplaintFormProps) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState<Priority | string>('MEDIUM');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAIFetching, setIsAIFetching] = useState(false);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false); // 🔍 duplicate check loading

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [notice, setNotice] = useState('');

  // Payment modal control
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingComplaintId, setPendingComplaintId] = useState<string | null>(null);

  // 🔍 Duplicate-warning modal control
  const [showDuplicateConfirm, setShowDuplicateConfirm] = useState(false);
  const [duplicateInfo, setDuplicateInfo] = useState<DuplicateInfo | null>(null);

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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/categorize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description }),
      });

      const data = await res.json();

      if (data?.success) {
        const { category, priority: aiPriority } = data.data;

        const matchedCategory = categories.find(
          (c) =>
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

  // 🔍 Duplicate check — Gemini-কে জিজ্ঞেস করে একই issue আগে থেকে আছে কিনা
  const checkForDuplicate = async (): Promise<DuplicateInfo | null> => {
    try {
      const token = localStorage.getItem('city_auth_token');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/check-duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description, categoryId, address }),
      });

      const data = await res.json();
      if (data?.success) return data.data as DuplicateInfo;
      return null;
    } catch {
      // duplicate check fail hole submit block kora thik hobe na — silently skip
      return null;
    }
  };

  // Actual submit logic — AGE handleSubmit-e ja chilo, eita সেটাই, শুধু আলাদা ফাংশনে বের করা হয়েছে
  const proceedWithSubmit = async () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || showPaymentModal || isCheckingDuplicate) return;

    if (!categoryId) {
      setError('Please select a category.');
      return;
    }

    setError('');

    // 🔍 Submit করার আগে duplicate check
    setIsCheckingDuplicate(true);
    const dupResult = await checkForDuplicate();
    setIsCheckingDuplicate(false);

    if (dupResult?.isDuplicate) {
      setDuplicateInfo(dupResult);
      setShowDuplicateConfirm(true);
      return; // user confirm না করা পর্যন্ত submit হবে না
    }

    await proceedWithSubmit();
  };

  const handleConfirmDuplicateSubmit = async () => {
    setShowDuplicateConfirm(false);
    await proceedWithSubmit();
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
          isLoading={isSubmitting || isCheckingDuplicate}
        >
          {isCheckingDuplicate
            ? '🔍 Checking for similar complaints...'
            : (priority as string) === 'EMERGENCY'
            ? 'Continue to Payment'
            : 'Submit Complaint'}
        </Button>
      </form>

      {showPaymentModal && pendingComplaintId && (
        <PaymentMethodModal complaintId={pendingComplaintId} onClose={handleModalClose} />
      )}

      {/* 🔍 Duplicate-warning confirmation modal */}
     {showDuplicateConfirm && duplicateInfo && (
  <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4">
    <div className="relative bg-white dark:bg-[#0f0524] rounded-2xl shadow-2xl border border-amber-300/30 max-w-sm w-full p-5">
      <button
        type="button"
        onClick={() => setShowDuplicateConfirm(false)}
        className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 dark:text-white/50 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-lg leading-none"
        aria-label="Close"
      >
        ×
      </button>

      <div className="flex items-start gap-3 pr-5">
        <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center shrink-0 text-xl">
          ⚠️
        </div>
        <div>
          <h3 className="font-bold text-gray-800 dark:text-white text-sm">
            Similar complaint found
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
            AI found an existing open complaint that might be the same issue:
            {' '}
            <span className="font-semibold">"{duplicateInfo.matchedTitle}"</span>.
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 italic">
            {duplicateInfo.reason}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <button
          type="button"
          onClick={() => setShowDuplicateConfirm(false)}
          className="flex-1 px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          Edit my complaint
        </button>
        <button
          type="button"
          onClick={handleConfirmDuplicateSubmit}
          className="flex-1 px-4 py-2 text-sm font-bold rounded-xl bg-gradient-to-r from-[#4C1D95] to-[#7E22CE] text-white hover:opacity-90 transition-opacity"
        >
          Submit anyway
        </button>
      </div>
    </div>
  </div>
)}
</div>
  );
};