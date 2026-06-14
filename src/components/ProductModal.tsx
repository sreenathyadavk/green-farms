import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/data/catalog";
import { useCart } from "@/store/cart";
import { useToast } from "@/store/toast";
import { openWhatsApp, buildProductMessage } from "@/lib/whatsapp";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export const ProductModal = ({ product, onClose }: { product: Product | null; onClose: () => void }) => {
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const showToast = useToast((s) => s.show);

  useEffect(() => {
    if (product) {
      setQty(1);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  const handleAdd = () => {
    if (!product) return;
    add({ id: product.id, name: product.name, short: product.short, price: product.price, image: product.image, type: "product" }, qty);
    showToast("Added to your selection ✓");
    onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-charcoal/60 backdrop-blur-sm"
          />
          <motion.div
            key="sheet"
            initial={{ y: "100%", scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: "100%", scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[81] bg-mist/95 backdrop-blur-2xl sm:rounded-[32px] rounded-t-[32px] w-full sm:w-[90vw] sm:max-w-5xl h-auto max-h-[92vh] sm:h-[600px] lg:h-[700px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)] border border-cream/50 flex flex-col sm:flex-row"
          >
            <div className="sm:hidden flex justify-center pt-4 pb-2 absolute top-0 inset-x-0 z-50">
              <span className="block w-12 h-1.5 rounded-full bg-charcoal/20" />
            </div>
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 rounded-full bg-cream/50 backdrop-blur-md hover:bg-cream inline-flex items-center justify-center text-text-dark z-50 transition-colors shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Premium Large Image Area */}
            <div className="relative w-full sm:w-5/12 h-[35vh] sm:h-full bg-forest/5 flex-shrink-0">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-mist via-mist/20 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-mist/20 sm:to-mist" />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase bg-cream/90 backdrop-blur-md text-forest font-bold shadow-sm w-fit">HYDRO GROWN</span>
                <span className="px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase bg-cream/90 backdrop-blur-md text-forest font-bold shadow-sm w-fit">PESTICIDE FREE</span>
              </div>
            </div>

            <motion.div 
              variants={containerVariants} 
              initial="hidden" 
              animate="visible" 
              className="flex-1 p-6 sm:p-10 lg:p-14 overflow-y-auto no-scrollbar relative flex flex-col justify-center bg-mist"
            >
              <motion.h3 variants={itemVariants} className="font-display text-4xl sm:text-5xl text-text-dark leading-[1.1]">{product.name}</motion.h3>
              <motion.p variants={itemVariants} className="mt-3 font-display text-3xl text-forest font-medium">{product.price}</motion.p>
              
              <motion.div variants={itemVariants} className="w-12 h-1 bg-gold rounded-full my-6" />

              <motion.p variants={itemVariants} className="text-text-muted text-base sm:text-lg leading-relaxed">{product.description}</motion.p>

              {product.harvestNote && (
                <motion.div variants={itemVariants} className="mt-6 rounded-2xl bg-gold/10 border border-gold/20 p-4 flex gap-3.5 items-start">
                  <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-gold shrink-0 animate-pulse" />
                  <p className="text-sm text-text-dark leading-relaxed">
                    <span className="font-semibold block mb-0.5">7-Day Harvest Cycle</span>
                    {product.harvestNote}
                  </p>
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="mt-8 grid grid-cols-2 gap-y-6 gap-x-4 text-sm bg-cream/50 rounded-2xl p-5 border border-cream">
                {product.idealFor && (
                  <div>
                    <p className="text-[11px] font-bold tracking-widest uppercase text-sage mb-1.5">Ideal For</p>
                    <p className="text-text-dark font-medium">{product.idealFor}</p>
                  </div>
                )}
                {product.serving && (
                  <div>
                    <p className="text-[11px] font-bold tracking-widest uppercase text-sage mb-1.5">Serving</p>
                    <p className="text-text-dark font-medium">{product.serving}</p>
                  </div>
                )}
                <div>
                  <p className="text-[11px] font-bold tracking-widest uppercase text-sage mb-1.5">Freshness</p>
                  <p className="text-text-dark font-medium">{product.harvestNote ? "Harvested fresh on day 7" : "Within 24 hours of delivery"}</p>
                </div>
                {product.packSize && (
                  <div>
                    <p className="text-[11px] font-bold tracking-widest uppercase text-sage mb-1.5">Pack Size</p>
                    <p className="text-text-dark font-medium">{product.packSize}</p>
                  </div>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-4 bg-cream rounded-full p-2 w-full sm:w-auto shrink-0 shadow-sm border border-cream/50">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-12 h-12 rounded-full bg-mist hover:bg-sand transition inline-flex items-center justify-center"><Minus className="w-4 h-4 text-text-dark" /></button>
                  <span className="w-8 text-center font-display text-xl">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="w-12 h-12 rounded-full bg-mist hover:bg-sand transition inline-flex items-center justify-center"><Plus className="w-4 h-4 text-text-dark" /></button>
                </div>

                <div className="flex w-full gap-3">
                  <button
                    onClick={handleAdd}
                    className="flex-1 h-16 rounded-full bg-forest text-cream text-sm font-semibold tracking-wide hover:bg-teal transition-colors shadow-card-hover"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => openWhatsApp(buildProductMessage(product.name))}
                    className="w-16 h-16 rounded-full bg-[#25D366] text-white shrink-0 inline-flex items-center justify-center shadow-[0_8px_24px_rgba(37,211,102,0.35)] hover:scale-105 transition-transform"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
