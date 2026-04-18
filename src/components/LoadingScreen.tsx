import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const LoadingScreen = ({ onDone }: { onDone: () => void }) => {
  const [stage, setStage] = useState<"progress" | "lift" | "done">("progress");

  useEffect(() => {
    const t1 = setTimeout(() => setStage("lift"), 1900);
    const t2 = setTimeout(() => {
      setStage("done");
      onDone();
    }, 1900 + 900 + 80 * 3);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  if (stage === "done") return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Logo + progress overlay */}
      <AnimatePresence>
        {stage === "progress" && (
          <motion.div
            key="logo"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-[102] flex flex-col items-center justify-center text-center px-6"
          >
            <div className="font-display text-cream text-[40px] sm:text-6xl leading-none tracking-tight">
              B.Tech Wala
            </div>
            <div className="mt-3 text-[11px] sm:text-sm tracking-[0.32em] text-cream/80">
              <span className="text-gold">HYDRO</span> &nbsp;FARM
            </div>
            <div className="mt-10 h-px w-56 sm:w-72 bg-cream/15 overflow-hidden">
              <motion.div
                className="h-full bg-gold"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 panels */}
      <div className="absolute inset-0 z-[101] grid grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="bg-charcoal h-full w-full"
            initial={{ y: 0 }}
            animate={stage === "lift" ? { y: "-100%" } : { y: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: stage === "lift" ? i * 0.08 : 0 }}
          />
        ))}
      </div>
    </div>
  );
};
