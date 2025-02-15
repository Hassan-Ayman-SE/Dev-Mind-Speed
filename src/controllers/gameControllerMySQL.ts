import { Request, Response, NextFunction, RequestHandler } from "express";
import Game from "../models/GameMySQL";
import { generateEquation } from "../utils/equationGenerator";

//================================================================
// POST /game (Start a new game)
export const startGame: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, difficulty } = req.body;

    if (!name || !difficulty) {
      res.status(400).json({ error: "Missing parameters ):" });
      return;
    }

    const equation = generateEquation(difficulty);

    const game = await Game.create({
      name,
      difficulty,
      currentQuestion: {
        ...equation,
        startTime: new Date(),
      },
    });

    res.status(201).json({
      message: `Hello ${name}, find your submit API URL below`,
      submit_url: `/game/${game.id}/submit`,
      question: equation.equation,
      time_started: game.currentQuestion.startTime,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

let history = [];
//================================================================
// POST /game/:game_id/submit (Submit an answer)
export const submitAnswer: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { game_id } = req.params;
    const { answer } = req.body;

    const game = await Game.findByPk(game_id);

    
    if (!game) {
      res.status(404).json({ error: "Game not found ):" });
      return;
    }

    if (!answer) {
      res.status(400).json({ error: "Missing answer" });
      return;
    }

    const timeTaken =
      (new Date().getTime() -
        new Date(game.currentQuestion.startTime).getTime()) /
      1000;

    const isCorrect = Math.abs(answer - game.currentQuestion.answer) < 0.001;
    
    
    console.log("Before update:", game.history);

    
    history.push({
      equation: game.currentQuestion.equation,
      userAnswer: answer,
      correctAnswer: game.currentQuestion.answer,
      timeTaken,
      isCorrect,
    });
console.log("after push to history", game.history);
    const correctAnswers = isCorrect
      ? game.correctAnswers + 1
      : game.correctAnswers;
    const totalQuestions = game.totalQuestions + 1;

    const newEquation = generateEquation(game.difficulty);

    await game.update({
      history,
      correctAnswers,
      totalQuestions,
      currentQuestion: {
        ...newEquation,
        startTime: new Date(),
      },
    });
    console.log("After update:", game.history);
    
    res.json({
      result: isCorrect ? `Good job ${game.name}!` : `Sorry ${game.name}.`,
      time_taken: timeTaken,
      current_score: correctAnswers / totalQuestions,
      history,
      question: newEquation.equation,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
//================================================================
// GET /game/:game_id/status (Get game status)
export const getGameStatus: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { game_id } = req.params;

    const game = await Game.findByPk(game_id);

    if (!game) {
      res.status(404).json({ error: "Game not found ):" });
      return;
    }

    const total_time_spent = game.history.reduce(
      (acc: number, curr: any) => acc + curr.timeTaken,
      0
    );

    res.json({
      name: game.name,
      difficulty: game.difficulty,
      current_score: game.totalQuestions
        ? game.correctAnswers / game.totalQuestions
        : 0,
      total_time_spent,
      history: game.history,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
