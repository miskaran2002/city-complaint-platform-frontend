// app/(admin)/layout.tsx
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background dark:bg-[#030014] text-foreground dark:text-gray-100 font-sans overflow-hidden transition-colors duration-300">
      
      {/* ⬅️ Left Sidebar (Admin Role) */}
      <Sidebar role="CITY_ADMIN" />

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