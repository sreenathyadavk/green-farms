import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const features = [
  { icon: "🌱", title: "Soil-Free Cultivation", text: "Grown in precisely controlled nutrient water — no soil, no pesticides, no compromise." },
  { icon: "💧", title: "95% Less Water", text: "Hydroponic farming uses a fraction of the water traditional farming requires." },
  { icon: "🥗", title: "Curated Weekly Boxes", text: "Perfectly assembled salad boxes for every lifestyle and nutritional need." },
  { icon: "📦", title: "Premium Quality", text: "Every leaf, stem, and tomato is handpicked and quality-checked before packing." },
  { icon: "📱", title: "WhatsApp-First Ordering", text: "No apps. No complex checkout. Just order directly via WhatsApp — fast and personal." },
  { icon: "🚴", title: "Fresh Delivery", text: "Harvested and delivered on the same day for maximum freshness and nutrition." },
];

export const WhyUs = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    
    const onOpen = () => setIsOpen(true);
    window.addEventListener("open-why-us", onOpen);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("open-why-us", onOpen);
    };
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-charcoal/70 backdrop-blur-xl"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-5xl h-[100dvh] sm:h-[90vh] sm:max-h-[900px] overflow-y-auto no-scrollbar sm:rounded-[32px] bg-mist sm:shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="fixed sm:fixed top-4 right-4 sm:top-8 sm:right-8 w-12 h-12 bg-cream shadow-md rounded-full flex items-center justify-center hover:bg-gold hover:text-charcoal transition-colors z-50 group"
            >
              <X className="w-5 h-5 text-text-dark group-hover:text-charcoal transition-colors" />
            </button>

            <div className="flex flex-col items-center gap-12 sm:gap-24 py-16 sm:py-24 px-4 sm:px-8" style={{ perspective: "1500px" }}>
              <motion.div 
                className="text-center mb-4 sm:mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="label-eyebrow text-gold mb-5 tracking-[0.2em]">THE DIFFERENCE</p>
                <h2 className="font-display text-text-dark leading-[1.1]" style={{ fontSize: "clamp(40px, 7vw, 72px)" }}>
                  Why B.Tech Wala<br/><span className="italic font-normal text-forest">Hydro Farm?</span>
                </h2>
              </motion.div>
              
              <div className="w-full max-w-4xl flex flex-col gap-10 sm:gap-20 pb-20">
                {features.map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: isMobile ? 80 : 150, rotateX: isMobile ? 0 : 45, scale: isMobile ? 0.95 : 0.85 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                    viewport={{ once: true, margin: isMobile ? "-50px" : "-150px" }}
                    transition={{ duration: 1.2, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                    style={{ perspective: "1000px" }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, rotateY: isMobile ? 0 : (i % 2 === 0 ? 3 : -3) }}
                      animate={{ y: [0, i % 2 === 0 ? -10 : 10, 0] }}
                      transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                      className={`relative overflow-hidden bg-cream/95 backdrop-blur-md rounded-[28px] p-8 sm:p-12 shadow-card hover:shadow-[0_40px_80px_rgba(108,140,90,0.15)] transition-all duration-500 flex flex-col sm:flex-row items-center gap-6 sm:gap-12 border border-white/80 ${i % 2 !== 0 ? 'sm:flex-row-reverse sm:text-right' : 'sm:text-left'} text-center`}
                      style={{ transformOrigin: "center center", transformStyle: "preserve-3d" }}
                    >
                      {/* Sweeping Glass Reflection */}
                      <motion.div 
                        className="absolute inset-0 z-0 pointer-events-none opacity-60"
                        initial={{ x: "-150%", skewX: -20 }}
                        whileInView={{ x: "150%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5 + i * 0.2, ease: "easeInOut" }}
                        style={{
                          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
                          width: "50%"
                        }}
                      />

                      <motion.div
                        className="text-6xl sm:text-8xl shrink-0 relative z-10"
                        initial={{ scale: 0, rotate: -45, filter: "blur(10px)" }}
                        whileInView={{ scale: 1, rotate: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, margin: isMobile ? "-50px" : "-150px" }}
                        transition={{ duration: 0.9, delay: 0.4 + i * 0.1, type: "spring", bounce: 0.5 }}
                      >
                        {f.icon}
                      </motion.div>
                      <div className="flex-1 relative z-10">
                        <h3 className="text-2xl sm:text-4xl font-display text-text-dark mb-4">{f.title}</h3>
                        <p className="text-base sm:text-xl text-text-muted leading-relaxed sm:leading-loose">{f.text}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
