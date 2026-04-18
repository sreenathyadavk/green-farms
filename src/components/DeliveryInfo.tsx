import { motion } from "framer-motion";

const cards = [
  { icon: "📦", title: "COD Available", text: "Cash on delivery accepted. No prepayment stress." },
  { icon: "📱", title: "WhatsApp Ordering", text: "Browse here, order on WhatsApp. Simple, personal, fast." },
  { icon: "🌿", title: "Weekly Fresh Delivery", text: "Salad boxes delivered weekly. Always fresh, always consistent." },
  { icon: "💬", title: "Dedicated Support", text: "Direct communication with the farm. Your questions, answered personally." },
];

export const DeliveryInfo = () => {
  return (
    <section id="order" className="bg-mist py-20 sm:py-24">
      <div className="container mx-auto">
        <div className="max-w-2xl mb-12">
          <p className="label-eyebrow text-gold mb-4">DELIVERY & ORDERING</p>
          <h2 className="font-display text-text-dark leading-[1.1]" style={{ fontSize: "clamp(32px, 5vw, 44px)" }}>
            Ordering Made Simple
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="bg-cream rounded-[20px] p-6 shadow-card"
            >
              <div className="text-2xl mb-3">{c.icon}</div>
              <h3 className="font-semibold text-text-dark">{c.title}</h3>
              <p className="mt-1.5 text-sm text-text-muted leading-relaxed">{c.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
