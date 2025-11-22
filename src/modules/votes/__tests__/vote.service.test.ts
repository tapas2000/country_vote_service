import { VoteService } from '../vote.service';
import { Vote } from '../vote.model';

describe('VoteService', () => {
  let voteService: VoteService;

  beforeAll(() => {
    voteService = new VoteService();
  });

  beforeEach(async () => {
    await Vote.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await Vote.sequelize?.close();
  });

  describe('createVote', () => {
    it('should create a new vote', async () => {
      const voteData = {
        name: 'John Doe',
        email: 'john@example.com',
        country: 'US',
      };

      const vote = await voteService.createVote(voteData);

      expect(vote).toBeDefined();
      expect(vote.name).toBe('John Doe');
      expect(vote.email).toBe('john@example.com');
      expect(vote.country).toBe('US');
      expect(vote.id).toBeDefined();
    });

    it('should throw error for duplicate email', async () => {
      const voteData = {
        name: 'John Doe',
        email: 'john@example.com',
        country: 'US',
      };

      await voteService.createVote(voteData);

      await expect(
        voteService.createVote({
          name: 'Jane Smith',
          email: 'john@example.com',
          country: 'CA',
        })
      ).rejects.toThrow('already been used to vote');
    });
  });

  describe('getVoteCountByCountry', () => {
    it('should return correct vote counts', async () => {
      await Vote.bulkCreate([
        { name: 'User 1', email: 'user1@example.com', country: 'US' },
        { name: 'User 2', email: 'user2@example.com', country: 'US' },
        { name: 'User 3', email: 'user3@example.com', country: 'DE' },
      ]);

      const counts = await voteService.getVoteCountByCountry(10);

      expect(counts).toHaveLength(2);
      expect(counts[0]).toEqual({ country: 'US', votes: 2 });
      expect(counts[1]).toEqual({ country: 'DE', votes: 1 });
    });

    it('should respect limit parameter', async () => {
      await Vote.bulkCreate([
        { name: 'User 1', email: 'user1@example.com', country: 'US' },
        { name: 'User 2', email: 'user2@example.com', country: 'DE' },
        { name: 'User 3', email: 'user3@example.com', country: 'FR' },
      ]);

      const counts = await voteService.getVoteCountByCountry(2);

      expect(counts).toHaveLength(2);
    });

    it('should return empty array when no votes', async () => {
      const counts = await voteService.getVoteCountByCountry(10);
      expect(counts).toEqual([]);
    });
  });

  describe('getTotalVotes', () => {
    it('should return correct total count', async () => {
      await Vote.bulkCreate([
        { name: 'User 1', email: 'user1@example.com', country: 'US' },
        { name: 'User 2', email: 'user2@example.com', country: 'DE' },
        { name: 'User 3', email: 'user3@example.com', country: 'FR' },
      ]);

      const total = await voteService.getTotalVotes();
      expect(total).toBe(3);
    });

    it('should return 0 when no votes', async () => {
      const total = await voteService.getTotalVotes();
      expect(total).toBe(0);
    });
  });
});
