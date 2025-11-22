export interface CountryDetails {
  name: string;
  officialName: string;
  capital: string[];
  region: string;
  subRegion: string;
  votes: number;
}

export interface RestCountryApiResponse {
  name: {
    common: string;
    official: string;
  };
  capital?: string[];
  region: string;
  subregion?: string;
}
