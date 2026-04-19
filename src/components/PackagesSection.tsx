import { motion } from "framer-motion";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { packages, addOns, type Package } from "@/data/catalog";
import { PackageModal } from "./PackageModal";
import { openWhatsApp, buildPackageMessage } from "@/lib/whatsapp";

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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10 }}
                className={`glass-card rounded-[28px] overflow-hidden flex flex-col group transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)] ${pkg.featured ? "md:-mt-4 md:scale-[1.02]" : ""}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <motion.img
                    src={pkg.image}
                    alt={pkg.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <span
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] tracking-[0.16em] uppercase font-semibold ${
                      pkg.badgeAccent ? "bg-gold text-charcoal" : "bg-cream/85 backdrop-blur text-forest"
                    }`}
                  >
                    {pkg.badge}
                  </span>
                </div>
                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  <h3 className="font-display text-2xl text-cream">{pkg.name}</h3>
                  <p className="mt-2 text-sand/85 text-sm leading-relaxed">{pkg.summary}</p>
                  <ul className="mt-5 space-y-1.5">
                    {pkg.contents.map((c) => (
                      <li key={c} className="text-[13px] text-sand/75 flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-gold shrink-0" /> {c}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="font-display text-3xl text-gold font-semibold">{pkg.price}</span>
                    <span className="text-sm text-cream/70">/ week</span>
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <button
                      onClick={() => setSelected(pkg)}
                      className="flex-1 h-11 px-5 rounded-full border border-cream/70 text-cream text-sm font-medium hover:bg-cream hover:text-charcoal transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      aria-label="Order on WhatsApp"
                      onClick={() => openWhatsApp(buildPackageMessage(pkg.name, pkg.price))}
                      className="w-11 h-11 rounded-full bg-[#25D366] text-white inline-flex items-center justify-center shrink-0"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
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
