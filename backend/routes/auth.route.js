import express from "express";

import { login, logout, signup, refreshToken, getProfile, forgotPassword, resetPassword, } from "../controllers/auth.controller.js";
import { protectRoute } from '../middleware/auth.middleware.js';

 
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword); 
router.post("/reset-password/:token", resetPassword);          

router.get("/profile", protectRoute, getProfile);


export default router;

