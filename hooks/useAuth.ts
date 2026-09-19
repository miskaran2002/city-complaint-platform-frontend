// hooks/useAuth.ts

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export const useAuth = () => {
  // isMounted state prevents hydration errors in Next.js
  const [isMounted, setIsMounted] = useState(false);
  const authStore = useAuthStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return {
    isMounted,                           // Use this to show a loader while auth state is loading
    user: authStore.user,
    token: authStore.token,
    isAuthenticated: authStore.isAuthenticated,
    role: authStore.user?.role,          // Quick access to the user's role
    setAuth: authStore.setAuth,
    clearAuth: authStore.clearAuth,
    updateUser: authStore.updateUser,
  };
};