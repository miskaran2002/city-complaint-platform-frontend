// components/auth/DemoLogin.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';

export const DemoLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = async (role: 'CITY_ADMIN' | 'DEPARTMENT_MANAGER' | 'DEPARTMENT_STAFF' | 'TECHNICIAN' | 'CITIZEN') => {
    setIsLoading(true);
    let demoEmail = '';
    const demoPassword = '123456'; 

    if (role === 'CITY_ADMIN') demoEmail = 'admin@cityservice.com';
    else if (role === 'DEPARTMENT_MANAGER') demoEmail = 'tanvir@gmail.com'; 
    else if (role === 'DEPARTMENT_STAFF') demoEmail = 'staff.pwd@cityservice.com';
    else if (role === 'TECHNICIAN') demoEmail = 'rimon@gmail.com'; 
    else if (role === 'CITIZEN') demoEmail = 'miraz@gmail.com'; 

    try {
      // originally, you can use the loginUser function to perform the demo login
      const response = await loginUser({ email: demoEmail, password: demoPassword });
      
      if (response.success && response.data) {
        const actualToken = response.data.token || response.data.accessToken;
        
        if (actualToken) {
          localStorage.setItem('city_auth_token', actualToken);
        }

        // originally, you can use the loginUser function to perform the demo login
        setAuth(response.data.user, actualToken!);
        
        // redirect based on role
        const userRole = response.data.user.role;
        if (userRole === 'CITIZEN') router.push('/citizen/dashboard');
        else if (userRole === 'CITY_ADMIN' || userRole === 'DEPARTMENT_MANAGER') router.push('/admin/dashboard');
        else router.push('/staff/dashboard');
      }
    } catch (error) {
      console.error('Demo login failed', error);
      alert('Demo login failed. Please check if backend is running and seed data is up to date.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3 mt-6">
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">OR</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <p className="text-center text-sm font-bold text-gray-700">🚀 Quick Demo Login</p>
      
      <div className="grid grid-cols-2 gap-3">
        <button 
          type="button"
          onClick={() => handleDemoLogin('CITY_ADMIN')}
          disabled={isLoading}
          className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-semibold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <span>👑</span> Admin
        </button>

        <button 
          type="button"
          onClick={() => handleDemoLogin('DEPARTMENT_MANAGER')}
          disabled={isLoading}
          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <span>🏢</span> Manager
        </button>

        <button 
          type="button"
          onClick={() => handleDemoLogin('DEPARTMENT_STAFF')}
          disabled={isLoading}
          className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <span>📝</span> Staff
        </button>

        <button 
          type="button"
          onClick={() => handleDemoLogin('TECHNICIAN')}
          disabled={isLoading}
          className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-semibold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <span>🔧</span> Technician
        </button>
      </div>
      
      <button 
        type="button"
        onClick={() => handleDemoLogin('CITIZEN')}
        disabled={isLoading}
        className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
      >
        <span>👤</span> Citizen
      </button>
    </div>
  );
};