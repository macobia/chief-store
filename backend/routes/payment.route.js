import express from "express";
import { protectRoute } from '../middleware/auth.middleware.js';
import { afterApprovedOrder, checkOutSuccess, createCheckoutSession } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/checkout-success", protectRoute, checkOutSuccess);
router.post("/:orderId/after-approve", protectRoute, afterApprovedOrder);


export default router