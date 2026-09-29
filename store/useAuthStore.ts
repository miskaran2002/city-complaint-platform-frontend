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
        // Save token specifically for our Axios interceptor & Middleware cookies
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_TOKEN_KEY, token);
          
          // 🍪 Middleware for cookies
          document.cookie = `city_auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
          document.cookie = `user_role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
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
        // Remove token so Axios interceptor stops sending it & clear cookies
        if (typeof window !== 'undefined') {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          
          // 🧹 Clear cookies on logout
          document.cookie = 'city_auth_token=; path=/; max-age=0';
          document.cookie = 'user_role=; path=/; max-age=0';
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