import kale from "@/assets/p-kale.jpg";
import lettuce from "@/assets/p-lettuce.jpg";
import lettuceMix from "@/assets/p-lettucemix.jpg";
import basil from "@/assets/p-basil.jpg";
import microgreens from "@/assets/p-microgreens.jpg";
import pepper from "@/assets/p-pepper.jpg";
import broccoli from "@/assets/p-broccoli.jpg";
import tomato from "@/assets/p-tomato.jpg";
import cucumber from "@/assets/p-cucumber.jpg";
import boxBasic from "@/assets/box-basic.jpg";
import boxPremium from "@/assets/box-premium.jpg";
import boxFitness from "@/assets/box-fitness.jpg";

export type Category = "All" | "Greens" | "Herbs" | "Microgreens" | "Boxes" | "Fitness" | "Premium";

export interface Product {
  id: string;
  name: string;
  category: Exclude<Category, "All">;
  tag: string;
  short: string;
  description: string;
  price: string;
  priceValue: number;
  image: string;
  idealFor?: string;
  serving?: string;
  packSize?: string;
}

export const products: Product[] = [
  { id: "kale", name: "Hydro Fresh Kale", category: "Greens", tag: "HYDRO GROWN", short: "Crisp, nutrient-dense kale.", description: "Crisp, nutrient-dense kale from clean hydroponic beds. Naturally rich in iron, calcium and vitamin K.", price: "₹80–₹120", priceValue: 100, image: kale, idealFor: "Smoothies, salads, sautés", serving: "Massage with olive oil for tender salads", packSize: "150–200g" },
  { id: "lettuce", name: "Premium Green Lettuce", category: "Greens", tag: "HYDRO GROWN", short: "Soft, butter-textured heads.", description: "Soft, butter-textured lettuce heads grown in controlled nutrient flow for unmatched tenderness.", price: "₹60–₹90", priceValue: 75, image: lettuce, idealFor: "Wraps, sandwiches, fresh salads", serving: "Tear by hand for the best texture", packSize: "1 head, ~250g" },
  { id: "lettuce-mix", name: "Lettuce Mix", category: "Greens", tag: "FRESH MIX", short: "Curated green & red blend.", description: "A curated blend of green and red lettuce varieties — colour, crunch and a refined flavour balance.", price: "₹90–₹130", priceValue: 110, image: lettuceMix, idealFor: "Signature salads, plating", serving: "Pairs beautifully with citrus vinaigrette", packSize: "200g pack" },
  { id: "basil", name: "Fresh Basil Pack", category: "Herbs", tag: "FRESH HERB", short: "Aromatic, hand-harvested basil.", description: "Aromatic basil harvested fresh and packed within hours. Bright, peppery, unmistakable.", price: "₹50–₹80", priceValue: 65, image: basil, idealFor: "Pasta, pesto, garnishes", serving: "Tear at the last moment to preserve aroma", packSize: "50–100g" },
  { id: "microgreens", name: "Premium Microgreens", category: "Microgreens", tag: "SUPERFOOD", short: "Nutrient-packed micro shoots.", description: "Nutrient-packed micro shoots — the superfood garnish that elevates any dish.", price: "₹120–₹160", priceValue: 140, image: microgreens, idealFor: "Garnish, smoothies, toasts", serving: "Sprinkle just before serving", packSize: "50g tray" },
  { id: "pepper", name: "Hydro Bell Pepper", category: "Greens", tag: "HYDRO GROWN", short: "Vibrant, crunchy, pesticide-free.", description: "Vibrant, crunchy and pesticide-free bell peppers in red, yellow and green.", price: "₹100–₹140", priceValue: 120, image: pepper, idealFor: "Stir-fry, roasting, salads", serving: "Roast whole for sweet, smoky depth", packSize: "2–3 pieces" },
  { id: "broccoli", name: "Fresh Broccoli", category: "Greens", tag: "HYDRO GROWN", short: "Firm florets, deep nutrition.", description: "Firm, clean broccoli florets with deep nutritional value and a subtle sweetness.", price: "₹90–₹120", priceValue: 105, image: broccoli, idealFor: "Steaming, roasting, soups", serving: "Steam 4 minutes for perfect bite", packSize: "1 head, ~400g" },
  { id: "tomato", name: "Hydro Cherry Tomatoes", category: "Premium", tag: "PREMIUM", short: "Plump, sweet, vine-ripened.", description: "Plump, sweet, vine-ripened cherry tomatoes — bursts of summer in every bite.", price: "₹120–₹160", priceValue: 140, image: tomato, idealFor: "Salads, pasta, snacking", serving: "Slow-roast with olive oil and thyme", packSize: "250g punnet" },
  { id: "cucumber", name: "Farm Cucumber", category: "Greens", tag: "FRESH", short: "Cool, crisp, salad essential.", description: "Cool, crisp cucumbers — the daily salad essential, grown clean and crunchy.", price: "₹50–₹70", priceValue: 60, image: cucumber, idealFor: "Salads, raita, infused water", serving: "Slice thin and salt for instant pickle", packSize: "2 pieces, ~400g" },
];

export interface Package {
  id: string;
  name: string;
  badge: string;
  badgeAccent?: boolean;
  price: string;
  priceValue: number;
  summary: string;
  contents: string[];
  image: string;
  featured?: boolean;
}

export const packages: Package[] = [
  { id: "box-basic", name: "Basic Salad Box", badge: "STARTER", price: "₹299–₹349", priceValue: 325, summary: "Your daily salad foundation. Clean greens, simple freshness.", contents: ["Green Lettuce (200g)", "Red Lettuce (200g)", "Seasonal Herb", "Cucumber or Carrot"], image: boxBasic },
  { id: "box-premium", name: "Premium Salad Box", badge: "MOST POPULAR", badgeAccent: true, price: "₹499–₹599", priceValue: 549, summary: "Elevated variety for the refined salad palate.", contents: ["Green Lettuce", "Red Lettuce", "Kale", "Cherry Tomato (200g)", "Basil"], image: boxPremium, featured: true },
  { id: "box-fitness", name: "Fitness Box", badge: "PERFORMANCE", price: "₹699–₹899", priceValue: 799, summary: "Maximum nutrition for performance-driven lifestyles.", contents: ["Lettuce Mix", "Rocket / Kale", "Microgreens", "Cherry Tomato", "Zucchini / Broccoli", "Basil / Thyme"], image: boxFitness },
];

export const addOns = ["Extra Lettuce", "Microgreens", "Cherry Tomato", "Basil"];

export const WHATSAPP_NUMBER = "919999999999";
