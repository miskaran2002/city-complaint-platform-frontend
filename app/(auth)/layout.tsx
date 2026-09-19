// app/(auth)/layout.tsx
import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* অপশনাল: আপনি চাইলে এখানে আপনার প্রজেক্টের লোগো দিতে পারেন */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Smart City Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Citizen Complaint & Service Request Platform
          </p>
        </div>
        
        {/* এই children এর ভেতরে login বা register পেজ রেন্ডার হবে */}
        {children}
      </div>
    </div>
  );
}