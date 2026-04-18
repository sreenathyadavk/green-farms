import { WHATSAPP_NUMBER } from "@/data/catalog";
import type { CartItem } from "@/store/cart";

export function openWhatsApp(message: string) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function buildCartMessage(items: CartItem[]) {
  const lines = items.map((i) => `- ${i.name} × ${i.qty}`).join("\n");
  return `Hi! I'd like to place an order from B.Tech Wala Hydro Farm. 🌿\n\nMy selected items:\n${lines}\n\nPlease confirm availability, final price, and delivery details. Thank you!`;
}

export function buildProductMessage(name: string) {
  return `Hi! I'm interested in ordering ${name} from B.Tech Wala Hydro Farm. Please share availability, pricing, and delivery details.`;
}

export function buildPackageMessage(name: string, price: string) {
  return `Hi! I'm interested in the ${name} (${price}/week). Please share final details and delivery information.`;
}
