import { motion } from "framer-motion";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { packages, addOns, type Package } from "@/data/catalog";
import { PackageModal } from "./PackageModal";
import { openWhatsApp, buildPackageMessage } from "@/lib/whatsapp";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

export const PackagesSection = () => {
  const [selected, setSelected] = useState<Package | null>(null);

  return (
    <>
      <section id="packages" className="bg-forest grain py-20 sm:py-28 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="max-w-2xl mb-14">
            <p className="label-eyebrow text-gold mb-4">CURATED WEEKLY BOXES</p>
            <h2 className="font-display text-cream leading-[1.1]" style={{ fontSize: "clamp(38px, 5.8vw, 56px)" }}>
              Salad <span className="italic font-normal">Packages</span>
            </h2>
            <p className="mt-5 text-sand/80 text-base sm:text-lg leading-relaxed">
              Choose your weekly salad ritual. Fresh-packed. Hydro-grown. Delivered with care.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-7 items-start">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                whileHover={{ y: -12 }}
                className={`glass-card rounded-[28px] overflow-hidden flex flex-col group transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)] ${pkg.featured ? "md:-mt-4 md:scale-[1.02] border-gold/30" : "border-cream/10"}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* Circular Motion Effect */}
                  <motion.div 
                    className="absolute inset-0 z-0 bg-gradient-to-tr from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, ease: "linear", repeat: Infinity }}
                    style={{ transformOrigin: "center center", scale: 1.5 }}
                  />
                  
                  <motion.img
                    variants={{
                      hidden: { scale: 1.15, opacity: 0 },
                      visible: { scale: 1, opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
                    }}
                    src={pkg.image}
                    alt={pkg.name}
                    loading="lazy"
                    className="w-full h-full object-cover relative z-10"
                    whileHover={{ scale: 1.08 }}
                  />
                  <span
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] tracking-[0.16em] uppercase font-semibold z-20 shadow-card ${
                      pkg.badgeAccent ? "bg-gold text-charcoal" : "bg-cream/90 backdrop-blur text-forest"
                    }`}
                  >
                    {pkg.badge}
                  </span>
                </div>
                <div className="p-6 sm:p-7 flex flex-col flex-1 relative z-10">
                  <motion.h3 variants={itemVariants} className="font-display text-2xl text-cream">{pkg.name}</motion.h3>
                  <motion.p variants={itemVariants} className="mt-2 text-sand/85 text-sm leading-relaxed">{pkg.summary}</motion.p>
                  
                  <motion.ul variants={itemVariants} className="mt-5 space-y-1.5 flex-1">
                    {pkg.contents.map((c) => (
                      <li key={c} className="text-[13px] text-sand/75 flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-gold shrink-0 shadow-[0_0_8px_rgba(196,168,130,0.8)]" /> {c}
                      </li>
                    ))}
                  </motion.ul>
                  
                  <motion.div variants={itemVariants} className="mt-6 flex items-baseline gap-1.5">
                    <span className="font-display text-3xl text-gold font-semibold">{pkg.price}</span>
                    <span className="text-sm text-cream/70">/ week</span>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="mt-5 flex items-center gap-3">
                    <button
                      onClick={() => setSelected(pkg)}
                      className="flex-1 h-11 px-5 rounded-full border border-cream/50 text-cream text-sm font-medium hover:bg-cream hover:text-charcoal transition-colors"
                    >
                      View Details
                    </button>
                    <motion.button
                      aria-label="Order on WhatsApp"
                      onClick={() => openWhatsApp(buildPackageMessage(pkg.name, pkg.price))}
                      whileHover={{ scale: 1.15, rotate: -5, boxShadow: "0px 0px 20px rgba(37,211,102,0.6)" }}
                      whileTap={{ scale: 0.92 }}
                      className="w-11 h-11 rounded-full bg-[#25D366] text-white inline-flex items-center justify-center shrink-0 shadow-[0_4px_14px_rgba(37,211,102,0.45)] relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300" />
                      <MessageCircle className="w-4 h-4 relative z-10" />
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add-ons */}
          <div className="mt-16 max-w-3xl">
            <p className="text-gold text-sm font-medium mb-4">Enhance Your Box</p>
            <div className="flex flex-wrap gap-2.5">
              {addOns.map((a) => (
                <span key={a} className="px-4 py-2 rounded-full border border-cream/30 text-cream text-sm hover:bg-cream/10 transition cursor-pointer">
                  + {a}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PackageModal pkg={selected} onClose={() => setSelected(null)} />
    </>
  );
};
