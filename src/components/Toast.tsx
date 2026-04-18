import { useToast } from "@/store/toast";
import { AnimatePresence, motion } from "framer-motion";

export const Toast = () => {
  const message = useToast((s) => s.message);
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-24 left-1/2 z-[120] px-5 py-3 rounded-full bg-forest text-cream text-[13px] shadow-card-hover"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
