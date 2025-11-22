import request from 'supertest';
import { app } from '../../../app';
import { Vote } from '../vote.model';

describe('POST /api/votes', () => {
  beforeEach(async () => {
    // Clear database before each test
    await Vote.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    // Clean up database connection
    await Vote.sequelize?.close();
  });

  describe('Success cases', () => {
    it('should create a vote with valid data', async () => {
      const voteData = {
        name: 'John Doe',
        email: 'john@example.com',
        country: 'US',
      };

      const response = await request(app)
        .post('/api/votes')
        .send(voteData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Vote created successfully');
      expect(response.body.data).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
        country: 'US',
      });
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
    });

    it('should create a vote with Alpha-3 country code', async () => {
      const voteData = {
        name: 'Maria Schmidt',
        email: 'maria@example.com',
        country: 'DEU',
      };

      const response = await request(app)
        .post('/api/votes')
        .send(voteData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.country).toBe('DEU');
    });

    it('should trim and normalize input data', async () => {
      const voteData = {
        name: '  John Doe  ',
        email: '  JOHN@EXAMPLE.COM  ',
        country: '  us  ',
      };

      const response = await request(app)
        .post('/api/votes')
        .send(voteData)
        .expect(201);

      expect(response.body.data.name).toBe('John Doe');
      expect(response.body.data.email).toBe('john@example.com');
      expect(response.body.data.country).toBe('US');
    });
  });

  describe('Validation errors', () => {
    it('should return 400 for invalid email format', async () => {
      const voteData = {
        name: 'John Doe',
        email: 'not-an-email',
        country: 'US',
      };

      const response = await request(app)
        .post('/api/votes')
        .send(voteData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].field).toBe('email');
    });

    it('should return 400 for missing name', async () => {
      const voteData = {
        email: 'john@example.com',
        country: 'US',
      };

      const response = await request(app)
        .post('/api/votes')
        .send(voteData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 400 for missing email', async () => {
      const voteData = {
        name: 'John Doe',
        country: 'US',
      };

      const response = await request(app)
        .post('/api/votes')
        .send(voteData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for missing country', async () => {
      const voteData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const response = await request(app)
        .post('/api/votes')
        .send(voteData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for name too short', async () => {
      const voteData = {
        name: 'J',
        email: 'john@example.com',
        country: 'US',
      };

      const response = await request(app)
        .post('/api/votes')
        .send(voteData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for country code too long', async () => {
      const voteData = {
        name: 'John Doe',
        email: 'john@example.com',
        country: 'TOOLONG',
      };

      const response = await request(app)
        .post('/api/votes')
        .send(voteData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Duplicate email', () => {
    it('should return 409 when email already voted', async () => {
      const voteData = {
        name: 'John Doe',
        email: 'john@example.com',
        country: 'US',
      };

      // First vote should succeed
      await request(app)
        .post('/api/votes')
        .send(voteData)
        .expect(201);

      // Second vote with same email should fail
      const response = await request(app)
        .post('/api/votes')
        .send({
          name: 'Jane Smith',
          email: 'john@example.com',
          country: 'CA',
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('already been used to vote');
    });
  });

  describe('Edge cases', () => {
    it('should handle special characters in name', async () => {
      const voteData = {
        name: "John O'Brien-Smith",
        email: 'john@example.com',
        country: 'US',
      };

      const response = await request(app)
        .post('/api/votes')
        .send(voteData)
        .expect(201);

      expect(response.body.data.name).toBe("John O'Brien-Smith");
    });

    it('should handle email with plus sign', async () => {
      const voteData = {
        name: 'John Doe',
        email: 'john+test@example.com',
        country: 'US',
      };

      const response = await request(app)
        .post('/api/votes')
        .send(voteData)
        .expect(201);

      expect(response.body.data.email).toBe('john+test@example.com');
    });
  });
});
