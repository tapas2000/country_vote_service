import { Router } from 'express';
import { VoteController } from './vote.controller';
import { validateVote } from './vote.validation';
import { VOTE_ROUTES } from './constants';

const router = Router();
const voteController = new VoteController();

// POST /votes - Create a new vote
router.post(VOTE_ROUTES.CREATE_VOTE, validateVote, voteController.createVote);

// GET /votes/total - Get total vote count
router.get(VOTE_ROUTES.GET_TOTAL_VOTES, voteController.getTotalVotes);

export default router;
