export interface CountryDetails {
  name: string;
  officialName: string;
  cca2: string;
  cca3: string;
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
  cca2: string;
  cca3: string;
  capital?: string[];
  region: string;
  subregion?: string;
}
