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

