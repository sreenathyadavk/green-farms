import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, MessageCircle, Truck, Clock } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useCart } from "@/store/cart";
import { buildCartMessage, buildThankYouMessage, openWhatsApp } from "@/lib/whatsapp";
import { DELIVERY_CHARGE } from "@/data/catalog";

export const CartDrawer = () => {
  const { items, isOpen, close, updateQty, remove, clear } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const hasMicrogreens = useMemo(() => items.some((i) => i.id.startsWith("mg-")), [items]);

  const handleCheckout = () => {
    if (items.length === 0) return;
    // Open primary order message on WhatsApp
    openWhatsApp(buildCartMessage(items));
    // Follow up with auto thank-you message in a second tab so the user lands with both messages composed
    setTimeout(() => {
      openWhatsApp(buildThankYouMessage());
    }, 700);
    // Optimistically clear after order is sent
    setTimeout(() => {
      clear();
      close();
    }, 1400);
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
            className="fixed top-0 right-0 bottom-0 z-[91] w-full sm:w-[420px] bg-cream flex flex-col"
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
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="py-4 flex gap-3"
                      >
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-text-dark text-sm leading-snug truncate">{item.name}</p>
                          <p className="text-xs text-text-muted truncate">{item.short}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 bg-sand/60 rounded-full p-1">
                              <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 rounded-full bg-cream inline-flex items-center justify-center active:scale-90 transition-transform"><Minus className="w-3 h-3" /></button>
                              <motion.span key={item.qty} initial={{ scale: 0.7 }} animate={{ scale: 1 }} className="text-xs w-6 text-center font-medium">{item.qty}</motion.span>
                              <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 rounded-full bg-cream inline-flex items-center justify-center active:scale-90 transition-transform"><Plus className="w-3 h-3" /></button>
                            </div>
                            <span className="text-sm font-semibold text-forest">{item.price}</span>
                          </div>
                        </div>
                        <button aria-label="Remove" onClick={() => remove(item.id)} className="text-text-muted hover:text-forest"><X className="w-4 h-4" /></button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-sand px-6 py-5 space-y-4">
                {/* Delivery info card */}
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-forest/5 border border-forest/10 p-3.5 space-y-2.5"
                >
                  <div className="flex items-start gap-2.5">
                    <Truck className="w-4 h-4 text-forest mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-text-dark">Delivery Charge</p>
                      <p className="text-xs text-text-muted">Flat ₹{DELIVERY_CHARGE} across Hyderabad</p>
                    </div>
                    <span className="font-display text-base text-forest font-semibold">₹{DELIVERY_CHARGE}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-text-dark">
                        {hasMicrogreens ? "7-day harvest cycle" : "24–48 hr delivery"}
                      </p>
                      <p className="text-xs text-text-muted">
                        {hasMicrogreens
                          ? "Microgreens are sown to order — delivered fresh after the 7-day grow cycle."
                          : "Delivered before 9 AM in your slot."}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Estimated Total</span>
                  <span className="font-display text-xl text-text-dark">on confirmation</span>
                </div>
                <p className="text-[11px] italic text-text-muted leading-relaxed">
                  Final price (incl. ₹{DELIVERY_CHARGE} delivery) confirmed on WhatsApp. COD available.
                </p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCheckout}
                  className="w-full h-13 py-4 rounded-full bg-[#25D366] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(37,211,102,0.35)]"
                >
                  <MessageCircle className="w-4 h-4" /> Confirm Order on WhatsApp
                </motion.button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
