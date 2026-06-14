import { motion } from "framer-motion";
import { MessageCircle, Heart } from "lucide-react";
import type { Product } from "@/data/catalog";
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
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1, delayChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export const ProductCard = ({ product, index, onClick }: Props) => {
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
      {product.id.startsWith("mg-") && (
        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[9px] tracking-[0.14em] uppercase font-semibold bg-gold text-charcoal shadow-card">
          Pre-order
        </span>
      )}
      <div className="relative aspect-square bg-sand overflow-hidden">
        <motion.img
          variants={{
            hidden: { scale: 1.2, opacity: 0 },
            visible: { scale: 1, opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }
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
        <motion.p variants={itemVariants} className="text-[10px] tracking-[0.14em] uppercase text-sage font-medium">{product.tag}</motion.p>
        <motion.h3 variants={itemVariants} className="text-base sm:text-lg font-semibold text-text-dark leading-tight">{product.name}</motion.h3>
        <motion.p variants={itemVariants} className="text-[13px] text-text-muted line-clamp-1 mb-2">{product.short}</motion.p>
        
        <motion.div variants={itemVariants} className="mt-2 flex items-center justify-between">
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
              whileHover={{ scale: 1.15, rotate: -5, boxShadow: "0px 0px 20px rgba(37,211,102,0.6)" }}
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 rounded-full bg-[#25D366] text-white inline-flex items-center justify-center shadow-[0_4px_14px_rgba(37,211,102,0.45)] transition-shadow duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300" />
              <MessageCircle className="w-4 h-4 relative z-10" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
