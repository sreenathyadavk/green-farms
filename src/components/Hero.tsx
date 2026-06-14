import { motion } from "framer-motion";
import heroImg from "@/assets/hero-greens.jpg";
import { ArrowRight, MessageCircle } from "lucide-react";
import { openWhatsApp } from "@/lib/whatsapp";
import { Plant3D } from "./Plant3D";

export const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden bg-forest grain">
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={heroImg}
          alt="Fresh hydroponic greens under soft light"
          className="w-full h-full object-cover opacity-30"
          width={1920}
          height={1080}
        />
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
            
            <div className="italic font-normal mt-2 relative inline-block text-gold">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block relative mr-3 sm:mr-4"
              >
                Grown Clean,
              </motion.span>
              
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block relative"
              >
                Delivered Fresh.
              </motion.span>

              {/* The scanner overlay */}
              <motion.div 
                className="absolute inset-0 pointer-events-none animate-text-scanner whitespace-nowrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 3.5 }}
              >
                Grown Clean, Delivered Fresh.
              </motion.div>
            </div>
          </motion.h1>
          
          {/* True 3D Plant Model (Three.js via React Three Fiber) */}
          <motion.div 
            className="absolute -right-10 -top-20 sm:right-10 sm:-top-10 w-48 h-48 sm:w-72 sm:h-72 lg:w-[420px] lg:h-[420px] z-0"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Dynamic shadow that responds to floating */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-forest/40 blur-3xl pointer-events-none" 
              animate={{ scale: [1, 0.8, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateY(120px) scale(0.8)" }} 
            />
            
            <div className="w-full h-full relative z-10 pointer-events-auto">
              <Plant3D />
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-md text-sand/85 text-base sm:text-lg leading-relaxed"
        >
          Precision-grown hydroponic greens, curated salad boxes, and farm-fresh produce. Delivered to your door.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4"
        >
          <a
            href="#shop"
            className="inline-flex items-center justify-center gap-2 h-13 px-7 py-4 rounded-full bg-gold text-charcoal text-sm font-semibold tracking-wide hover:scale-[1.02] transition-transform shadow-[0_10px_30px_-10px_hsl(var(--gold)/0.6)]"
          >
            <span className="text-base">🛒</span> Order Fresh
          </a>
          <button
            onClick={() => openWhatsApp("Hi! I'd like to know more about B.Tech Wala Hydro Farm produce and salad boxes.")}
            className="inline-flex items-center justify-center gap-2 h-13 px-7 py-4 rounded-full border border-cream/70 text-cream text-sm font-semibold tracking-wide hover:bg-cream hover:text-charcoal transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> Order on WhatsApp
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          className="mt-auto pt-16"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] sm:text-xs tracking-[0.12em] uppercase text-sand/85">
            <span>🌿 Soil-Free · 95% Less Water</span>
            <span className="hidden sm:inline w-px h-3 bg-sand/30" />
            <span>📦 Weekly Curated Boxes</span>
            <span className="hidden sm:inline w-px h-3 bg-sand/30" />
            <span>🛵 Delivered Fresh</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
