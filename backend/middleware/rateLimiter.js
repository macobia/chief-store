// middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

// Limit login attempts: 5 requests per 15 minutes per IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    error: {
      message: "Too many login attempts. Please try again in 15 minutes.",
    }
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
});

// Limit forgot password requests: 3 per hour
export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    error: {
      message: "Too many password reset requests. Please try again in an hour.",
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});
