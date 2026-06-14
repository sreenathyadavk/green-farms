import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { addOns, type Package } from "@/data/catalog";
import { useCart } from "@/store/cart";
import { useToast } from "@/store/toast";
import { openWhatsApp, buildPackageMessage } from "@/lib/whatsapp";

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
              <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-mist via-mist/20 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-mist/20 sm:to-mist" />
              <div className="absolute top-6 left-6">
                <span className="px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase bg-gold backdrop-blur-md text-charcoal font-bold shadow-sm">{pkg.badge}</span>
              </div>
            </div>

            <motion.div 
              variants={containerVariants} 
              initial="hidden" 
              animate="visible" 
              className="flex-1 p-6 sm:p-10 lg:p-14 overflow-y-auto no-scrollbar relative flex flex-col justify-center bg-mist"
            >
              <motion.h3 variants={itemVariants} className="font-display text-4xl sm:text-5xl text-text-dark leading-[1.1]">{pkg.name}</motion.h3>
              <motion.p variants={itemVariants} className="mt-3 font-display text-3xl text-forest font-medium">{pkg.price} <span className="text-base text-text-muted font-sans font-normal">/ week</span></motion.p>
              
              <motion.div variants={itemVariants} className="w-12 h-1 bg-gold rounded-full my-6" />

              <motion.p variants={itemVariants} className="text-text-muted text-base sm:text-lg leading-relaxed">{pkg.summary}</motion.p>

              <motion.div variants={itemVariants} className="mt-8 bg-cream/50 rounded-2xl p-5 border border-cream">
                <p className="text-[11px] font-bold tracking-widest uppercase text-sage mb-3">What's Inside</p>
                <ul className="space-y-2.5">
                  {pkg.contents.map((c) => (
                    <li key={c} className="flex items-start gap-3 text-text-dark text-sm font-medium">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-forest shrink-0 shadow-sm" /> {c}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-6">
                <p className="text-[11px] font-bold tracking-widest uppercase text-sage mb-3">Add Extras</p>
                <div className="flex flex-wrap gap-2.5">
                  {addOns.map((a) => {
                    const active = selectedAddOns.includes(a);
                    return (
                      <button
                        key={a}
                        onClick={() => toggleAddOn(a)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                          active ? "bg-forest text-cream border-forest shadow-sm" : "bg-transparent text-text-dark border-cream hover:border-forest"
                        }`}
                      >
                        {active ? "✓ " : "+ "}{a}
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-4 bg-cream rounded-full p-2 w-full sm:w-auto shrink-0 shadow-sm border border-cream/50">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-12 h-12 rounded-full bg-mist hover:bg-sand transition inline-flex items-center justify-center"><Minus className="w-4 h-4 text-text-dark" /></button>
                  <span className="w-8 text-center font-display text-xl">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="w-12 h-12 rounded-full bg-mist hover:bg-sand transition inline-flex items-center justify-center"><Plus className="w-4 h-4 text-text-dark" /></button>
                </div>

                <div className="flex w-full gap-3">
                  <button onClick={handleAdd} className="flex-1 h-16 rounded-full bg-forest text-cream text-sm font-semibold hover:bg-teal transition-colors shadow-card-hover">
                    Add to Cart
                  </button>
                  <button onClick={() => openWhatsApp(buildPackageMessage(pkg.name, pkg.price))} className="w-16 h-16 rounded-full bg-[#25D366] text-white shrink-0 inline-flex items-center justify-center shadow-[0_8px_24px_rgba(37,211,102,0.35)] hover:scale-105 transition-transform">
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
