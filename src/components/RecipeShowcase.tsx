import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X, Clock, Users, Flame, ArrowRight } from "lucide-react";

interface RecipeShowcaseProps {
  recipe: {
    id: number;
    title: string;
    desc: string;
    image: string;
    ingredients?: string[];
    steps?: string[];
    benefits?: string[];
  };
  onClose: () => void;
}

export const RecipeShowcase = ({ recipe, onClose }: RecipeShowcaseProps) => {
  const [phase, setPhase] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);

    // Animation Flow State Machine
    const t1 = setTimeout(() => setPhase(2), 500); // Trigger Flip
    const t2 = setTimeout(() => setPhase(3), 1500); // 0.6s flip + 0.4s pause -> Slide
    const t3 = setTimeout(() => setPhase(4), 2100); // Trigger Info Reveal

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const getCardAnimation = () => {
    if (phase === 1) return { x: 0, y: 0, scale: isMobile ? 1 : 1.2, rotateY: 0 };
    if (phase === 2) return { x: 0, y: 0, scale: isMobile ? 1 : 1.2, rotateY: 180 };
    // Phase 3 & 4
    return {
      x: isMobile ? 0 : "25vw",
      y: isMobile ? "-20vh" : 0,
      scale: isMobile ? 0.8 : 1,
      rotateY: 180,
    };
  };

  const panelVariants = {
    hidden: { opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 50 : 0 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  // Mock data if recipe doesn't have it
  const ingredients = recipe.ingredients || [
    "Fresh Hydroponic Lettuce",
    "Cherry Tomatoes",
    "Olive Oil & Lemon Juice",
    "Toasted Pine Nuts",
  ];
  const steps = recipe.steps || [
    "Wash and dry the greens gently.",
    "Toss with olive oil, lemon juice, and a pinch of salt.",
    "Garnish with tomatoes and pine nuts.",
    "Serve immediately for maximum crispness.",
  ];
  const benefits = recipe.benefits || ["Pesticide Free", "Zero Soil Contamination", "Nutrient Dense"];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={phase >= 4 ? onClose : undefined}
        className="absolute inset-0 bg-mist/95 backdrop-blur-2xl pointer-events-auto"
      />

      {phase >= 4 && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 rounded-full bg-cream/50 backdrop-blur-md hover:bg-cream inline-flex items-center justify-center text-text-dark z-50 transition-colors shadow-sm pointer-events-auto"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Info Panel */}
      {phase >= 4 && (
        <motion.div
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          className="absolute w-full sm:w-1/2 h-auto max-h-[60vh] sm:h-[80vh] bottom-0 sm:bottom-auto sm:left-0 flex flex-col justify-center px-6 sm:px-16 lg:px-24 pointer-events-auto overflow-y-auto no-scrollbar pb-10 sm:pb-0"
        >
          <motion.h2 variants={itemVariants} className="font-display text-4xl sm:text-5xl text-text-dark leading-[1.1] mb-4">
            {recipe.title}
          </motion.h2>

          <motion.p variants={itemVariants} className="text-text-muted text-base sm:text-lg mb-6 leading-relaxed">
            {recipe.desc}
          </motion.p>

          <motion.div variants={itemVariants} className="flex gap-4 sm:gap-6 mb-8 border-y border-forest/10 py-4">
            <div className="flex items-center gap-2 text-sm text-text-dark">
              <Clock className="w-4 h-4 text-forest" /> 15 Min
            </div>
            <div className="flex items-center gap-2 text-sm text-text-dark">
              <Users className="w-4 h-4 text-forest" /> 2 Servings
            </div>
            <div className="flex items-center gap-2 text-sm text-text-dark">
              <Flame className="w-4 h-4 text-forest" /> 120 kcal
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-sage mb-3">Ingredients</h4>
              <ul className="space-y-2">
                {ingredients.map((ing, i) => (
                  <li key={i} className="text-sm text-text-dark flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-forest shrink-0" /> {ing}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-sage mb-3">Health Benefits</h4>
              <ul className="space-y-2">
                {benefits.map((ben, i) => (
                  <li key={i} className="text-sm text-text-dark flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" /> {ben}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8">
            <h4 className="text-xs font-bold tracking-widest uppercase text-sage mb-3">Preparation</h4>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <p key={i} className="text-sm text-text-dark flex gap-3">
                  <span className="font-display text-forest">{i + 1}.</span> {step}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <button className="h-14 px-8 rounded-full bg-forest text-cream text-sm font-semibold tracking-wide hover:bg-teal transition-colors shadow-card-hover inline-flex items-center gap-2">
              Try This Recipe <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* The 3D Flipping Card */}
      <motion.div
        initial={{ y: "100vh", opacity: 0 }}
        animate={getCardAnimation()}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute w-[80vw] sm:w-[35vw] max-w-sm aspect-[4/5] perspective-1000 pointer-events-auto"
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ rotateY: phase >= 2 ? 180 : 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front of Card */}
          <div
            className="absolute inset-0 rounded-[32px] overflow-hidden shadow-card"
            style={{ backfaceVisibility: "hidden" }}
          >
            <img src={recipe.image} alt="Front" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-charcoal/20" />
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <h3 className="font-display text-3xl text-cream drop-shadow-md">{recipe.title}</h3>
            </div>
          </div>

          {/* Back of Card */}
          <div
            className="absolute inset-0 rounded-[32px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.3)] border border-cream/20 bg-forest"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <img src={recipe.image} alt="Back" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <span className="px-3 py-1 rounded-full text-[10px] tracking-[0.1em] uppercase bg-gold text-charcoal font-bold mb-3 inline-block">
                Chef's Special
              </span>
              <p className="text-cream text-sm font-medium leading-relaxed">
                "A perfect blend of hydroponic freshness and curated flavors."
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
