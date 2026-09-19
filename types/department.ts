// types/department.ts

/**
 * Interface representing a Department entity.
 */
export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  createdAt: string;
}

/**
 * Interface representing a Category entity.
 */
export interface Category {
  id: string;
  name: string;
  departmentId: string;
  description?: string | null;
  createdAt: string;
  
  // Optional relations (Populated when joined)
  department?: Department;
}