import { motion } from "framer-motion";
import { MessageCircle, Heart } from "lucide-react";
import type { Product } from "@/types/models";
import { effectivePrice } from "@/hooks/useProducts";
import { openWhatsApp, buildProductMessage } from "@/lib/whatsapp";

interface Props {
  product: Product;
  index: number;
  onClick: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const ProductCard = ({ product, index, onClick }: Props) => {
  const price = effectivePrice(product);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group cursor-pointer rounded-[24px] overflow-hidden bg-cream shadow-card hover:shadow-[0_20px_40px_rgba(26,46,26,0.12)] transition-shadow duration-500 relative"
    >
      {/* Discount badge */}
      {price.discounted && (
        <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-[9px] tracking-[0.14em] uppercase font-bold bg-red-500 text-white shadow-card">
          {price.discountLabel}
        </span>
      )}

      {/* Pre-order badge */}
      {product.id.startsWith("mg-") && (
        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[9px] tracking-[0.14em] uppercase font-semibold bg-gold text-charcoal shadow-card">
          Pre-order
        </span>
      )}

      {/* Out of stock overlay */}
      {product.stock <= 0 && (
        <div className="absolute inset-0 z-20 bg-cream/60 flex items-center justify-center backdrop-blur-[1px]">
          <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg border border-sand">
            <span className="text-xs font-bold text-text-dark tracking-widest uppercase">Out of Stock</span>
          </div>
        </div>
      )}

      <div className="relative aspect-square bg-sand overflow-hidden">
        <motion.img
          variants={{
            hidden: { scale: 1.2, opacity: 0 },
            visible: { scale: 1, opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
          }}
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cream/80 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/5 transition-colors duration-500 pointer-events-none" />
      </div>

      <div className="p-4 sm:p-5 flex flex-col gap-1.5">
        <motion.p variants={itemVariants} className="text-[10px] tracking-[0.14em] uppercase text-sage font-medium">
          {product.tag}
        </motion.p>
        <motion.h3 variants={itemVariants} className="text-base sm:text-lg font-semibold text-text-dark leading-tight">
          {product.name}
        </motion.h3>
        <motion.p variants={itemVariants} className="text-[13px] text-text-muted line-clamp-1 mb-2">
          {product.short}
        </motion.p>

        <motion.div variants={itemVariants} className="mt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-display text-lg font-semibold text-forest">{price.display}</span>
            {price.discounted && (
              <span className="text-[11px] text-text-muted line-through leading-none">{price.original}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Wishlist"
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 rounded-full inline-flex items-center justify-center text-text-muted hover:text-forest transition-colors relative z-30"
            >
              <Heart className="w-4 h-4" />
            </button>
            <motion.button
              aria-label="Order on WhatsApp"
              disabled={product.stock <= 0}
              onClick={(e) => {
                e.stopPropagation();
                if (product.stock > 0) openWhatsApp(buildProductMessage(product.name));
              }}
              whileHover={product.stock > 0 ? { scale: 1.15, rotate: -5, boxShadow: "0px 0px 20px rgba(37,211,102,0.6)" } : {}}
              whileTap={product.stock > 0 ? { scale: 0.92 } : {}}
              className={`w-9 h-9 rounded-full inline-flex items-center justify-center shadow-sm transition-all duration-300 relative overflow-hidden z-30 ${
                product.stock <= 0 ? "bg-sand text-text-muted cursor-not-allowed" : "bg-[#25D366] text-white shadow-[0_4px_14px_rgba(37,211,102,0.45)]"
              }`}
            >
              {product.stock > 0 && <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300" />}
              <MessageCircle className="w-4 h-4 relative z-10" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
