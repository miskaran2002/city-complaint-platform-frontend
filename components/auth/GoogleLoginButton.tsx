// components/auth/GoogleLoginButton.tsx
'use client';

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { googleLogin } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast'; 

export const GoogleLoginButton = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  // 🔴 dashboard link
  const getDashboardLink = (role?: string) => {
    switch (role) {
      case 'CITIZEN': return '/citizen/dashboard';
      case 'TECHNICIAN': return '/technician/dashboard';
      case 'DEPARTMENT_STAFF': return '/staff/dashboard';
      case 'DEPARTMENT_MANAGER': return '/manager/dashboard';
      case 'CITY_ADMIN': return '/admin/dashboard';
      default: return '/dashboard';
    }
  };

  return (
    <div className="mt-4 flex justify-center w-full">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            // credentialResponse.credential contains the idToken received from Google OAuth
            const token = credentialResponse.credential;
            
            if (!token) return;

            // request to backend with the idToken received from Google
            const response = await googleLogin({ idToken: token });
            
            if (response.success && response.data) {
              const actualToken = response.data.token || response.data.accessToken;
              
              // 🔴 save the local stroage
              if (actualToken) {
                localStorage.setItem('city_auth_token', actualToken);
              }

              // Save user and token in global state
              setAuth(response.data.user, actualToken as string);
              
              
              toast.success('Google login successful!');

              // 🔴 dashboard redirect
              const dashboardLink = getDashboardLink(response.data.user.role);
              router.push(dashboardLink);
            }
          } catch (error: any) {
            console.error('Google login error:', error);
            const errorMessage = error.response?.data?.message || 'Google login failed.';
            toast.error(errorMessage); // 🔴 error toast
          }
        }}
        onError={() => {
          console.error('Google Login Failed');
          toast.error('Failed to connect to Google.');
        }}
      />
    </div>
  );
};