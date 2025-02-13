import { Request, Response } from "express";
import Game from "../models/Game";
import { generateEquation } from "../utils/equationGenerator";
import mongoose from "mongoose";

//1- Start a New Game (POST /game/start)
export const startGame = async (req: Request, res: Response): Promise<Response> => {
  const { name, difficulty } = req.body;
  if (!name || !difficulty) {
   return res.status(400).json({ error: "Missing parameters ):" });
   
  }

  try {
    const equation = generateEquation(difficulty);
    const game = new Game({
      name,
      difficulty,
      currentQuestion: {
        ...equation,
        startTime: new Date(),
      },
    });
    await game.save();

   return res.status(201).json({
      message: `Hello ${name}, find your submit API URL below`,
      submit_url: `/game/${game._id}/submit`,
      question: equation.equation,
      time_started: game.currentQuestion.startTime,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

//================================================================
//2- Submit an Answer (POST /game/{game_id}/submit)
export const submitAnswer = async (req: Request, res: Response): Promise<Response> => {
  const { game_id } = req.params;
  const { answer } = req.body;

  if (!mongoose.Types.ObjectId.isValid(game_id)) {
    return res.status(400).json({ error: "Invalid game ID ):" });
    
  }

  if (!answer) {
    return res.status(400).json({ error: "Missing answer" });
    
  }

  try {
    const game = await Game.findById(game_id);
    if (!game) {
     return res.status(404).json({ error: "Game not found ):" });
      
    }

    // Calculate time taken and check if correct
    const timeTaken =
      (new Date().getTime() - game.currentQuestion.startTime.getTime()) / 1000;
    const isCorrect = Math.abs(answer - game.currentQuestion.answer) < 0.001;

    // Push to history
    game.history.push({
      equation: game.currentQuestion.equation,
      userAnswer: answer,
      correctAnswer: game.currentQuestion.answer,
      timeTaken,
      isCorrect,
    });

    // Update score
    if (isCorrect) {
      game.correctAnswers++;
    }
    game.totalQuestions++;

    // Generate new Equation
    const newEquation = generateEquation(game.difficulty);
    game.currentQuestion = {
      ...newEquation,
      startTime: new Date(),
    };

    await game.save();

    return res.json({
     result: isCorrect ? `Good job ${game.name}!` : `Sorry ${game.name}.`,
     time_taken: timeTaken,
     current_score: game.correctAnswers / game.totalQuestions,
     history: game.history,
     question: newEquation.equation,
   });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

//================================================================
//3- Get Game Status (GET /game/{game_id}/status)
export const getGameStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { game_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(game_id)) {
    return res.status(400).json({ error: "Invalid game ID ):" });
    
  }

  //calculate the total time spent on all questions
  try {
    const game = await Game.findById(game_id);
    if (!game) {
      return res.status(404).json({ error: "Game not found ):" });
      
    }

    const total_time_spent = game.history.reduce(
      (acc, curr) => acc + curr.timeTaken,
      0
    );

    return res.json({
      name: game.name,
      difficulty: game.difficulty,
      current_score:
        game.totalQuestions === 0
          ? 0
          : game.correctAnswers / game.totalQuestions,
      total_time_spent,
      history: game.history,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
