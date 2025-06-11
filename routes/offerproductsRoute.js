import express from "express";
import { createOfferProduct,  deleteOfferProduct,  getOfferProducts, updateOfferPercentage } from "../controller/offerproductsController.js";


const router = express.Router();

router.post("/addoffer-products", createOfferProduct);
router.get("/getoffer-products", getOfferProducts); 
router.put("/:id", updateOfferPercentage);
router.delete("/:id", deleteOfferProduct);


export default router;
