
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  cancelOrder,
  getAllOrders,
  getUserOrders,
  placeOrder,
  placeCustomOrder,
  requestParcelPickup,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controller/orderController.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Student routes
router.post("/place", authorizeRoles("Student"), placeOrder);
router.post("/custom", authorizeRoles("Student"), placeCustomOrder);
router.post("/parcel-pickup", authorizeRoles("Student"), requestParcelPickup);
router.get("/my-orders", authorizeRoles("Student"), getUserOrders);
router.put("/cancel/:orderId", authorizeRoles("Student"), cancelOrder);

// Admin routes
router.get("/all", authorizeRoles("Admin"), getAllOrders);
router.put("/update/:orderId", authorizeRoles("Admin"), updateOrderStatus);
router.put("/payment/:orderId", authorizeRoles("Admin"), updatePaymentStatus);

export default router;