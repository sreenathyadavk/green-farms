import { MessageCircle } from "lucide-react";
import { openWhatsApp } from "@/lib/whatsapp";

export const WhatsAppFAB = () => (
  <button
    aria-label="Chat on WhatsApp"
    onClick={() => openWhatsApp("Hi! I'd like to know more about B.Tech Wala Hydro Farm produce.")}
    className="fixed bottom-5 right-5 z-[70] w-14 h-14 rounded-full bg-[#25D366] text-white inline-flex items-center justify-center shadow-card-hover animate-pulse-soft"
  >
    <span className="absolute inset-0 rounded-full pulse-ring" />
    <MessageCircle className="w-6 h-6 relative z-10" />
  </button>
);
