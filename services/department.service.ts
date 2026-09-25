
import apiClient from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { Department } from '@/types/department';

export interface CreateDepartmentPayload {
  name: string;
  code: string;
  description?: string;
}

export const createDepartment = async (data: CreateDepartmentPayload): Promise<ApiResponse<Department>> => {
  const response = await apiClient.post<ApiResponse<Department>>('/departments', data);
  return response.data;
};

export const getAllDepartments = async (): Promise<ApiResponse<Department[]>> => {
  const response = await apiClient.get<ApiResponse<Department[]>>('/departments');
  return response.data;
};