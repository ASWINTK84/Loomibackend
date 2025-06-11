import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { addToCart, clearCart, getCart, removeFromCart, updateCartQuantity } from "../controller/cartController.js";

const router = express.Router();

router.use(requireSignIn); 

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:cartItemId", updateCartQuantity);
router.delete("/:cartItemId", removeFromCart);
router.delete("/", clearCart);

export default router;
