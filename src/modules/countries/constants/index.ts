export const COUNTRY_ROUTES = {
  GET_TOP_COUNTRIES: '/countries/top',
  GET_COUNTRY_BY_CODE: '/countries/:code'
} as const;

export const COUNTRY_MESSAGES = {
  COUNTRY_NOT_FOUND: 'Country not found'
} as const;

export const COUNTRY_STATUS_CODES = {
  OK: 200,
  NOT_FOUND: 404
} as const;
