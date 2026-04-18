import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { addOns, type Package } from "@/data/catalog";
import { useCart } from "@/store/cart";
import { useToast } from "@/store/toast";
import { openWhatsApp, buildPackageMessage } from "@/lib/whatsapp";

export const PackageModal = ({ pkg, onClose }: { pkg: Package | null; onClose: () => void }) => {
  const [qty, setQty] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const add = useCart((s) => s.add);
  const showToast = useToast((s) => s.show);

  useEffect(() => {
    if (pkg) {
      setQty(1);
      setSelectedAddOns([]);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [pkg]);

  if (!pkg) return null;

  const toggleAddOn = (a: string) =>
    setSelectedAddOns((s) => (s.includes(a) ? s.filter((x) => x !== a) : [...s, a]));

  const handleAdd = () => {
    add(
      {
        id: pkg.id,
        name: pkg.name + (selectedAddOns.length ? ` (+ ${selectedAddOns.join(", ")})` : ""),
        short: pkg.summary,
        price: pkg.price + " / wk",
        image: pkg.image,
        type: "package",
      },
      qty
    );
    showToast("Added to your selection ✓");
    onClose();
  };

  return (
    <AnimatePresence>
      {pkg && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[80] bg-charcoal/60 backdrop-blur-sm" />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 right-0 bottom-0 z-[81] bg-cream rounded-t-[28px] sm:rounded-[28px] sm:left-1/2 sm:right-auto sm:bottom-auto sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[92vw] sm:max-w-2xl max-h-[92vh] overflow-y-auto"
          >
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <span className="block w-9 h-1 rounded-full bg-sand" />
            </div>
            <button aria-label="Close" onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 w-11 h-11 rounded-full bg-cream/80 backdrop-blur inline-flex items-center justify-center text-text-dark z-10">
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cream to-transparent" />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] tracking-[0.16em] uppercase font-semibold bg-gold text-charcoal">{pkg.badge}</span>
            </div>

            <div className="p-6 sm:p-8">
              <h3 className="font-display text-3xl text-text-dark leading-tight">{pkg.name}</h3>
              <p className="mt-2 font-display text-2xl text-forest font-semibold">{pkg.price} <span className="text-base text-text-muted font-sans font-normal">/ week</span></p>
              <p className="mt-4 text-text-muted leading-relaxed">{pkg.summary}</p>

              <div className="mt-6">
                <p className="label-eyebrow text-gold mb-3">What's Inside</p>
                <ul className="space-y-2">
                  {pkg.contents.map((c) => (
                    <li key={c} className="flex items-start gap-2.5 text-text-dark">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-sage shrink-0" /> {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <p className="label-eyebrow text-gold mb-3">Add Extras</p>
                <div className="flex flex-wrap gap-2">
                  {addOns.map((a) => {
                    const active = selectedAddOns.includes(a);
                    return (
                      <button
                        key={a}
                        onClick={() => toggleAddOn(a)}
                        className={`px-4 py-2 rounded-full text-sm border transition ${
                          active ? "bg-forest text-cream border-forest" : "bg-transparent text-text-dark border-sand hover:border-forest"
                        }`}
                      >
                        {active ? "✓ " : "+ "}{a}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-7 flex items-center gap-3 bg-sand/60 rounded-full p-1.5 w-fit">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 rounded-full bg-cream inline-flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                <span className="w-8 text-center font-medium">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="w-9 h-9 rounded-full bg-cream inline-flex items-center justify-center"><Plus className="w-4 h-4" /></button>
              </div>

              <div className="mt-6 space-y-3">
                <button onClick={handleAdd} className="w-full h-13 py-4 rounded-2xl bg-forest text-cream text-sm font-semibold">
                  Add to Cart
                </button>
                <button onClick={() => openWhatsApp(buildPackageMessage(pkg.name, pkg.price))} className="w-full h-13 py-4 rounded-2xl bg-[#25D366] text-white text-sm font-semibold inline-flex items-center justify-center gap-2">
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
