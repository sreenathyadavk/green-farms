import { motion } from "framer-motion";
import { Link, useLocation, Navigate } from "react-router-dom";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

export const Success = () => {
  const [orderId, setOrderId] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Generate a random order ID like BTW-12345
    const id = `BTW-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderId(id);
  }, []);

  return (
    <div className="min-h-screen bg-mist flex items-center justify-center p-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sage/20 via-mist to-mist pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card max-w-lg w-full rounded-3xl p-8 sm:p-12 text-center relative z-10 shadow-card"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
          className="mx-auto w-24 h-24 bg-forest rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(26,46,26,0.3)]"
        >
          <CheckCircle className="w-12 h-12 text-cream" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-display text-4xl sm:text-5xl text-text-dark mb-3"
        >
          Order <span className="italic text-forest">Confirmed</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-text-muted text-sm sm:text-base leading-relaxed mb-8"
        >
          Thank you for choosing B.Tech Wala Hydro Farm. Your WhatsApp order details have been prepared. We will confirm your delivery slot shortly.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-sand/30 rounded-xl p-4 mb-8 inline-block min-w-[200px]"
        >
          <p className="text-[11px] font-semibold tracking-widest text-sage uppercase mb-1">Order ID</p>
          <p className="font-display text-2xl text-text-dark">{orderId}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-2 h-13 px-8 rounded-full bg-forest text-cream text-sm font-semibold hover:bg-teal transition-colors shadow-card-hover"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Success;
