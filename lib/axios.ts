// lib/axios.ts

import axios from 'axios';
import { API_BASE_URL, AUTH_TOKEN_KEY } from './constants';

/**
 * Create a centralized Axios instance with default configurations.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Automatically attach the Authorization token to every outgoing request if it exists.
 */
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      let token = localStorage.getItem(AUTH_TOKEN_KEY);

      // 1. If token key contains a JSON string (e.g. from Zustand/Redux persist)
      if (token && token.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(token);
          token =
            parsed?.state?.token ||
            parsed?.state?.accessToken ||
            parsed?.state?.user?.token ||
            parsed?.token ||
            null;
        } catch (e) {
          token = null;
        }
      }

      // 2. Fallback: Check 'auth-storage' directly if token is still missing
      if (!token) {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          try {
            const parsed = JSON.parse(authStorage);
            token =
              parsed?.state?.token ||
              parsed?.state?.accessToken ||
              parsed?.state?.user?.token ||
              parsed?.token ||
              null;
          } catch (e) {
            console.error('Error parsing auth-storage:', e);
          }
        }
      }

      // 3. Attach clean JWT token to Authorization header
      if (token && typeof token === 'string' && config.headers) {
        const cleanToken = token.replace(/['"]+/g, '');
        config.headers.Authorization = `Bearer ${cleanToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle global responses and catch common errors like 401 Unauthorized.
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        if (typeof window !== 'undefined') {
          // Clear both potential storage keys to prevent infinite redirect loops
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem('auth-storage');

          if (
            !window.location.pathname.includes('/login') &&
            !window.location.pathname.includes('/register')
          ) {
            window.location.href = '/login';
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;