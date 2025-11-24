export const APP_MESSAGES = {
  SERVER_RUNNING: 'Server is running',
  ROUTE_NOT_FOUND: 'Route not found',
  INTERNAL_SERVER_ERROR: 'Internal Server Error'
} as const;

export const APP_STATUS_CODES = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;
