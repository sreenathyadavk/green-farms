import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(72),
});

type Mode = "signin" | "signup";

const FloatingLeaves = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ y: "110vh", x: `${Math.random() * 100}vw`, rotate: 0, opacity: 0 }}
          animate={{
            y: "-10vh",
            x: `calc(${Math.random() * 100}vw + ${Math.random() > 0.5 ? "" : "-"}${Math.random() * 50}px)`,
            rotate: 360,
            opacity: [0, Math.random() * 0.3 + 0.1, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 15,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-forest/40 w-6 h-6 sm:w-10 sm:h-10">
            <path d="M12 22c0 0-8-4.5-8-12 0-4.4 3.6-8 8-8s8 3.6 8 8c0 7.5-8 12-8 12z" strokeWidth="1"/>
            <path d="M12 22V10" strokeWidth="1"/>
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

const PullingSilhouette = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={`w-32 h-32 sm:w-40 sm:h-40 opacity-90 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Head leaning heavily left */}
    <circle cx="30" cy="30" r="7" className="text-forest fill-forest/20" />
    {/* Torso leaning left */}
    <path d="M30 37 Q20 55 25 75" className="text-forest" />
    {/* Back leg planted */}
    <path d="M25 75 L10 95" className="text-forest" />
    {/* Front leg bent pulling */}
    <path d="M25 75 L45 95" className="text-forest" />
    {/* Arms extended to the right holding the edge of the form */}
    <path d="M28 48 L70 50 L100 50" className="text-forest" />
    {/* Hands gripping the edge of the form */}
    <path d="M96 40 L96 60" className="text-gold stroke-[4px]" />
  </svg>
);

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [animPhase, setAnimPhase] = useState(0);

  useEffect(() => {
    if (!authLoading && user) navigate("/", { replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const t1 = setTimeout(() => setAnimPhase(1), 300);
    return () => clearTimeout(t1);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = authSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast({ title: "Check your details", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast({ title: "Welcome to the farm 🌿", description: "Account created. You're signed in." });
        navigate("/", { replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast({ title: "Welcome back", description: "Signed in successfully." });
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      const msg = err?.message || "Something went wrong";
      const friendly = msg.includes("already registered")
        ? "This email is already registered. Try signing in."
        : msg.includes("Invalid login")
        ? "Invalid email or password."
        : msg;
      toast({ title: "Authentication failed", description: friendly, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-charcoal grain relative overflow-hidden flex items-center justify-center px-5 py-10">
      {/* Ambient orbs */}
      <motion.div
        aria-hidden
        className="absolute -top-32 -right-20 w-[440px] h-[440px] rounded-full bg-sage/20 blur-[120px]"
        animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-32 -left-20 w-[380px] h-[380px] rounded-full bg-gold/10 blur-[120px]"
        animate={{ y: [0, -25, 0], x: [0, 15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-cream/70 hover:text-gold text-sm transition-colors z-10"
      >
        <ArrowLeft className="w-4 h-4" /> Back to farm
      </Link>

      <FloatingLeaves />

      <motion.div
        initial={{ x: "20vw", y: "10vh", opacity: 0 }}
        animate={{ x: animPhase >= 1 ? 0 : "20vw", y: animPhase >= 1 ? 0 : "10vh", opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 50, 
          damping: 12, 
          mass: 1.2,
        }}
        className="relative z-10 w-full max-w-md flex flex-col items-center mt-16 sm:mt-0"
      >
        {/* SVG Pulling Character (Always visible) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="absolute bottom-[100%] sm:bottom-auto sm:-translate-y-1/2 sm:top-[40%] sm:right-[100%] pointer-events-none flex justify-center w-full sm:w-auto z-20"
        >
          <PullingSilhouette className="rotate-90 sm:rotate-0 -mb-4 sm:mb-0 sm:-mr-2" />
        </motion.div>

        <div className="w-full relative">
        <div className="flex flex-col items-center text-center mb-8">
          <img src={logo} alt="B.Tech Wala Hydro Farm" className="w-14 h-14 object-contain mb-4" />
          <span className="label-eyebrow text-gold mb-2">✦ B.Tech Wala Hydro Farm</span>
          <h1 className="font-display text-cream text-4xl sm:text-5xl leading-[1.05] tracking-tight">
            {mode === "signin" ? (
              <>Welcome <span className="italic text-gold">back.</span></>
            ) : (
              <>Join the <span className="italic text-gold">harvest.</span></>
            )}
          </h1>
          <p className="mt-3 text-sand/75 text-sm max-w-xs">
            {mode === "signin"
              ? "Sign in to track your orders and reorder favourites in seconds."
              : "Create your account to save selections and order faster every week."}
          </p>
        </div>

        <div className="rounded-3xl border border-cream/10 bg-cream/[0.04] backdrop-blur-xl p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
          {/* Premium Sliding Tabs */}
          <div className="relative grid grid-cols-2 p-1.5 rounded-2xl bg-forest/20 border border-forest/30 mb-8">
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl bg-forest shadow-[0_2px_10px_rgba(26,46,26,0.4)]"
              style={{ left: mode === "signin" ? 6 : "calc(50% + 0px)" }}
            />
            {(["signin", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`relative z-10 h-11 text-[13px] font-semibold tracking-[0.1em] uppercase transition-colors duration-300 ${
                  mode === m ? "text-cream" : "text-cream/50 hover:text-cream/80"
                }`}
              >
                {m === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === "signin" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === "signin" ? 20 : -20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-eyebrow text-cream/60 block mb-2">Email</label>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@harvest.farm"
                className="w-full h-12 px-4 rounded-xl bg-charcoal/60 border border-cream/15 text-cream placeholder:text-cream/30 text-sm focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20 transition-all"
              />
            </div>

            <div>
              <label className="label-eyebrow text-cream/60 block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full h-12 pl-4 pr-12 rounded-xl bg-charcoal/60 border border-cream/15 text-cream placeholder:text-cream/30 text-sm focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 inline-flex items-center justify-center text-cream/50 hover:text-gold transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileTap={{ scale: 0.98 }}
              className="w-full h-13 mt-4 rounded-xl bg-forest text-cream text-sm font-semibold tracking-wide hover:bg-teal transition-colors shadow-card-hover disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 py-4 border border-cream/10"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <AnimatePresence mode="wait">
                <motion.span
                  key={mode + (submitting ? "-load" : "")}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  {submitting
                    ? mode === "signin"
                      ? "Signing in..."
                      : "Creating account..."
                    : mode === "signin"
                    ? "Sign In"
                    : "Create Account"}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </form>

          <p className="mt-6 text-center text-cream/60 text-[13px]">
            {mode === "signin" ? (
              <>New to the farm?{" "}
                <button onClick={() => setMode("signup")} className="text-gold font-medium hover:underline decoration-gold/50 underline-offset-4">Create an account</button>
              </>
            ) : (
              <>Already a customer?{" "}
                <button onClick={() => setMode("signin")} className="text-gold font-medium hover:underline decoration-gold/50 underline-offset-4">Sign in</button>
              </>
            )}
          </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <p className="mt-6 text-center text-cream/40 text-[11px] tracking-[0.12em] uppercase">
          🌿 Soil-Free · Pesticide-Free · Hyderabad
        </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
