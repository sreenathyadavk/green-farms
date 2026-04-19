import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/data/catalog";
import { useCart } from "@/store/cart";
import { useToast } from "@/store/toast";
import { openWhatsApp, buildProductMessage } from "@/lib/whatsapp";

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
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 right-0 bottom-0 z-[81] bg-cream rounded-t-[28px] sm:rounded-[28px] sm:left-1/2 sm:right-auto sm:bottom-auto sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[92vw] sm:max-w-2xl max-h-[92vh] overflow-y-auto"
          >
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <span className="block w-9 h-1 rounded-full bg-sand" />
            </div>
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-11 h-11 rounded-full bg-cream/80 backdrop-blur inline-flex items-center justify-center text-text-dark z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cream to-transparent" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] tracking-[0.14em] uppercase bg-cream/70 backdrop-blur text-forest font-semibold">HYDRO GROWN</span>
                <span className="px-3 py-1 rounded-full text-[10px] tracking-[0.14em] uppercase bg-cream/70 backdrop-blur text-forest font-semibold">PESTICIDE FREE</span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <h3 className="font-display text-3xl text-text-dark leading-tight">{product.name}</h3>
              <p className="mt-2 font-display text-2xl text-forest font-semibold">{product.price}</p>
              <p className="mt-4 text-text-muted leading-relaxed">{product.description}</p>

              {product.harvestNote && (
                <div className="mt-5 rounded-2xl bg-gold/15 border border-gold/30 px-4 py-3 flex gap-3 items-start">
                  <span className="mt-1 w-2 h-2 rounded-full bg-gold shrink-0 animate-pulse" />
                  <p className="text-[13px] text-text-dark leading-relaxed">
                    <span className="font-semibold">7-day harvest cycle.</span> {product.harvestNote}
                  </p>
                </div>
              )}

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                {product.idealFor && (
                  <div>
                    <p className="label-eyebrow text-gold mb-1">Ideal For</p>
                    <p className="text-text-dark">{product.idealFor}</p>
                  </div>
                )}
                {product.serving && (
                  <div>
                    <p className="label-eyebrow text-gold mb-1">Serving</p>
                    <p className="text-text-dark">{product.serving}</p>
                  </div>
                )}
                <div>
                  <p className="label-eyebrow text-gold mb-1">Freshness</p>
                  <p className="text-text-dark">{product.harvestNote ? "Harvested fresh on day 7" : "Within 24 hours of delivery"}</p>
                </div>
                {product.packSize && (
                  <div>
                    <p className="label-eyebrow text-gold mb-1">Pack Size</p>
                    <p className="text-text-dark">{product.packSize}</p>
                  </div>
                )}
              </div>

              <div className="mt-7 flex items-center gap-3 bg-sand/60 rounded-full p-1.5 w-fit">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 rounded-full bg-cream inline-flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                <span className="w-8 text-center font-medium">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="w-9 h-9 rounded-full bg-cream inline-flex items-center justify-center"><Plus className="w-4 h-4" /></button>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleAdd}
                  className="w-full h-13 py-4 rounded-2xl bg-forest text-cream text-sm font-semibold tracking-wide hover:opacity-95 transition-opacity"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => openWhatsApp(buildProductMessage(product.name))}
                  className="w-full h-13 py-4 rounded-2xl bg-[#25D366] text-white text-sm font-semibold tracking-wide inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Order via WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
