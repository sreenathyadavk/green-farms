import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/store/cart";
import { buildCartMessage, openWhatsApp } from "@/lib/whatsapp";

export const CartDrawer = () => {
  const { items, isOpen, close, updateQty, remove } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleCheckout = () => {
    if (items.length === 0) return;
    openWhatsApp(buildCartMessage(items));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[90] bg-charcoal/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[91] w-full sm:w-[400px] bg-cream flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-sand">
              <div>
                <p className="label-eyebrow text-gold">{items.length} item{items.length !== 1 ? "s" : ""}</p>
                <h3 className="font-display text-2xl text-text-dark">Your Selection</h3>
              </div>
              <button aria-label="Close cart" onClick={close} className="w-11 h-11 inline-flex items-center justify-center"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <p className="font-display text-xl text-text-dark">Your selection is empty</p>
                  <p className="text-sm text-text-muted mt-2">Add curated greens or a weekly box.</p>
                </div>
              ) : (
                <ul className="divide-y divide-sand">
                  {items.map((item) => (
                    <li key={item.id} className="py-4 flex gap-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text-dark text-sm leading-snug truncate">{item.name}</p>
                        <p className="text-xs text-text-muted truncate">{item.short}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 bg-sand/60 rounded-full p-1">
                            <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 rounded-full bg-cream inline-flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs w-6 text-center font-medium">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 rounded-full bg-cream inline-flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                          </div>
                          <span className="text-sm font-semibold text-forest">{item.price}</span>
                        </div>
                      </div>
                      <button aria-label="Remove" onClick={() => remove(item.id)} className="text-text-muted hover:text-forest"><X className="w-4 h-4" /></button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-sand px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Estimated Total</span>
                <span className="font-display text-xl text-text-dark">on confirmation</span>
              </div>
              <p className="text-[11px] italic text-text-muted leading-relaxed">
                Final price confirmed on WhatsApp. COD available.
              </p>
              <button
                onClick={handleCheckout}
                disabled={items.length === 0}
                className="w-full h-13 py-4 rounded-full bg-[#25D366] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <MessageCircle className="w-4 h-4" /> Complete Order on WhatsApp
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
