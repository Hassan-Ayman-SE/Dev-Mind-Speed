import express from "express";
import helmet from "helmet";
import cors from "cors";
import gameRouter from "./routes/game";
import { apiLimiter } from "./middlewares/rateLimiter";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

//My Routes
app.use("/game", apiLimiter, gameRouter);

//My Custom Error Handler
app.use(errorHandler);

export default app;
