import rateLimit from "express-rate-limit";

// Rate limiter middleware
export const apiLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 100,
  message: "Too many requests, please try again later.",
});
