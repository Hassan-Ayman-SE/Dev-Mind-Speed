import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/sequelize";

interface HistoryEntry {
  equation: string;
  userAnswer: number;
  correctAnswer: number;
  timeTaken: number;
  isCorrect: boolean;
}

class Game extends Model {
  public id!: number;
  public name!: string;
  public difficulty!: number;
  public currentQuestion!: {
    equation: string;
    answer: number;
    startTime: Date;
  };
  public history!: HistoryEntry[];
  public correctAnswers!: number;
  public totalQuestions!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Game.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currentQuestion: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    history: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    correctAnswers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalQuestions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "games",
    timestamps: true,
  }
);

export default Game;
