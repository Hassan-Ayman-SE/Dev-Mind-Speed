import { Router } from "express";
import {
  startGame,
  submitAnswer,
  getGameStatus,
} from "../controllers/gameControllerMySQL";

const router = Router();

router.post("/start", startGame);
router.post("/:game_id/submit", submitAnswer);
router.get("/:game_id/status", getGameStatus);

export default router;
