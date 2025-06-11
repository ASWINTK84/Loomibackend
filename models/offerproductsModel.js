import mongoose from "mongoose";
import ProductModel from "../models/ProductModel.js"
import categoryModel from "./categoryModel.js";



const offerProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  offerPercentage: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const OfferProduct = mongoose.model("OfferProduct", offerProductSchema);

export default OfferProduct;
