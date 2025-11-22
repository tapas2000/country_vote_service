import { Router } from 'express';
import { VoteController } from './vote.controller';
import { validateVote } from './vote.validation';

const router = Router();
const voteController = new VoteController();

// POST /votes - Create a new vote
router.post('/votes', validateVote, voteController.createVote);

// GET /votes/total - Get total vote count
router.get('/votes/total', voteController.getTotalVotes);

export default router;
