import crypto from "crypto";

export const verifySignature = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", "hAoGszUvmgdDtXPvgXTCE9GQ")
    .update(body.toString())
    .digest("hex");

  return expectedSignature === razorpay_signature;
};
