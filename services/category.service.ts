
import apiClient from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { Category } from '@/types/category';

export interface CreateCategoryPayload {
  name: string;
  departmentId: string;
  description?: string;
}

export const createCategory = async (data: CreateCategoryPayload): Promise<ApiResponse<Category>> => {
  const response = await apiClient.post<ApiResponse<Category>>('/categories', data);
  return response.data;
};

export const getAllCategories = async (): Promise<ApiResponse<Category[]>> => {
  const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
  return response.data;
};