import { motion } from "framer-motion";
import { MessageCircle, Heart } from "lucide-react";
import type { Product } from "@/data/catalog";
import { openWhatsApp, buildProductMessage } from "@/lib/whatsapp";

interface Props {
  product: Product;
  index: number;
  onClick: () => void;
}

export const ProductCard = ({ product, index, onClick }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group cursor-pointer rounded-[24px] overflow-hidden bg-cream shadow-card hover:shadow-card-hover transition-shadow duration-300 relative"
    >
      {product.id.startsWith("mg-") && (
        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[9px] tracking-[0.14em] uppercase font-semibold bg-gold text-charcoal shadow-card">
          Pre-order
        </span>
      )}
      <div className="relative aspect-square bg-sand overflow-hidden">
        <motion.img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cream/80 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/5 transition-colors duration-500 pointer-events-none" />
      </div>
      <div className="p-4 sm:p-5">
        <p className="text-[10px] tracking-[0.14em] uppercase text-sage font-medium">{product.tag}</p>
        <h3 className="mt-1.5 text-base sm:text-lg font-semibold text-text-dark leading-tight">{product.name}</h3>
        <p className="mt-1 text-[13px] text-text-muted line-clamp-1">{product.short}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-forest">{product.price}</span>
          <div className="flex items-center gap-2">
            <button
              aria-label="Wishlist"
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 rounded-full inline-flex items-center justify-center text-text-muted hover:text-forest transition-colors"
            >
              <Heart className="w-4 h-4" />
            </button>
            <motion.button
              aria-label="Order on WhatsApp"
              onClick={(e) => {
                e.stopPropagation();
                openWhatsApp(buildProductMessage(product.name));
              }}
              whileHover={{ scale: 1.12, rotate: -8 }}
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 rounded-full bg-[#25D366] text-white inline-flex items-center justify-center shadow-[0_4px_14px_rgba(37,211,102,0.45)]"
            >
              <MessageCircle className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
