// app/(citizen)/profile/page.tsx
import React from 'react';
import ProfileView from '@/components/profile/ProfileView';

export default function CitizenProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        <p className="text-gray-500 text-sm">Manage your personal information and settings.</p>
      </div>
      
      {/* Shared Profile Component */}
      <ProfileView />
    </div>
  );
}