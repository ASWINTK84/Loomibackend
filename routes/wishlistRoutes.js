import express from "express";  
import { addProductToWishlist, getWishlist, removeProductFromWishlist } from "../controller/wishlistController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.use(requireSignIn); 

router.get("/", getWishlist);         
router.post("/", addProductToWishlist); 
router.delete("/:productId", removeProductFromWishlist); 

export default router;