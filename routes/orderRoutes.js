import express from "express";
import { createRazorpayOrder, getUserOrders, placeOrder } from "../controller/orderController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
const router = express.Router();

// POST /api/orders/razorpay-order
router.post("/razorpay-order" , createRazorpayOrder);

// POST /api/orders/place
router.post("/place",requireSignIn , placeOrder);


router.get("/my-orders", requireSignIn, getUserOrders);


export default router;

