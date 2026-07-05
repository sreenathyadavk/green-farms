/* eslint-disable @typescript-eslint/no-explicit-any, react-refresh/only-export-components, @typescript-eslint/no-require-imports, prefer-const */
// ============================================================
// PAYMENT SERVICE
// Handles the official Razorpay Checkout.js integration.
// Completely decoupled from business repositories.
// ============================================================

declare global {
  interface Window {
    Razorpay: any;
  }
}

// TEMPORARY: Hardcoded Test Key ID.
// In production, this should be fetched from the VPS or injected via env vars.
const RAZORPAY_TEST_KEY_ID = "rzp_test_T6F39zOIbBvs8w";

interface CheckoutOptions {
  amount: number; // In Rupees (not paise, we will multiply internally)
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
}

interface PaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

/**
 * Dynamically loads the official Razorpay Checkout script.
 */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export const PaymentService = {
  /**
   * Initiates the Razorpay checkout flow.
   * Resolves on successful payment verification.
   * Rejects if the user closes the modal or payment fails.
   */
  async initiateRazorpayPayment({
    amount,
    customerName,
    customerPhone,
    customerEmail = "customer@greencanvasfarm.com",
  }: CheckoutOptions): Promise<PaymentSuccessResponse> {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error("Failed to load Razorpay SDK. Please check your connection.");
    }

    // TODO: VPS INTEGRATION - Create Order
    // In production, make an API call to your VPS here to securely generate a Razorpay Order ID.
    // const { orderId } = await api.post('/create-razorpay-order', { amount });
    const mockOrderId = `order_${Math.random().toString(36).substring(2, 15)}`;

    return new Promise((resolve, reject) => {
      const options = {
        key: RAZORPAY_TEST_KEY_ID,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "B.Tech Wala Hydro Farm",
        description: "Fresh Hydroponic Harvest",
        // Omit order_id to allow unlinked payment for testing (avoids 400 Bad Request)
        // order_id: mockOrderId, 
        handler: async function (response: PaymentSuccessResponse) {
          // TODO: VPS INTEGRATION - Verify Payment
          // In production, send these IDs to your VPS to securely verify the HMAC SHA256 signature.
          // await api.post('/verify-payment', response);
          
          resolve(response);
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: "#16a34a", // forest green
        },
        modal: {
          ondismiss: function () {
            reject(new Error("PAYMENT_CANCELLED"));
          },
        },
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          console.error("Razorpay Payment Failed:", response.error);
          reject(new Error("Payment failed. Please try again."));
        });
        rzp.open();
      } catch (err) {
        console.error("Error opening Razorpay:", err);
        reject(new Error("Failed to initialize payment gateway."));
      }
    });
  },
};
