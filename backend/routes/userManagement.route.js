import express from "express";
import { deleteUser, changeUserRole, trackUserOrders, getUserPurchaseHistory, getUserProfile, updateUserProfile, getAllUsersWithStats} from "../controllers/userManagement.controller.js";
import { adminRoute, protectRoute, superAdminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// ------------------------ Admin Routes ------------------------

//For Admin

router.get("/admin/users-with-stats", protectRoute, adminRoute, getAllUsersWithStats);
router.delete("/admin/users/:userId",  protectRoute, superAdminRoute, deleteUser);
router.patch("/admin/users/:userId/role",  protectRoute, superAdminRoute, changeUserRole);


// ------------------------ User Routes ------------------------
// For users

router.get("/users/orders", protectRoute, trackUserOrders);
router.get("/users/purchase-history", protectRoute, getUserPurchaseHistory);
router.get("/users/profile", protectRoute, getUserProfile);
router.patch("/users/profile", protectRoute, updateUserProfile);


export default router;
