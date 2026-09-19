// types/api.ts

/**
 * Generic interface for API responses.
 * @template T - The expected type of the 'data' payload.
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: {
    code: string;
    details?: any; // eslint-disable-next-line @typescript-eslint/no-explicit-any
  };
}