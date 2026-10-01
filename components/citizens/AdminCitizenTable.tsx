'use client';

import apiClient from '@/lib/axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';


interface AdminCitizenTableProps {
  citizens: any[];
  onStatusUpdated?: () => void;
}

export const AdminCitizenTable = ({ citizens, onStatusUpdated }: AdminCitizenTableProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  
  // Modal States
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Filtering Logic
  const filteredCitizens = citizens.filter(c => {
    if (selectedStatus === 'ALL') return true;
    if (selectedStatus === 'ACTIVE') return c.isBanned === false;
    if (selectedStatus === 'BANNED') return c.isBanned === true;
    return true;
  });

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Ban/Unban API Call
  const handleToggleBan = async (userId: string, currentStatus: boolean) => {
    try {
      setIsUpdating(true);
      const res = await apiClient.patch(`/admin/users/${userId}/status`);
      
      if (res.data?.success) {
        toast.success(res.data.message || 'Citizen status updated successfully!');
        
        // Update local modal state
        const newBannedStatus = res.data.data?.isBanned ?? !currentStatus;
        setSelectedUser((prev: any) => ({ ...prev, isBanned: newBannedStatus }));
        
        // Refresh parent data
        if (onStatusUpdated) onStatusUpdated();
      }
    } catch (err: any) {
      console.error('Failed to update status', err);
      toast.error(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Filters Bar */}
      <div className="border-b border-gray-100 p-4 sm:px-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-900">Registered Citizens</h3>
        
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full sm:w-48 bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-2 outline-none font-medium focus:ring-2 focus:ring-purple-500"
        >
          <option value="ALL">All Accounts</option>
          <option value="ACTIVE">Active Only</option>
          <option value="BANNED">Banned Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th className="p-4 sm:px-6 py-4">Citizen Info</th>
              <th className="p-4 sm:px-6 py-4">Joined Date</th>
              <th className="p-4 sm:px-6 py-4">Account Status</th>
              <th className="p-4 sm:px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredCitizens.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400 text-sm">
                  No citizens found.
                </td>
              </tr>
            ) : (
              filteredCitizens.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 sm:px-6 py-4">
                    <span className="text-sm text-gray-600 font-medium">
                      {new Date(user.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md uppercase ${
                      user.isBanned ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {user.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 py-4 text-right">
                    <button 
                      onClick={() => handleViewDetails(user)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-bold transition-colors bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-lg font-extrabold text-gray-900">Citizen Profile</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg font-bold">✕</button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-xl">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900">{selectedUser.name}</h4>
                  <p className="text-xs text-gray-500">{selectedUser.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold tracking-wider bg-blue-50 text-blue-700 rounded uppercase">
                    CITIZEN
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-500">Account Status:</span>
                  <span className={`font-bold ${selectedUser.isBanned ? 'text-red-600' : 'text-emerald-600'}`}>
                    {selectedUser.isBanned ? 'Banned' : 'Active'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-500">Joined Date:</span>
                  <span>{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-500">User ID:</span>
                  <span className="font-mono text-xs">{selectedUser.id.slice(0, 10)}...</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleToggleBan(selectedUser.id, selectedUser.isBanned)}
                className={`px-4 py-2 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-50 ${
                  selectedUser.isBanned 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isUpdating ? 'Processing...' : (selectedUser.isBanned ? 'Unban Account' : 'Ban Account')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};