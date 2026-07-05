/* eslint-disable @typescript-eslint/no-explicit-any, react-refresh/only-export-components, @typescript-eslint/no-require-imports, prefer-const */
// ============================================================
// ORDER SERVICE
// Orchestrates the full transactional order flow:
//   1. Create order in repository
//   2. Reduce inventory per item
//   3. Record sale in analytics
//   4. Sync to Google Sheets (async, non-blocking)
//   5. Return completed order (WhatsApp opened by caller)
// ============================================================

import type { CartItem } from "@/store/cart";
import type { Order, OrderItem } from "@/types/models";
import {
  orderRepository,
  inventoryRepository,
  analyticsRepository,
} from "@/repositories";
import { GoogleSheetsService } from "./GoogleSheetsService";
import { DELIVERY_CHARGE } from "@/data/catalog";

interface PlaceOrderInput {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: import("@/types/models").PaymentMethod;
  items: CartItem[];
  notes?: string;
  paymentDetails?: any;
}

export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  const { customerName, customerPhone, customerAddress, paymentMethod, items, notes = "", paymentDetails } = input;

  // 1. Map cart items to order items
  const orderItems: OrderItem[] = items.map((ci) => ({
    productId: ci.id,
    name: ci.name,
    price: ci.price,
    priceValue: ci.priceValue ?? 0,
    qty: ci.qty,
    image: ci.image,
    type: ci.type,
  }));

  const subtotal = orderItems.reduce((s, i) => s + i.priceValue * i.qty, 0);
  const total = subtotal + DELIVERY_CHARGE;

  const hasMicrogreens = items.some((i) => i.id.startsWith("mg-"));
  const deliveryEstimate = hasMicrogreens ? "7-day harvest cycle" : "24–48 hours";

  // 2. Create order record
  const order: Order = {
    id: `BTW-${Date.now()}`,
    orderNumber: `BTW-${Date.now()}`,
    customerName,
    customerPhone,
    customerAddress,
    items: orderItems,
    subtotal,
    deliveryCharge: DELIVERY_CHARGE,
    discount: 0,
    total,
    paymentMethod,
    deliveryEstimate,
    status: "pending",
    notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // The backend '/save-order' endpoint automatically handles inventory, sales tracking, and signature verification.
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/save-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payment: paymentDetails || {},
        order,
      }),
    });
    
    if (!response.ok) {
      console.warn("Backend failed to save order:", await response.text());
      throw new Error("Payment verification failed");
    } else {
      console.log("✅ Order securely saved to backend.");
    }
  } catch (err) {
    console.error("Failed to connect to backend API:", err);
    throw err;
  }

  return order;
}
