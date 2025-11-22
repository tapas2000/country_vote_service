import { Request, Response, NextFunction } from 'express';
import { VoteService } from './vote.service';
import { MESSAGES, HTTP_STATUS } from '../shared/constants';

export class VoteController {
  private voteService: VoteService;

  constructor() {
    this.voteService = new VoteService();
  }

  createVote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, country } = req.body;

      const vote = await this.voteService.createVote({ name, email, country });

      res.status(201).json({
        success: true,
        message: 'Vote created successfully',
        data: vote
      });
    } catch (error) {
      next(error);
    }
  };

  getTotalVotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const total = await this.voteService.getTotalVotes();

      res.status(200).json({
        success: true,
        data: { total }
      });
    } catch (error) {
      next(error);
    }
  };
}
