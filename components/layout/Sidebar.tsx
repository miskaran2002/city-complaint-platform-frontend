'use client';

import React from 'react';
import Link from 'next/link';
// 1. useRouter import { usePathname, useRouter } from 'next/navigation';
import { usePathname, useRouter } from 'next/navigation';
// 2. Zustand import { useAuthStore } from '@/store/useAuthStore';
import { useAuthStore } from '@/store/useAuthStore';

type UserRole = 'CITIZEN' | 'DEPARTMENT_STAFF' | 'TECHNICIAN' | 'DEPARTMENT_MANAGER' | 'CITY_ADMIN';

interface SidebarProps {
  role: UserRole;
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter(); // router instance for navigation
  // 3. logout function
  const handleLogout = () => {
    // local stroage remove token
    localStorage.removeItem('city_auth_token');

    // Zustand state reset
    const clearAuth = (useAuthStore.getState() as any).clearAuth;
    if (clearAuth) {
      clearAuth();
    } else {
      // clearautyh function not found, manually reset state
      useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
    }

    // Redirect to login page
    router.push('/login');
  };

  const navLinks: Record<UserRole, { name: string; path: string; icon: string }[]> = {
    CITIZEN: [
      { name: 'My Dashboard', path: '/citizen/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { name: 'My Complaints', path: '/citizen/complaints', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { name: 'My Profile', path: '/citizen/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    ],
    TECHNICIAN: [
      { name: 'Field Dashboard', path: '/technician/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { name: 'My Tasks', path: '/technician/tasks', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
      { name: 'My Profile', path: '/technician/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0z' },
    ],
    DEPARTMENT_STAFF: [
      { name: 'Staff Dashboard', path: '/staff/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3' },
      { name: 'Assigned Complaints', path: '/staff/complaints', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
      { name: 'My Profile', path: '/staff/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0z' },
    ],
    DEPARTMENT_MANAGER: [
      { name: 'Manager Overview', path: '/manager/dashboard', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
      { name: 'Staff Management', path: '/manager/staff', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
      { name: 'Department Reports', path: '/manager/reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { name: 'My Profile', path: '/manager/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0z' },
    ],
    CITY_ADMIN: [
      { name: 'City Overview', path: '/admin/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { name: 'Departments', path: '/admin/departments', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
      { name: 'Categories', path: '/admin/categories', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
      { name: 'System Users', path: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
      { name: 'Assigned Complaints', path: '/admin/complaints', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
      { name: 'Staff Management', path: '/admin/staff', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' }, 
      {name: 'Citizen Management',path: '/admin/citizens',icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'},
      { name: 'Admin Profile', path: '/admin/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0z' },
    ]
  };
  const links = navLinks[role] || navLinks.CITIZEN;

  return (
    <aside className="w-72 bg-[#1E1B4B] text-white flex flex-col h-screen sticky top-0 shadow-2xl">

      {/* Branding / Logo */}
      <div className="h-16 flex items-center px-8 border-b border-white/10 bg-[#1E1B4B]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#C026D3] animate-pulse mr-3 shadow-[0_0_10px_#C026D3]"></span>
        <span className="font-extrabold text-xl tracking-wide text-purple-50">Smart City</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <div className="px-4 pb-2 text-xs font-semibold text-purple-300/50 uppercase tracking-wider">
          {role} MENU
        </div>

        {links.map((link) => {
          const isActive = pathname.startsWith(link.path);
          return (
            <Link
              key={link.name}
              href={link.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive
                  ? 'bg-gradient-to-r from-[#4C1D95] to-[#7E22CE] text-white shadow-lg border border-[#7E22CE]/50'
                  : 'text-purple-200 hover:bg-white/5 hover:text-white'
                }`}
            >
              <svg className={`w-5 h-5 ${isActive ? 'text-[#C026D3]' : 'text-purple-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
              </svg>
              <span className="font-medium text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button (4. onClick add event) */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl text-purple-200 hover:bg-red-500/10 hover:text-red-400 transition-colors group"
        >
          <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}