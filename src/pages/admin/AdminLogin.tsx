import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Leaf } from "lucide-react";
import { useAdminAuth } from "@/store/adminAuth";

export const AdminLogin = () => {
  const login = useAdminAuth((s) => s.login);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(pin);
    if (!ok) {
      setError("Incorrect password. Try again.");
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setPin("");
    }
  };

  return (
    <div className="min-h-screen bg-charcoal grain flex items-center justify-center px-5">
      <motion.div
        animate={shaking ? { x: [-12, 12, -8, 8, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-full bg-forest flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(108,140,90,0.4)]">
            <Leaf className="w-8 h-8 text-cream" />
          </div>
          <h1 className="font-display text-cream text-3xl">Admin Portal</h1>
          <p className="text-sand/60 text-sm mt-1">B.Tech Wala Hydro Farm</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-cream/10 bg-cream/[0.04] backdrop-blur-xl p-8 space-y-5">
          <div>
            <label className="block text-[11px] font-bold tracking-widest uppercase text-sage mb-2">Admin Password</label>
            <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-charcoal/60 border border-cream/15 focus-within:border-gold/60 transition-colors">
              <Lock className="w-4 h-4 text-cream/40 shrink-0" />
              <input
                type="password"
                value={pin}
                onChange={(e) => { setPin(e.target.value); setError(""); }}
                placeholder="Enter admin password"
                className="flex-1 bg-transparent text-cream text-sm outline-none placeholder:text-cream/30"
                autoFocus
              />
            </div>
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-xl bg-forest text-cream text-sm font-semibold hover:bg-teal transition-colors shadow-card-hover"
          >
            Sign In to Dashboard
          </motion.button>
        </form>

        <p className="text-center text-cream/30 text-xs mt-6">Default: btw-admin-2024</p>
      </motion.div>
    </div>
  );
};
