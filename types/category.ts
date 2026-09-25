import { Department } from './department';

export interface Category {
  id: string;
  name: string;
  departmentId: string;
  description?: string | null;
  createdAt: string;
  department?: Department; // Relations
}