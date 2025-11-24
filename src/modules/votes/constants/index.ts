export const VOTE_ROUTES = {
  CREATE_VOTE: '/votes',
  GET_TOTAL_VOTES: '/votes/total'
} as const;

export const VOTE_MESSAGES = {
  VOTE_CREATED_SUCCESS: 'Your vote was successfully submitted'
} as const;

export const VOTE_STATUS_CODES = {
  CREATED: 201,
  OK: 200
} as const;
