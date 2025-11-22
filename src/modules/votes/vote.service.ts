import { Vote } from './vote.model';
import { CreateVoteDto, VoteResponse, VoteCountByCountry } from './vote.types';
import { AppError } from '../shared/middleware/errorHandler';
import { MESSAGES, HTTP_STATUS } from '../shared/constants';

export class VoteService {
  async createVote(data: CreateVoteDto): Promise<VoteResponse> {
    try {
      // Check if email already exists
      const existingVote = await Vote.findOne({ where: { email: data.email } });
      
      if (existingVote) {
        throw new AppError(MESSAGES.EMAIL_ALREADY_VOTED, HTTP_STATUS.CONFLICT);
      }

      // Create new vote
      const vote = await Vote.create({
        name: data.name,
        email: data.email.toLowerCase(),
        country: data.country.toUpperCase()
      });

      return {
        id: vote.id,
        name: vote.name,
        email: vote.email,
        country: vote.country,
        createdAt: vote.createdAt
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      if ((error as any).name === 'SequelizeUniqueConstraintError') {
        throw new AppError(MESSAGES.EMAIL_ALREADY_VOTED, HTTP_STATUS.CONFLICT);
      }
      
      throw new AppError(MESSAGES.FAILED_TO_CREATE_VOTE, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async getVoteCountByCountry(limit: number = 10): Promise<VoteCountByCountry[]> {
    try {
      const result = await Vote.findAll({
        attributes: [
          'country',
          [Vote.sequelize!.fn('COUNT', Vote.sequelize!.col('country')), 'votes']
        ],
        group: ['country'],
        order: [[Vote.sequelize!.fn('COUNT', Vote.sequelize!.col('country')), 'DESC']],
        limit,
        raw: true
      });

      return result as any;
    } catch (error) {
      throw new AppError(MESSAGES.FAILED_TO_GET_VOTE_COUNTS, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async getTotalVotes(): Promise<number> {
    try {
      return await Vote.count();
    } catch (error) {
      throw new AppError(MESSAGES.FAILED_TO_GET_TOTAL_VOTES, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteAllVotes(): Promise<void> {
    try {
      await Vote.destroy({ where: {}, truncate: true });
    } catch (error) {
      throw new AppError(MESSAGES.FAILED_TO_DELETE_VOTES, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}
