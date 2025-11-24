import { Request, Response, NextFunction } from 'express';
import { VoteService } from './vote.service';
import { MESSAGES, HTTP_STATUS } from '../shared/constants';
import { VOTE_MESSAGES, VOTE_STATUS_CODES } from './constants';

export class VoteController {
  private voteService: VoteService;

  constructor() {
    this.voteService = new VoteService();
  }

  createVote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, country } = req.body;

      const vote = await this.voteService.createVote({ name, email, country });

      res.status(VOTE_STATUS_CODES.CREATED).json({
        success: true,
        message: VOTE_MESSAGES.VOTE_CREATED_SUCCESS,
        data: vote
      });
    } catch (error) {
      next(error);
    }
  };

  getTotalVotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const total = await this.voteService.getTotalVotes();

      res.status(VOTE_STATUS_CODES.OK).json({
        success: true,
        data: { total }
      });
    } catch (error) {
      next(error);
    }
  };
}
