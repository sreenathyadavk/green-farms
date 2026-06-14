import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import kaleImg from "@/assets/p-kale.jpg";
import lettuceImg from "@/assets/p-lettuce-green.jpg";
import tomatoImg from "@/assets/p-tomato.jpg";
import mixImg from "@/assets/p-lettucemix.jpg";
import { RecipeShowcase } from "./RecipeShowcase";

const recipes = [
  {
    id: 1,
    title: "Classic Hydroponic Kale Caesar",
    desc: "Crisp hydroponic kale massaged with olive oil, tossed with house-made caesar dressing and parmesan shavings.",
    image: kaleImg,
  },
  {
    id: 2,
    title: "Summer Berry & Butter Lettuce",
    desc: "Tender butter lettuce paired with fresh summer berries, goat cheese, and a light citrus vinaigrette.",
    image: lettuceImg,
  },
  {
    id: 3,
    title: "Roasted Cherry Tomato Caprese",
    desc: "Plump, sweet vine-ripened cherry tomatoes with fresh basil, mozzarella balls, and balsamic glaze.",
    image: tomatoImg,
  },
  {
    id: 4,
    title: "Farmhouse Mix Power Bowl",
    desc: "A curated blend of green and red lettuce varieties topped with quinoa, avocado, and microgreens.",
    image: mixImg,
  },
];

export const RecipeSection = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<typeof recipes[0] | null>(null);

  return (
    <section className="py-20 sm:py-28 bg-mist relative overflow-hidden">
      <div className="container mx-auto px-5 sm:px-8">
        <div className="text-center mb-16 sm:mb-24">
          <p className="label-eyebrow text-sage mb-3">FARM TO TABLE</p>
          <h2 className="font-display text-text-dark text-4xl sm:text-5xl leading-tight">
            Curated <span className="italic text-forest">Recipes</span>
          </h2>
          <p className="mt-4 text-text-muted max-w-xl mx-auto text-sm sm:text-base">
            Elevate your daily greens with our chef-inspired hydroponic recipes. Simple, fresh, and nutritious.
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col gap-12 sm:gap-20">
          {recipes.map((recipe, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, x: isEven ? -50 : 50, rotate: isEven ? -4 : 4 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`flex flex-col ${isEven ? "sm:flex-row" : "sm:flex-row-reverse"} items-center gap-8 sm:gap-16 group`}
              >
                <div className="w-full sm:w-1/2 relative cursor-pointer" onClick={() => setSelectedRecipe(recipe)}>
                  <div className="absolute inset-0 bg-gold/10 rounded-3xl transform rotate-3 scale-105 group-hover:rotate-6 transition-transform duration-500" />
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card">
                    <motion.img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-1/2 flex flex-col gap-3">
                  <span className="text-xs font-semibold text-gold tracking-widest uppercase">Recipe {index + 1}</span>
                  <h3 className="font-display text-2xl sm:text-3xl text-text-dark">{recipe.title}</h3>
                  <p className="text-text-muted leading-relaxed text-sm sm:text-base">{recipe.desc}</p>
                  <button 
                    onClick={() => setSelectedRecipe(recipe)}
                    className="mt-2 self-start text-forest font-semibold text-sm hover:text-gold transition-colors inline-flex items-center gap-1.5"
                  >
                    Read Recipe <span>→</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedRecipe && (
          <RecipeShowcase recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};
