'use client';

import React, { useEffect, useState } from 'react';
import { getMe, UserProfile } from '@/services/user.service';

export default function ProfileView() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMe();
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          setError('Failed to load profile data.');
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Something went wrong while fetching profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="w-10 h-10 border-4 border-[#7E22CE] border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        
        {/* Profile Header Cover (Civic Plum Gradient) */}
        <div className="h-32 bg-gradient-to-r from-[#1E1B4B] via-[#4C1D95] to-[#7E22CE] relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-[#C026D3] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {user?.name.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{user?.name}</h1>
              <p className="text-gray-500 font-medium mt-1">{user?.email}</p>
            </div>
            <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider bg-purple-100 text-[#7E22CE] uppercase">
              {user?.role}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <span className="block text-xs font-semibold text-gray-400 uppercase mb-1">Account ID</span>
              <span className="text-gray-800 font-mono text-sm">{user?.id}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <span className="block text-xs font-semibold text-gray-400 uppercase mb-1">Joined Date</span>
              <span className="text-gray-800 font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                }) : 'N/A'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 border-t border-gray-100 pt-6">
            <button className="bg-[#7E22CE] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#4C1D95] transition-colors shadow-md shadow-purple-500/30">
              Edit Profile
            </button>
            <button className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}