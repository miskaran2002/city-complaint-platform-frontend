// services/user.service.ts 

import apiClient from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  // Updated Role Enum from Prisma
  role: 'CITIZEN' | 'DEPARTMENT_STAFF' | 'TECHNICIAN' | 'DEPARTMENT_MANAGER' | 'CITY_ADMIN';
  createdAt: string;
}
export const getMe = async (): Promise<ApiResponse<UserProfile>> => {
  
  const response = await apiClient.get<ApiResponse<UserProfile>>('/users/me');
  return response.data;
};


export const updateProfile = async (data: { name: string }) => {
  const response = await apiClient.patch('/users/me', data); 
  return response.data;
};