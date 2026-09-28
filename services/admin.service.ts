// services/admin.service.ts
import apiClient from '@/lib/axios';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'CITIZEN' | 'DEPARTMENT_STAFF' | 'TECHNICIAN' | 'DEPARTMENT_MANAGER' | 'CITY_ADMIN';
  createdAt: string;
}

// all users fetch
export const getAllUsers = async () => {
  
  const response = await apiClient.get('/admin/users'); 
  return response.data;
};

// update user role
export const updateUserRole = async (userId: string, role: 'CITIZEN' | 'DEPARTMENT_STAFF' | 'TECHNICIAN' | 'DEPARTMENT_MANAGER' | 'CITY_ADMIN') => {
  // adjust the route according to your backend
  const response = await apiClient.patch(`/admin/users/${userId}/role`, { role });
  return response.data;
};