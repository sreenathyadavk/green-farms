import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import farmImg from "@/assets/farm-story.jpg";

const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return <span ref={ref}>{n}{suffix}</span>;
};

export const FarmStory = () => {
  return (
    <section id="about" className="bg-charcoal grain py-20 sm:py-28 relative overflow-hidden">
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <p className="label-eyebrow text-gold mb-4">OUR STORY</p>
          <h2 className="font-display text-cream leading-[1.05]" style={{ fontSize: "clamp(36px, 5.4vw, 56px)" }}>
            Where Freshness<br/>Meets <span className="italic font-normal text-gold">Precision</span>
          </h2>
          <div className="mt-7 space-y-5 text-sand/85 leading-relaxed">
            <p>B.Tech Wala Hydro Farm was born from a belief that fresh food should be grown smarter — not just harder. We combine engineering thinking with agricultural passion to cultivate produce that is cleaner, fresher, and more nutritious than what you find in any market.</p>
            <p>Our hydroponic systems run in precisely controlled environments, eliminating the need for soil, minimizing water usage, and removing pesticides entirely. Every crop is monitored, measured, and managed with care.</p>
            <p>What you receive is not just vegetables. It is the result of a science-led growing process designed to bring you the best possible version of nature's produce.</p>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-5 sm:gap-8">
            {[
              { v: 95, s: "%", l: "Less water used" },
              { v: 100, s: "%", l: "Pesticide-free" },
              { v: 24, s: "hr", l: "Harvest to door" },
            ].map((stat) => (
              <div key={stat.l}>
                <div className="font-display text-4xl sm:text-5xl text-gold font-semibold leading-none">
                  <Counter value={stat.v} suffix={stat.s} />
                </div>
                <p className="mt-2 text-[11px] tracking-[0.14em] uppercase text-sand/70">{stat.l}</p>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/5] rounded-[28px] overflow-hidden"
        >
          <img src={farmImg} alt="Inside the hydroponic farm" loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};
