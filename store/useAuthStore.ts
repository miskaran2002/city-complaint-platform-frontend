// store/useAuthStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/user';
import { AUTH_TOKEN_KEY } from '@/lib/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (user: User, token: string) => void;
  updateUser: (user: Partial<User>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Called upon successful login/register
      setAuth: (user, token) => {
        // Save token specifically for our Axios interceptor
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_TOKEN_KEY, token);
        }
        set({ user, token, isAuthenticated: true });
      },

      // Useful for updating profile info (e.g., changing name/image)
      updateUser: (updatedData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : null,
        })),

      // Called upon logout or token expiration
      clearAuth: () => {
        // Remove token so Axios interceptor stops sending it
        if (typeof window !== 'undefined') {
          localStorage.removeItem(AUTH_TOKEN_KEY);
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // The key used in localStorage by Zustand
      storage: createJSONStorage(() => localStorage),
    }
  )
);