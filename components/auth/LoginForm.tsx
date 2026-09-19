// components/auth/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { loginUser } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';

export const LoginForm = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await loginUser({ email, password });
      
      if (response.success && response.data) {
        // Save user and token in global state & localStorage
        setAuth(response.data.user, response.data.token);
        
        // Redirect based on role
        const role = response.data.user.role;
        if (role === 'CITIZEN') router.push('/dashboard');
        else if (role === 'CITY_ADMIN' || role === 'DEPARTMENT_MANAGER') router.push('/dashboard'); // Admin dashboard
        else router.push('/assigned'); // Staff/Technician
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}
      
      <Input
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        required
      />
      
      <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
        Sign In
      </Button>
    </form>
  );
};