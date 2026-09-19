// app/(auth)/register/page.tsx
import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';

export default function RegisterPage() {
  return (
    <Card>
      <div className="mb-6 text-center">
        <h3 className="text-xl font-semibold text-gray-800">Create an Account</h3>
        <p className="text-sm text-gray-500 mt-1">Join the Smart City Portal as a Citizen</p>
      </div>

      <RegisterForm />

      <div className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
          Sign in here
        </Link>
      </div>
       <GoogleLoginButton />
    </Card>
  );
}