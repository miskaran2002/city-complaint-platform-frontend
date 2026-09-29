'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { registerUser } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';

export const RegisterForm = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await registerUser({ name, email, password, role: 'CITIZEN' });
      
      // ⚠️ ডিবাগ করার জন্য রেসপন্স লগ করা হলো
      console.log('Registration Response:', response);

      // আপনার ব্যাকএন্ডের রেসপন্স অনুযায়ী কন্ডিশন আপডেট করা হলো
      // কিছু ব্যাকএন্ড সরাসরি ডেটা পাঠায়, আবার কিছু success প্রপার্টি সহ পাঠায়
      const data = response.data || response; 
      
      // টোকেনটি বের করা
      const actualToken = data.token || data.accessToken || (response as any).token || (response as any).accessToken;
      const user = data.user || (response as any).user;

      if (actualToken && user) {
        // ১. স্টেট এবং কুকিতে টোকেন সেভ
        setAuth(user, actualToken);
        
        // ২. রিডাইরেক্ট করা
        router.push('/citizen/dashboard');
      } else {
        // যদি রেসপন্সে টোকেন না থাকে, তার মানে রেজিস্ট্রেশন হয়েছে কিন্তু লগইন হয়নি
        console.warn('No token received after registration. Redirecting to login.');
        router.push('/login?registered=true');
      }

    } catch (err: any) {
      console.error('Registration Error:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100 font-medium">{error}</div>}
      
      <Input
        label="Full Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="John Doe"
        required
      />
      <Input
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="john@example.com"
        required
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Create a strong password"
        required
      />
      
      <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
        Create Account
      </Button>
    </form>
  );
};