import { motion } from "framer-motion";

const features = [
  { icon: "🌱", title: "Soil-Free Cultivation", text: "Grown in precisely controlled nutrient water — no soil, no pesticides, no compromise." },
  { icon: "💧", title: "95% Less Water", text: "Hydroponic farming uses a fraction of the water traditional farming requires." },
  { icon: "🥗", title: "Curated Weekly Boxes", text: "Perfectly assembled salad boxes for every lifestyle and nutritional need." },
  { icon: "📦", title: "Premium Quality", text: "Every leaf, stem, and tomato is handpicked and quality-checked before packing." },
  { icon: "📱", title: "WhatsApp-First Ordering", text: "No apps. No complex checkout. Just order directly via WhatsApp — fast and personal." },
  { icon: "🚴", title: "Fresh Delivery", text: "Harvested and delivered on the same day for maximum freshness and nutrition." },
];

export const WhyUs = () => {
  return (
    <section className="bg-mist py-20 sm:py-28">
      <div className="container mx-auto">
        <div className="max-w-2xl mb-14">
          <p className="label-eyebrow text-gold mb-4">THE DIFFERENCE</p>
          <h2 className="font-display text-text-dark leading-[1.1]" style={{ fontSize: "clamp(34px, 5.2vw, 52px)" }}>
            Why B.Tech Wala<br/><span className="italic font-normal">Hydro Farm?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="bg-cream rounded-[20px] p-7 shadow-card hover:shadow-card-hover transition-shadow duration-300"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-text-dark">{f.title}</h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
