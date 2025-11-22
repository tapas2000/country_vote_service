/**
 * Environment configuration constants
 */
export const ENV = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
  TEST: 'test'
} as const;

/**
 * HTTP Status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

/**
 * Error codes for consistent error handling
 */
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR'
} as const;

/**
 * Error and success messages
 */
export const MESSAGES = {
  // Vote messages
  VOTE_CREATED_SUCCESS: 'Vote created successfully',
  EMAIL_ALREADY_VOTED: 'This email has already been used to vote',
  FAILED_TO_CREATE_VOTE: 'Failed to create vote',
  FAILED_TO_GET_VOTE_COUNTS: 'Failed to get vote counts',
  FAILED_TO_GET_TOTAL_VOTES: 'Failed to get total votes',
  FAILED_TO_DELETE_VOTES: 'Failed to delete votes',
  
  // Country messages
  FAILED_TO_GET_TOP_COUNTRIES: 'Failed to get top countries',
  FAILED_TO_GET_COUNTRY: 'Failed to get country details',
  COUNTRY_NOT_FOUND: 'Country not found',
  
  // Server messages
  SERVER_RUNNING: 'Server is running',
  ROUTE_NOT_FOUND: 'Route not found',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  
  // Validation messages
  INVALID_EMAIL: 'Invalid email format',
  EMAIL_REQUIRED: 'Email is required',
  NAME_REQUIRED: 'Name is required',
  NAME_TOO_SHORT: 'Name must be at least 2 characters',
  NAME_TOO_LONG: 'Name must not exceed 100 characters',
  COUNTRY_REQUIRED: 'Country code is required',
  COUNTRY_INVALID_LENGTH: 'Country code must be 2-3 characters',
  COUNTRY_INVALID_FORMAT: 'Country code must contain only letters'
} as const;

/**
 * API routes
 */
export const API_ROUTES = {
  VOTES: '/votes',
  VOTES_TOTAL: '/votes/total',
  COUNTRIES_TOP: '/countries/top',
  COUNTRIES_BY_CODE: '/countries/:code',
  HEALTH: '/health'
} as const;

/**
 * Default pagination values
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
} as const;
