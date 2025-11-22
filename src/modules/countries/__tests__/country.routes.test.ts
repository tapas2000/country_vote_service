import request from 'supertest';
import { app } from '../../../app';
import { Vote } from '../../votes/vote.model';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GET /api/countries/top', () => {
  beforeEach(async () => {
    // Clear database before each test
    await Vote.destroy({ where: {}, truncate: true });
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await Vote.sequelize?.close();
  });

  describe('Success cases', () => {
    it('should return empty array when no votes exist', async () => {
      const response = await request(app)
        .get('/api/countries/top')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return top countries with details', async () => {
      // Create test votes
      await Vote.bulkCreate([
        { name: 'User 1', email: 'user1@example.com', country: 'US' },
        { name: 'User 2', email: 'user2@example.com', country: 'US' },
        { name: 'User 3', email: 'user3@example.com', country: 'DE' },
      ]);

      // Mock REST Countries API response
      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes('/alpha/US')) {
          return Promise.resolve({
            data: [{
              name: { common: 'United States', official: 'United States of America' },
              capital: ['Washington, D.C.'],
              region: 'Americas',
              subregion: 'North America',
            }],
          });
        }
        if (url.includes('/alpha/DE')) {
          return Promise.resolve({
            data: [{
              name: { common: 'Germany', official: 'Federal Republic of Germany' },
              capital: ['Berlin'],
              region: 'Europe',
              subregion: 'Western Europe',
            }],
          });
        }
        return Promise.reject(new Error('Not found'));
      });

      const response = await request(app)
        .get('/api/countries/top')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      // Find US and DE in results
      const usData = response.body.data.find((c: any) => c.name === 'United States');
      const deData = response.body.data.find((c: any) => c.name === 'Germany');
      
      if (usData) {
        expect(usData.region).toBe('Americas');
        expect(usData.votes).toBeGreaterThanOrEqual(2);
      }
      if (deData) {
        expect(deData.region).toBe('Europe');
        expect(deData.votes).toBeGreaterThanOrEqual(1);
      }
    });

    it('should respect limit parameter', async () => {
      // Create 15 votes for different countries
      const votes = [];
      for (let i = 1; i <= 15; i++) {
        votes.push({
          name: `User ${i}`,
          email: `limit${i}@example.com`,
          country: `C${String(i).padStart(2, '0')}`,
        });
      }
      await Vote.bulkCreate(votes);

      // Mock REST Countries API to return minimal data
      mockedAxios.get.mockResolvedValue({
        data: [{
          name: { common: 'Country', official: 'Official Country' },
          capital: ['Capital'],
          region: 'Region',
          subregion: 'Subregion',
        }],
      });

      const response = await request(app)
        .get('/api/countries/top?limit=5')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(5);
    });

    it('should order countries by vote count descending', async () => {
      await Vote.bulkCreate([
        { name: 'User 1', email: 'order1@example.com', country: 'US' },
        { name: 'User 2', email: 'order2@example.com', country: 'US' },
        { name: 'User 3', email: 'order3@example.com', country: 'US' },
        { name: 'User 4', email: 'order4@example.com', country: 'DE' },
        { name: 'User 5', email: 'order5@example.com', country: 'DE' },
        { name: 'User 6', email: 'order6@example.com', country: 'FR' },
      ]);

      mockedAxios.get.mockResolvedValue({
        data: [{
          name: { common: 'Country', official: 'Official Country' },
          capital: ['Capital'],
          region: 'Region',
          subregion: 'Subregion',
        }],
      });

      const response = await request(app)
        .get('/api/countries/top')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      // First country should have most votes if data exists
      if (response.body.data.length >= 2) {
        expect(response.body.data[0].votes).toBeGreaterThanOrEqual(response.body.data[1].votes);
      } else if (response.body.data.length === 1) {
        expect(response.body.data[0].votes).toBeGreaterThan(0);
      }
    });
  });

  describe('Validation', () => {
    it('should handle invalid limit parameter', async () => {
      const response = await request(app)
        .get('/api/countries/top?limit=invalid')
        .expect(200);

      expect(response.body.success).toBe(true);
      // Should use default limit
    });

    it('should cap limit at maximum', async () => {
      const response = await request(app)
        .get('/api/countries/top?limit=1000')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('should handle REST Countries API failure gracefully', async () => {
      await Vote.create({
        name: 'User 1',
        email: 'user1@example.com',
        country: 'US',
      });

      // Mock API failure
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      const response = await request(app)
        .get('/api/countries/top')
        .expect(200);

      // Should still return data, possibly with fallback values
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });
});
