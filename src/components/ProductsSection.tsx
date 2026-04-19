import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products, type Category, type Product } from "@/data/catalog";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";

const categories: Category[] = ["All", "Greens", "Herbs", "Microgreens", "Boxes", "Fitness", "Premium"];

export const ProductsSection = () => {
  const [active, setActive] = useState<Category>("All");
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = products.filter((p) =>
    active === "All" ? true : active === "Boxes" || active === "Fitness" ? false : p.category === active
  );

  return (
    <>
      {/* Filter chips */}
      <section className="bg-mist py-6 sticky-none">
        <div className="container mx-auto">
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-5 px-5 snap-x-mandatory">
            {categories.map((c) => (
              <motion.button
                key={c}
                onClick={() => setActive(c)}
                whileTap={{ scale: 0.94 }}
                className={`shrink-0 snap-start px-4 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 relative ${
                  active === c
                    ? "bg-forest text-cream shadow-card"
                    : "bg-sand text-text-dark hover:bg-sand/70"
                }`}
              >
                {c}
                {active === c && (
                  <motion.span
                    layoutId="chip-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section id="shop" className="bg-cream py-16 sm:py-24">
        <div className="container mx-auto">
          <div className="max-w-2xl mb-12 sm:mb-16">
            <p className="label-eyebrow text-gold mb-4">FRESH FROM THE FARM</p>
            <h2 className="font-display text-text-dark leading-[1.1]" style={{ fontSize: "clamp(34px, 5.5vw, 56px)" }}>
              Curated Fresh Produce
            </h2>
            <p className="mt-5 text-text-muted text-base leading-relaxed">
              Hydroponically grown with precision. Harvested clean. Delivered premium.
            </p>
          </div>

          {active === "Microgreens" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 sm:mb-8 rounded-2xl bg-forest/5 border border-forest/10 px-5 py-4 flex items-start gap-3"
            >
              <span className="mt-1.5 w-2 h-2 rounded-full bg-gold animate-pulse shrink-0" />
              <p className="text-sm text-text-dark leading-relaxed">
                <span className="font-semibold">Pre-order only.</span> Microgreens (50g · ₹150) are sown to order — delivered after the <span className="font-semibold">7-day harvest cycle</span>.
              </p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onClick={() => setSelected(p)} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="text-center text-text-muted py-16 italic">View our salad boxes below ↓</p>
          )}
        </div>
      </section>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
};
