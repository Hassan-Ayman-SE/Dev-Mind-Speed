import { Router } from 'express';
import {
  startGame,
  submitAnswer,
  getGameStatus,
} from '../controllers/gameController';

const router = Router();

// Start a new game
router.post('/start', startGame);

// Submit an answer
router.post('/:game_id/submit', submitAnswer);

// Get game status
router.get('/:game_id/status', getGameStatus);

export default router;
