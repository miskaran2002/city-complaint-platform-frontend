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
  // timeout: 10000, // Optional: Set a timeout of 10 seconds if needed
});

/**
 * Request Interceptor
 * Automatically attach the Authorization token to every outgoing request if it exists.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Ensure this runs only on the client side (browser)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle global responses and catch common errors like 401 Unauthorized.
 */
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response) {
      const { status } = error.response;

      // If token is invalid or expired (401 Unauthorized)
      if (status === 401) {
        if (typeof window !== 'undefined') {
          // Clear the token from local storage
          localStorage.removeItem(AUTH_TOKEN_KEY);
          
          // Redirect the user to the login page
          // (Avoid redirecting if they are already on the login or register page)
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
            window.location.href = '/login';
          }
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;