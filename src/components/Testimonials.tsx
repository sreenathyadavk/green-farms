import { motion } from "framer-motion";

const testimonials = [
  { quote: "I've been ordering the Premium Salad Box every week for two months and the quality never drops. These aren't your regular market vegetables — you can actually taste the freshness.", name: "Priya M.", tag: "Premium Box Subscriber" },
  { quote: "The Fitness Box is exactly what my meal prep needed. The microgreens and kale are packed with flavour and I feel good knowing there are no pesticides.", name: "Arjun K.", tag: "Fitness Box Subscriber" },
  { quote: "Ordering on WhatsApp is so convenient. No apps, no logins, just fresh produce at my door. Best discovery of the year.", name: "Sneha R.", tag: "Basic Box Subscriber" },
];

export const Testimonials = () => {
  return (
    <section className="bg-forest grain py-20 sm:py-28">
      <div className="container mx-auto">
        <div className="max-w-2xl mb-12">
          <p className="label-eyebrow text-gold mb-4">CUSTOMER LOVE</p>
          <h2 className="font-display text-cream leading-[1.1]" style={{ fontSize: "clamp(34px, 5vw, 48px)" }}>
            Fresh Results,<br/><span className="italic font-normal">Every Week</span>
          </h2>
        </div>

        <div className="flex md:grid md:grid-cols-3 gap-5 overflow-x-auto md:overflow-visible no-scrollbar snap-x-mandatory -mx-5 px-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="glass-card rounded-[24px] p-7 min-w-[85%] md:min-w-0 snap-start relative"
            >
              <span className="absolute top-4 left-5 font-display text-[80px] text-gold/40 leading-none">"</span>
              <p className="relative italic text-sand/90 leading-relaxed pt-8">{t.quote}</p>
              <div className="mt-6 pt-5 border-t border-cream/10">
                <div className="text-gold mb-1.5 tracking-widest text-sm">★★★★★</div>
                <p className="text-cream font-semibold text-sm">{t.name}</p>
                <p className="text-gold text-xs mt-0.5">{t.tag}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
