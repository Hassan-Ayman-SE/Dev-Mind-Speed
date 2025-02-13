import { Request, Response, NextFunction } from "express";

// This Middleware to handle errors globally
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong." });
};
