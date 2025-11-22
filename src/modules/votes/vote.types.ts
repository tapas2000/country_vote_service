export interface CreateVoteDto {
  name: string;
  email: string;
  country: string;
}

export interface VoteResponse {
  id: number;
  name: string;
  email: string;
  country: string;
  createdAt: Date;
}

export interface VoteCountByCountry {
  country: string;
  votes: number;
}
