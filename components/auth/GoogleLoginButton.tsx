// components/auth/GoogleLoginButton.tsx
'use client';

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { googleLogin } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';

export const GoogleLoginButton = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return (
    <div className="mt-4 flex justify-center w-full">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            // credentialResponse.credential হলো গুগল থেকে পাওয়া JWT (id_token)
            const token = credentialResponse.credential;
            
            if (!token) return;

            // request to backend with the idToken received from Google
            // note: services/auth.service.ts এ GoogleLoginPayload interface idtoken use property 
            // thus we are sending idToken instead of token
            const response = await googleLogin({idToken: token });
            
            if (response.success && response.data) {
              setAuth(response.data.user, response.data.token);
              
              const role = response.data.user.role;
              if (role === 'CITIZEN') router.push('/dashboard');
              else if (role === 'CITY_ADMIN' || role === 'DEPARTMENT_MANAGER') router.push('/dashboard');
              else router.push('/assigned');
            }
          } catch (error: any) {
            console.error('Google login error:', error);
            // backgroound fetching error message from response if available
            alert(error.response?.data?.message || 'Google login failed.');
          }
        }}
        onError={() => {
          console.error('Google Login Failed');
          alert('Failed to connect to Google.');
        }}
      />
    </div>
  );
};