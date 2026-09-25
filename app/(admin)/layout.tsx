// app/(admin)/layout.tsx
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* ⬅️ Left Sidebar (Admin Role) */}
      <Sidebar role="ADMIN" />

      {/* ➡️ Right Content Area */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        
        {/* Top Navbar */}
        <Navbar />

        {/* Main Page Content (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}