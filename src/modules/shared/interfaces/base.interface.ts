/**
 * Base Service Interface
 * All service classes should extend this to ensure consistent patterns
 */
export interface IBaseService {
  // Can be extended with common methods
}

/**
 * Base Controller Interface
 * All controller classes should implement this for consistency
 */
export interface IBaseController {
  // Can be extended with common methods
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    code?: string;
  };
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
