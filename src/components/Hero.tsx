import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import heroImg from "@/assets/hero-greens.jpg";
import { ArrowRight, MessageCircle } from "lucide-react";
import { openWhatsApp } from "@/lib/whatsapp";
import { Plant3D } from "./Plant3D";

const animatedTexts = ["Grown Clean.", "Delivered Fresh."];

export const Hero = () => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % animatedTexts.length);
    }, 6000); // 5s visibility + 1s transition
    return () => clearInterval(timer);
  }, []);
  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden bg-forest grain">
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* <img
          src={heroImg}
          alt="Fresh hydroponic greens under soft light"
          className="w-full h-full object-cover opacity-30"
          width={1920}
          height={1080}
        /> */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest/70 via-forest/80 to-charcoal" />
      </motion.div>

      {/* Floating ambient orbs */}
      <motion.div
        aria-hidden
        className="absolute -top-20 -right-24 w-[420px] h-[420px] rounded-full bg-sage/20 blur-[120px]"
        animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-32 -left-20 w-[380px] h-[380px] rounded-full bg-gold/10 blur-[120px]"
        animate={{ y: [0, -25, 0], x: [0, 15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative z-10 container mx-auto pt-32 sm:pt-40 pb-24 min-h-screen flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="inline-flex self-start items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/40 text-gold text-[11px] tracking-[0.18em] uppercase"
        >
          <span>✦</span> Hyderabad's Finest Hydroponic Farm
        </motion.div>

        <div className="relative">
          <motion.h1
            className="font-display text-cream mt-7 sm:mt-10 leading-[1.02] tracking-tight relative z-10"
            style={{ fontSize: "clamp(44px, 9vw, 104px)", letterSpacing: "-0.025em", fontWeight: 700 }}
          >
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}>
              Fresh Hydroponic Lettuce
            </motion.div>
            
            <div className="italic font-normal mt-2 relative flex flex-wrap items-center text-gold">
              
              {/* Text Animation Wrapper */}
              <div className="mr-3 sm:mr-4 grid items-center">
                {/* Invisible placeholder for layout stability */}
                <span className="invisible pointer-events-none" style={{ gridArea: "1 / 1" }}>
                  Delivered Fresh.
                </span>

                <AnimatePresence mode="wait">
                  <motion.span
                    key={textIndex}
                    initial={{ 
                      opacity: 0, 
                      y: 30, 
                      filter: "blur(12px)",
                      backgroundPosition: "150% 0%"
                    }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      filter: "blur(0px)",
                      backgroundPosition: "-50% 0%"
                    }}
                    exit={{ 
                      opacity: 0, 
                      y: -30, 
                      filter: "blur(12px)"
                    }}
                    transition={{ 
                      opacity: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                      y: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                      filter: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                      backgroundPosition: { duration: 2.2, delay: 0.2, ease: "easeInOut" }
                    }}
                    className="inline-block whitespace-nowrap bg-clip-text text-transparent"
                    style={{
                      gridArea: "1 / 1",
                      backgroundImage: "linear-gradient(90deg, #c4a882 0%, #c4a882 40%, #4ade80 50%, #16a34a 52%, #c4a882 60%, #c4a882 100%)",
                      backgroundSize: "300% 100%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {animatedTexts[textIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-md text-sand/85 text-base sm:text-lg leading-relaxed relative z-10"
        >
          Precision-grown hydroponic greens, curated salad boxes, and farm-fresh produce. Delivered to your door.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 relative z-10"
        >
          <a
            href="#shop"
            className="inline-flex items-center justify-center gap-2 h-13 px-7 py-4 rounded-full bg-gold text-charcoal text-sm font-semibold tracking-wide hover:scale-[1.02] transition-transform shadow-[0_10px_30px_-10px_hsl(var(--gold)/0.6)]"
          >
            <span className="text-base">🛒</span> Order Fresh
          </a>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-10 relative z-10"
        >
          <div className="inline-flex flex-wrap gap-x-0 gap-y-3 rounded-2xl border border-cream/10 bg-white/5 backdrop-blur-sm overflow-hidden">
            {[
              { value: "1000+", label: "Orders\nDelivered",    icon: "📦" },
              { value: "500+",  label: "Happy\nCustomers",     icon: "😊" },
              { value: "HYD",   label: "Hyderabad\nDelivery",  icon: "🚚" },
              { value: "4.9★",  label: "Customer\nRating",     icon: "⭐" },
            ].map((stat, i) => (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
                className="flex items-center gap-3 px-5 py-3.5 border-r border-cream/10 last:border-r-0"
              >
                <span className="text-xl leading-none">{stat.icon}</span>
                <div>
                  <p className="font-display text-cream text-lg leading-none font-semibold">{stat.value}</p>
                  <p className="text-sand/70 text-[10px] leading-tight mt-0.5 whitespace-pre-line tracking-wide">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          className="mt-auto pt-12 relative z-10"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] sm:text-xs tracking-[0.12em] uppercase text-sand/85">
            <span>🌿 Pesticide Free</span>
            <span className="hidden sm:inline w-px h-3 bg-sand/30" />
            <span>💧 95% Less Water</span>
            <span className="hidden sm:inline w-px h-3 bg-sand/30" />
            <span>🌅 Same-Day Harvest</span>
            <span className="hidden sm:inline w-px h-3 bg-sand/30" />
            <span>🍃 Fresh Every Morning</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
