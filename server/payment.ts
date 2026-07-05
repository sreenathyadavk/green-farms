import crypto from "crypto";

interface PaymentData {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export function verifyPaymentSignature(payment: PaymentData): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!secret) {
    console.error("Missing RAZORPAY_KEY_SECRET in environment.");
    return false;
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payment;
  
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return false;
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === razorpay_signature;
}
