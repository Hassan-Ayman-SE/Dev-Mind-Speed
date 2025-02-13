import mongoose, { Schema, Document } from 'mongoose';

interface HistoryEntry {
  equation: string;
  userAnswer: number;
  correctAnswer: number;
  timeTaken: number;
  isCorrect: boolean;
}

export interface GameDocument extends Document {
  name: string;
  difficulty: number;
  currentQuestion: {
    equation: string;
    answer: number;
    startTime: Date;
  };
  history: HistoryEntry[];
  correctAnswers: number;
  totalQuestions: number;
}

const GameSchema = new Schema(
  {
    name: { type: String, required: true },
    difficulty: { type: Number, required: true, min: 1, max: 4 },
    currentQuestion: {
      equation: String,
      answer: Number,
      startTime: Date,
    },
    history: [
      {
        equation: String,
        userAnswer: Number,
        correctAnswer: Number,
        timeTaken: Number,
        isCorrect: Boolean,
      },
    ],
    correctAnswers: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Game = mongoose.model<GameDocument>('Game', GameSchema);

export default Game;
