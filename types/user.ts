// types/user.ts

/**
 * Enum for all possible user roles, matching the backend Prisma schema.
 */
export enum UserRole {
  CITIZEN = 'CITIZEN',
  DEPARTMENT_STAFF = 'DEPARTMENT_STAFF',
  TECHNICIAN = 'TECHNICIAN',
  DEPARTMENT_MANAGER = 'DEPARTMENT_MANAGER',
  CITY_ADMIN = 'CITY_ADMIN'
}

/**
 * Interface representing a User entity.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  // password is omitted because we usually don't send it to the frontend
  role: UserRole;
  provider: string; // 'credentials', 'google', etc.
  googleId?: string | null;
  departmentId?: string | null;
  isDeleted: boolean;
  createdAt: string; // ISO date string from API
  updatedAt: string;
}