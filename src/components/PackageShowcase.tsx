import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Package } from "@/data/catalog";
import { X } from "lucide-react";

export const PackageShowcase = ({
  pkg,
  onComplete,
}: {
  pkg: Package;
  onComplete: () => void;
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const duration = isMobile ? 2 : 3.5;
  const ingredients = pkg.contents;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      {/* Background Dim */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-charcoal/85 backdrop-blur-md"
        onClick={onComplete}
      />

      <button
        onClick={onComplete}
        className="absolute top-6 right-6 z-50 text-cream/70 hover:text-cream text-sm font-semibold tracking-widest uppercase flex items-center gap-2"
      >
        Skip <X className="w-4 h-4" />
      </button>

      {/* Orbit Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex items-center justify-center w-full max-w-[320px] sm:max-w-[540px] aspect-square"
      >
        {/* Orbiting Elements Wrapper */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration, ease: "easeInOut" }}
          onAnimationComplete={onComplete}
          className="absolute inset-0 w-full h-full"
        >
          {ingredients.map((ingredient, i) => {
            const angle = (i / ingredients.length) * 360;
            return (
              <div
                key={ingredient}
                className="absolute top-1/2 left-1/2 w-full h-full"
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                }}
              >
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration, ease: "easeInOut" }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-forest/90 backdrop-blur text-gold shadow-card text-[10px] sm:text-xs font-semibold tracking-widest uppercase whitespace-nowrap border border-gold/30" style={{ transform: `rotate(${-angle}deg)` }}>
                    {ingredient.length > 20 ? ingredient.slice(0, 18) + ".." : ingredient}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>

        {/* Center Package Image */}
        <motion.div
          className="relative z-10 w-44 h-44 sm:w-72 sm:h-72 rounded-[32px] overflow-hidden shadow-[0_30px_80px_rgba(26,46,26,0.6)] border-4 border-gold/20"
        >
          <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
        </motion.div>
      </motion.div>
    </div>
  );
};
