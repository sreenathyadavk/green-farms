import { motion } from "framer-motion";
import heroImg from "@/assets/hero-greens.jpg";
import { MessageCircle } from "lucide-react";
import { openWhatsApp } from "@/lib/whatsapp";

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

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className="font-display text-cream mt-7 sm:mt-10 leading-[1.0] tracking-tight"
          style={{ fontSize: "clamp(56px, 12vw, 128px)", letterSpacing: "-0.025em", fontWeight: 700 }}
        >
          Freshness,
          <br />
          <span className="italic font-normal text-gold">Reimagined.</span>
        </motion.h1>

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
            className="inline-flex items-center justify-center h-13 px-7 py-4 rounded-full bg-gold text-charcoal text-sm font-semibold tracking-wide hover:scale-[1.02] transition-transform"
          >
            Explore Our Produce
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
