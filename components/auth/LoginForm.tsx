// components/auth/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { loginUser } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast'; 

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
      
        const actualToken = response.data.token || response.data.accessToken;
        
        if (actualToken) {
          localStorage.setItem('city_auth_token', actualToken);
        }

        // Save user and token in global state
        setAuth(response.data.user, actualToken!);
        
        // 🔴 toast message
        toast.success('Login successful!'); 
        
        // Redirect based on role
        const role = response.data.user.role;
        if (role === 'CITIZEN') router.push('/citizen/dashboard'); 
        else if (role === 'CITY_ADMIN' || role === 'DEPARTMENT_MANAGER') router.push('/admin/dashboard'); 
        else router.push('/staff/dashboard'); 
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      toast.error(errorMessage);
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
      
      <Button type="submit" className="w-full mt-4 bg-gradient-to-r from-[#4C1D95] to-[#7E22CE]" isLoading={isLoading}>
        Sign In
      </Button>
    </form>
  );
};