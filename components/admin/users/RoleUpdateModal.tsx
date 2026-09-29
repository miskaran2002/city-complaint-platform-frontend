'use client';

import React from 'react';
import { SystemUser } from '@/services/admin.service';
import { Button } from '@/components/ui/Button';

interface RoleUpdateModalProps {
  editingUser: SystemUser | null;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  isUpdating: boolean;
  message: { type: string; text: string };
  onUpdateRole: () => void;
  onClose: () => void;
}

export const RoleUpdateModal: React.FC<RoleUpdateModalProps> = ({
  editingUser,
  selectedRole,
  setSelectedRole,
  isUpdating,
  message,
  onUpdateRole,
  onClose,
}) => {
  if (!editingUser) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="bg-[#1E1B4B] p-5">
          <h3 className="text-xl font-bold text-white">Update User Role</h3>
          <p className="text-purple-200 text-xs mt-1">Assigning a new role to {editingUser.name}</p>
        </div>
        
        <div className="p-6 space-y-5">
          {message.text && (
            <div className={`p-3 text-sm rounded-lg border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select New Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C026D3] focus:border-[#C026D3] outline-none transition-all text-sm font-medium bg-gray-50"
            >
              <option value="CITIZEN">Citizen</option>
              <option value="DEPARTMENT_STAFF">Department Staff</option>
              <option value="TECHNICIAN">Technician</option>
              <option value="DEPARTMENT_MANAGER">Department Manager</option>
              <option value="CITY_ADMIN">City Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              onClick={onUpdateRole} 
              isLoading={isUpdating}
              className="flex-1 bg-[#C026D3] hover:bg-[#a21caf]"
            >
              Save Changes
            </Button>
            <button 
              onClick={onClose}
              disabled={isUpdating}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};