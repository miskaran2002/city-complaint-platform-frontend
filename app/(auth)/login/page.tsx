// app/(auth)/login/page.tsx
import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { LoginForm } from '@/components/auth/LoginForm';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';


export default function LoginPage() {
  return (
    <Card>
      <div className="mb-6 text-center">
        <h3 className="text-xl font-semibold text-gray-800">Welcome Back</h3>
        <p className="text-sm text-gray-500 mt-1">Please sign in to your account</p>
      </div>

      <LoginForm />

      <div className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/register" className="font-medium text-purple-600 hover:text-purple-400 transition-colors">
          Create one now
        </Link>
      </div>
      <GoogleLoginButton />
    </Card>
  );
}