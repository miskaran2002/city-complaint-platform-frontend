// components/ProtectedRoute.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[]; // Optional: If provided, only these roles can access
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const router = useRouter();
  const { isAuthenticated, role, isMounted } = useAuth();

  useEffect(() => {
    // Wait until Zustand state is hydrated on the client side
    if (!isMounted) return;

    // 1. If not logged in, redirect to login page
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // 2. If logged in but role doesn't match the allowed roles, redirect to unauthorized
    if (allowedRoles && role && !allowedRoles.includes(role as UserRole)) {
      router.push('/unauthorized');
    }
  }, [isMounted, isAuthenticated, role, allowedRoles, router]);

  // Show a simple loading state while checking authentication to prevent hydration UI glitches
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated or not authorized, render nothing (useEffect will handle redirect)
  if (!isAuthenticated || (allowedRoles && role && !allowedRoles.includes(role as UserRole))) {
    return null;
  }

  // If everything is fine, render the actual page content
  return <>{children}</>;
};