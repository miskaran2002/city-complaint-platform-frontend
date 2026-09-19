// services/auth.service.ts

import apiClient from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/user';

/**
 * Expected response structure for login/register APIs containing user data and token.
 */
export interface AuthResponse {
  user: User;
  token: string;
}

// ---------------------------------------------------------
// Payload Interfaces
// ---------------------------------------------------------

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  role?: string; 
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface GoogleLoginPayload {
  idToken: string; // The token received from Google OAuth
}

// ---------------------------------------------------------
// API Service Functions
// ---------------------------------------------------------

/**
 * Register a new user
 */
export const registerUser = async (data: RegisterPayload): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
  return response.data;
};

/**
 * Login with email and password
 */
export const loginUser = async (data: LoginPayload): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/sign-in', data);
  return response.data;
};

/**
 * Login using Google OAuth token
 */
export const googleLogin = async (data: GoogleLoginPayload): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/google', data);
  return response.data;
};

/**
 * Fetch the currently authenticated user's profile
 */
export const getMe = async (): Promise<ApiResponse<User>> => {
  const response = await apiClient.get<ApiResponse<User>>('/auth/user-me');
  return response.data;
};

/**
 * Update user profile information (e.g., name, phone, profileImage)
 */
export const updateUser = async (data: Partial<User>): Promise<ApiResponse<User>> => {
  const response = await apiClient.patch<ApiResponse<User>>('/auth/update-user', data);
  return response.data;
};