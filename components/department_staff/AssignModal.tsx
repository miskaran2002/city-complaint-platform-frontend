'use client';

import apiClient from '@/lib/axios';
import React, { useState, useEffect } from 'react';


interface AssignModalProps {
  complaintId: string;
  departmentId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssignModal = ({ complaintId, departmentId, isOpen, onClose, onSuccess }: AssignModalProps) => {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [selectedTech, setSelectedTech] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchTechnicians();
    }
  }, [isOpen]);

  const fetchTechnicians = async () => {
    try {
      // ⚠️ এখন ব্যাকএন্ড থেকে স্টাফদের জন্য ডিপার্টমেন্ট ফিল্টার করা /admin/users রাউট কল করা হচ্ছে
      const res = await apiClient.get('/admin/users?role=TECHNICIAN');
      if (res.data && res.data.success) {
        const users = Array.isArray(res.data.data) 
          ? res.data.data 
          : (res.data.data?.users || []);
        
        // ডাবল চেক করার জন্য ডিপার্টমেন্ট আইডি দিয়ে ফিল্টার করা
        const techList = users.filter((u: any) => 
          u.departmentId === departmentId || u.department?.id === departmentId
        );

        setTechnicians(techList);
      }
    } catch (err: any) {
      console.error('Failed to fetch technicians', err);
      setError('Could not load technicians.');
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTech) {
      setError('Please select a technician.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await apiClient.post(`/complaints/${complaintId}/assign`, {
        complaintId,
        technicianId: selectedTech,
        notes,
      });

      if (res.data && res.data.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to assign complaint.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl max-w-md w-full p-6 shadow-xl">
        <h3 className="text-xl font-bold text-foreground mb-4">Assign Technician to Complaint</h3>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">{error}</div>}

        <form onSubmit={handleAssign} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available Technicians</label>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C026D3] outline-none text-sm bg-card"
              required
            >
              <option value="">-- Select Department Technician --</option>
              {technicians.length === 0 ? (
                <option disabled value="">No technicians found for this department</option>
              ) : (
                technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name} ({tech.email})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add urgent instructions or visit notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C026D3] outline-none text-sm"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-background"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#7E22CE] text-white rounded-lg text-sm font-medium hover:bg-[#6b1cb0] disabled:opacity-50"
            >
              {isLoading ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};