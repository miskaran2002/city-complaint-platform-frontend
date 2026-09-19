// lib/constants.ts

import { UserRole } from '@/types/user';

/**
 * Base URL for backend API requests.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * Key used for storing the authentication token in localStorage/cookies.
 */
export const AUTH_TOKEN_KEY = 'city_auth_token';

/**
 * Human-readable labels for user roles to display in the UI.
 * Perfectly matches the backend Prisma enum 'Role'.
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.CITIZEN]: 'Citizen',
  [UserRole.DEPARTMENT_STAFF]: 'Department Staff',
  [UserRole.TECHNICIAN]: 'Technician',
  [UserRole.DEPARTMENT_MANAGER]: 'Department Manager',
  [UserRole.CITY_ADMIN]: 'City Admin',
};

/**
 * Default pagination limit across the platform.
 */
export const DEFAULT_PAGE_LIMIT = 10;