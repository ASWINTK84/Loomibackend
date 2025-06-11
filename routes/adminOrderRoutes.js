import express from "express";
import { getAllOrders, updateOrderStatus } from "../controller/adminOrderController.js";

const router = express.Router();



// GET /api/orders - Admin get all orders
router.get("/", getAllOrders);

// PUT /api/orders/:id - Admin update status
router.put("/:id", updateOrderStatus);

export default router;
