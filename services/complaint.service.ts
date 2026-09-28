// services/complaint.service.ts
import apiClient from '@/lib/axios';

export const getMyComplaints = async () => {
  const response = await apiClient.get('/complaints'); 
  return response.data;
};

export const createComplaint = async (data: {
  title: string;
  description: string;
  categoryId: string;
  departmentId: string;
  address: string;
  priority: string;
  slaHours?: number;
}) => {
  const response = await apiClient.post('/complaints', data);
  return response.data;
};