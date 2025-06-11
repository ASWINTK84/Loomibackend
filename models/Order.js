import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  items: [
    {
      product: Object, // Or { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
      quantity: { type: Number, required: true, min: 1 }, // Added validation
      color: { type: String }, // Added colour
      size: { type: String },   // Added size
    },
  ],
  totalAmount: { type: Number, required: true },
  offerPrice: Number, // Optional, can be undefined if no offer
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  isPaid: { type: Boolean, default: false },
  paymentMethod: { type: String, enum: ["COD", "ONLINE"], required: true },
  paymentInfo: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);