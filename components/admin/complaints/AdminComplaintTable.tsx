'use client';

import apiClient from '@/lib/axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';


interface AdminComplaintTableProps {
  complaints: any[];
  departments: any[];
  users: any[]; // All users (to filter technicians)
}

export const AdminComplaintTable = ({ complaints, departments, users }: AdminComplaintTableProps) => {
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  
  // Modal States
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Assignment States
  const [selectedTechId, setSelectedTechId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Filtering Logic
  const filteredComplaints = complaints.filter(c => {
    const matchDept = selectedDept === 'ALL' || c.departmentId === selectedDept;
    const matchStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    return matchDept && matchStatus;
  });

  const getDeptName = (deptId: string) => {
    const dept = departments.find(d => d.id === deptId);
    return dept ? dept.name : 'Unassigned';
  };

  const handleViewDetails = (complaint: any) => {
    setSelectedComplaint(complaint);
    setSelectedTechId(''); // Reset selection when opening new modal
    setIsModalOpen(true);
  };

  
 // 🔴 Assign Technician API Call 🔴
  const handleAssignTechnician = async () => {
    if (!selectedTechId) {
      toast.error('Please select a technician first!');
      return;
    }

    try {
      setIsAssigning(true);
      
      // Postman er sathe miliye API Route ebong Payload update kora holo
      const res = await apiClient.post(`/complaints/${selectedComplaint.id}/assign`, {
        technicianId: selectedTechId,
        notes: "Assigned to technician from Admin Dashboard", // Backend e notes lagle eta kaje asbe
      });

      if (res.data?.success) {
        toast.success('Technician assigned successfully!');
        // Update local state temporarily to show IN_PROGRESS
        setSelectedComplaint((prev: any) => ({ ...prev, status: 'IN_PROGRESS' }));
      }
    } catch (err: any) {
      console.error('Failed to assign technician', err);
      toast.error(err.response?.data?.message || 'Failed to assign technician.');
    } finally {
      setIsAssigning(false);
    }
  };

  // ঐ স্পেসিফিক ডিপার্টমেন্টের টেকনিশিয়ানদের ফিল্টার করা
  const availableTechnicians = selectedComplaint 
    ? users.filter(u => u.departmentId === selectedComplaint.departmentId && u.role === 'TECHNICIAN')
    : [];

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
      {/* Filters Bar */}
      <div className="border-b border-gray-100 p-4 sm:px-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-background/50">
        <h3 className="text-lg font-bold text-foreground">All City Complaints</h3>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="flex-1 sm:w-48 bg-card border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none font-medium"
          >
            <option value="ALL">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="flex-1 sm:w-40 bg-card border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none font-medium"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-card border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th className="p-4 sm:px-6 py-4">Complaint ID & Title</th>
              <th className="p-4 sm:px-6 py-4">Department</th>
              <th className="p-4 sm:px-6 py-4">Status</th>
              <th className="p-4 sm:px-6 py-4">Date Logged</th>
              <th className="p-4 sm:px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400 text-sm">
                  No complaints found for the selected filters.
                </td>
              </tr>
            ) : (
              filteredComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-background/50 transition-colors">
                  <td className="p-4 sm:px-6 py-4">
                    <p className="text-sm font-bold text-foreground truncate max-w-[250px]">{complaint.title}</p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">#{complaint.id.slice(0, 8)}</p>
                  </td>
                  <td className="p-4 sm:px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">
                      🏢 {getDeptName(complaint.departmentId)}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md uppercase border ${
                      complaint.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      complaint.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      complaint.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-100' :
                      'bg-cardmber-50 text-amber-700 border-amber-100'
                    }`}>
                      {complaint.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 py-4">
                    <span className="text-sm text-gray-600 font-medium">
                      {new Date(complaint.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 py-4 text-right">
                    <button 
                      onClick={() => handleViewDetails(complaint)}
                      className="text-purple-600 hover:text-purple-800 text-sm font-bold transition-colors bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      {isModalOpen && selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b border-gray-100 p-6 flex justify-between items-start z-10">
              <div>
                <h3 className="text-xl font-extrabold text-foreground pr-8">{selectedComplaint.title}</h3>
                <p className="text-sm font-mono text-gray-500 mt-1">ID: {selectedComplaint.id}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 bg-background hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              <div className="flex flex-wrap gap-3">
                <div className="bg-background border border-gray-100 rounded-xl p-3 flex-1 min-w-[150px]">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">Department</p>
                  <p className="text-sm font-bold text-foreground">🏢 {getDeptName(selectedComplaint.departmentId)}</p>
                </div>
                <div className="bg-background border border-gray-100 rounded-xl p-3 flex-1 min-w-[150px]">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">Current Status</p>
                  <span className={`inline-block px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md uppercase border ${
                      selectedComplaint.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      selectedComplaint.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      selectedComplaint.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-100' :
                      'bg-cardmber-50 text-amber-700 border-amber-100'
                    }`}>
                      {selectedComplaint.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="bg-background border border-gray-100 rounded-xl p-3 flex-1 min-w-[150px]">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">Date Logged</p>
                  <p className="text-sm font-bold text-foreground">{new Date(selectedComplaint.createdAt).toLocaleString('en-GB')}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-foreground mb-2 border-b border-gray-100 pb-2">Complaint Description</h4>
                <div className="bg-background p-4 rounded-xl border border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedComplaint.description || 'No description provided.'}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-foreground mb-2 border-b border-gray-100 pb-2">Citizen Information</h4>
                <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center font-extrabold text-lg">
                    {selectedComplaint.citizen?.name?.charAt(0).toUpperCase() || 'C'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{selectedComplaint.citizen?.name || 'Unknown Citizen'}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{selectedComplaint.citizen?.email || 'No email provided'}</p>
                  </div>
                </div>
              </div>

              {/* 🔴 Assign Technician Section 🔴 */}
              {selectedComplaint.status !== 'RESOLVED' && selectedComplaint.status !== 'REJECTED' && (
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <span>🔧</span> Assign Field Technician
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={selectedTechId}
                      onChange={(e) => setSelectedTechId(e.target.value)}
                      className="flex-1 bg-card border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">-- Select a Technician --</option>
                      {availableTechnicians.length === 0 ? (
                         <option value="" disabled>No technicians available in this department</option>
                      ) : (
                        availableTechnicians.map(tech => (
                          <option key={tech.id} value={tech.id}>{tech.name} ({tech.email})</option>
                        ))
                      )}
                    </select>
                    <button
                      onClick={handleAssignTechnician}
                      disabled={!selectedTechId || isAssigning}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all whitespace-nowrap"
                    >
                      {isAssigning ? 'Assigning...' : 'Assign Now'}
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-card border-t border-gray-100 p-4 sm:px-6 flex justify-end gap-3 z-10 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-background transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};