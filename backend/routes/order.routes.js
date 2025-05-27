import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { createOrder, getAllOrders, getOrderStatus, updateOrderStatus } from "../controllers/order.controller.js";

const router = express.Router();

router.get('/admin', protectRoute, adminRoute,  getAllOrders
);
router.patch('/:orderId/status', protectRoute, adminRoute,  updateOrderStatus
);
router.post('/a', protectRoute, createOrder
);

router.get('/:orderId/status', protectRoute, getOrderStatus);




export default router