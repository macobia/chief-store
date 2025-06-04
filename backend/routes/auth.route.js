import express from "express";

import { login, logout, signup, refreshToken, getProfile, forgotPassword, resetPassword, googleCallback, verifyEmail, resendVerificationCode,} from "../controllers/auth.controller.js";
import { protectRoute } from '../middleware/auth.middleware.js';
import passport from "passport";
import { loginLimiter, forgotPasswordLimiter } from '../middleware/rateLimiter.js';
 
const router = express.Router();

router.post("/signup", signup);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.post("/verifyEmail", verifyEmail);
router.post("/resend-verify-email", resendVerificationCode);

// Redirect to Google
router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
  }));
// Google callback
router.get("/google/callback", passport.authenticate("google", { session: false }), googleCallback);


router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword); 
router.post("/reset-password/:token", resetPassword);          

router.get("/profile", protectRoute, getProfile);


export default router;

