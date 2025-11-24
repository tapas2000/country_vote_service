import axios from 'axios';
import { config } from '../../config/config';
import { VoteService } from '../votes/vote.service';
import { CountryDetails } from './country.types';
import { AppError, cache, MESSAGES, HTTP_STATUS } from '../shared';

export class CountryService {
  private voteService: VoteService;
  private readonly CACHE_TTL = 300; // 5 minutes

  constructor() {
    this.voteService = new VoteService();
  }

  async getTopCountries(limit: number = 10): Promise<CountryDetails[]> {
    try {
      // Get vote counts from database with limit
      const voteCounts = await this.voteService.getVoteCountByCountry(limit);

      if (voteCounts.length === 0) {
        return [];
      }

      // Vote counts are already limited by the service
      const limitedVoteCounts = voteCounts;

      // Fetch country details from REST Countries API with caching
      const countryPromises = limitedVoteCounts.map(async ({ country, votes }) => {
        try {
          // Try to get from cache first
          const cacheKey = `country:${country}`;
          const cachedData = await cache.getOrSet(
            cacheKey,
            async () => {
              const response = await axios.get(
                `${config.restCountriesApi}/alpha/${country}`,
                { timeout: 5000 }
              );
              return response.data[0];
            },
            this.CACHE_TTL
          );

          return {
            name: cachedData.name.common,
            officialName: cachedData.name.official,
            cca2: cachedData.cca2,
            cca3: cachedData.cca3,
            capital: cachedData.capital || [],
            region: cachedData.region,
            subRegion: cachedData.subregion || '',
            votes: Number(votes)
          };
        } catch (error) {
          console.error(`Failed to fetch details for country: ${country}`, error);
          // Return basic info if API call fails
          return {
            name: country,
            officialName: country,
            cca2: country.length === 2 ? country : '',
            cca3: country.length === 3 ? country : '',
            capital: [],
            region: 'Unknown',
            subRegion: 'Unknown',
            votes: Number(votes)
          };
        }
      });

      const countries = await Promise.all(countryPromises);
      return countries;
    } catch (error) {
      throw new AppError(MESSAGES.FAILED_TO_GET_TOP_COUNTRIES, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async getCountryByCode(code: string): Promise<CountryDetails | null> {
    try {
      const cacheKey = `country:${code}`;
      const countryData = await cache.getOrSet(
        cacheKey,
        async () => {
          const response = await axios.get(
            `${config.restCountriesApi}/alpha/${code}`,
            { timeout: 5000 }
          );
          return response.data[0];
        },
        this.CACHE_TTL
      );

      return {
        name: countryData.name.common,
        officialName: countryData.name.official,
        cca2: countryData.cca2,
        cca3: countryData.cca3,
        capital: countryData.capital || [],
        region: countryData.region,
        subRegion: countryData.subregion || '',
        votes: 0
      };
    } catch (error) {
      throw new AppError(MESSAGES.FAILED_TO_GET_COUNTRY, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}
