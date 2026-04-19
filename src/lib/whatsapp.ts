import { WHATSAPP_NUMBER, DELIVERY_CHARGE } from "@/data/catalog";
import type { CartItem } from "@/store/cart";

export function openWhatsApp(message: string) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function buildCartMessage(items: CartItem[]) {
  const lines = items.map((i) => `• ${i.name} × ${i.qty}  (${i.price})`).join("\n");
  const hasMicrogreens = items.some((i) => i.id.startsWith("mg-"));
  const eta = hasMicrogreens
    ? "Delivery: 7 days (microgreens harvest cycle)"
    : "Delivery: 24–48 hours · Before 9 AM window";

  return `Hi! 🌿 I'd like to confirm my order from B.Tech Wala Hydro Farm.

🛒 *My Selection:*
${lines}

🚚 Delivery Charge: ₹${DELIVERY_CHARGE}
📅 ${eta}
💵 Payment: Cash on Delivery

Please confirm availability, final total, and delivery slot. Thank you for the fresh harvest! 🙏`;
}

export function buildProductMessage(name: string) {
  return `Hi! 🌿 I'd like to order *${name}* from B.Tech Wala Hydro Farm.

Please share availability, pricing, and delivery slot.
🚚 Delivery: 24–48 hrs · Before 9 AM window
💵 COD available

Thank you for the fresh harvest! 🙏`;
}

export function buildPackageMessage(name: string, price: string) {
  return `Hi! 🌿 I'd like to subscribe to the *${name}* (${price} / week) from B.Tech Wala Hydro Farm.

Please share final details, delivery day & slot.
🚚 Delivery: weekly · Before 9 AM window
💵 COD available

Thank you for the fresh harvest! 🙏`;
}

export function buildThankYouMessage() {
  return `Thank you so much for ordering from B.Tech Wala Hydro Farm! 🌿💚

Your fresh harvest is on its way. We'll confirm your delivery slot shortly on this chat.

— Team B.Tech Wala`;
}
