import kale from "@/assets/p-kale.jpg";
import lettuceGreen from "@/assets/p-lettuce-green.jpg";
import lettuceRed from "@/assets/p-lettuce-red.jpg";
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
import mgWhiteRadish from "@/assets/mg-white-radish.jpg";
import mgPurpleRadish from "@/assets/mg-purple-radish.jpg";
import mgSunflower from "@/assets/mg-sunflower.jpg";
import mgBasil from "@/assets/mg-basil.jpg";
import mgBroccoli from "@/assets/mg-broccoli.jpg";
import mgWheatgrass from "@/assets/mg-wheatgrass.jpg";

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
  harvestNote?: string;
}

export const products: Product[] = [
  { id: "kale", name: "Hydro Fresh Kale", category: "Greens", tag: "HYDRO GROWN", short: "Crisp, nutrient-dense kale.", description: "Crisp, nutrient-dense kale from clean hydroponic beds. Naturally rich in iron, calcium and vitamin K.", price: "₹80–₹120", priceValue: 100, image: kale, idealFor: "Smoothies, salads, sautés", serving: "Massage with olive oil for tender salads", packSize: "150–200g" },
  { id: "lettuce-green", name: "Premium Green Lettuce", category: "Greens", tag: "HYDRO GROWN", short: "Soft, butter-textured heads.", description: "Soft, butter-textured green lettuce heads grown in controlled nutrient flow for unmatched tenderness.", price: "₹60–₹90", priceValue: 75, image: lettuceGreen, idealFor: "Wraps, sandwiches, fresh salads", serving: "Tear by hand for the best texture", packSize: "1 head, ~250g" },
  { id: "lettuce-red", name: "Premium Red Lettuce", category: "Greens", tag: "HYDRO GROWN", short: "Ruffled crimson, mellow bite.", description: "Deep crimson red lettuce — ruffled, tender leaves with a mellow, slightly nutty character.", price: "₹70–₹100", priceValue: 85, image: lettuceRed, idealFor: "Signature salads, gourmet plating", serving: "Pairs beautifully with citrus and goat cheese", packSize: "1 head, ~250g" },
  { id: "lettuce-mix", name: "Lettuce Mix", category: "Greens", tag: "FRESH MIX", short: "Curated green & red blend.", description: "A curated blend of green and red lettuce varieties — colour, crunch and a refined flavour balance.", price: "₹90–₹130", priceValue: 110, image: lettuceMix, idealFor: "Signature salads, plating", serving: "Pairs beautifully with citrus vinaigrette", packSize: "200g pack" },
  { id: "basil", name: "Fresh Basil Pack", category: "Herbs", tag: "FRESH HERB", short: "Aromatic, hand-harvested basil.", description: "Aromatic basil harvested fresh and packed within hours. Bright, peppery, unmistakable.", price: "₹50–₹80", priceValue: 65, image: basil, idealFor: "Pasta, pesto, garnishes", serving: "Tear at the last moment to preserve aroma", packSize: "50–100g" },
  { id: "pepper", name: "Hydro Bell Pepper", category: "Greens", tag: "HYDRO GROWN", short: "Vibrant, crunchy, pesticide-free.", description: "Vibrant, crunchy and pesticide-free bell peppers in red, yellow and green.", price: "₹100–₹140", priceValue: 120, image: pepper, idealFor: "Stir-fry, roasting, salads", serving: "Roast whole for sweet, smoky depth", packSize: "2–3 pieces" },
  { id: "broccoli", name: "Fresh Broccoli", category: "Greens", tag: "HYDRO GROWN", short: "Firm florets, deep nutrition.", description: "Firm, clean broccoli florets with deep nutritional value and a subtle sweetness.", price: "₹90–₹120", priceValue: 105, image: broccoli, idealFor: "Steaming, roasting, soups", serving: "Steam 4 minutes for perfect bite", packSize: "1 head, ~400g" },
  { id: "tomato", name: "Hydro Cherry Tomatoes", category: "Premium", tag: "PREMIUM", short: "Plump, sweet, vine-ripened.", description: "Plump, sweet, vine-ripened cherry tomatoes — bursts of summer in every bite.", price: "₹120–₹160", priceValue: 140, image: tomato, idealFor: "Salads, pasta, snacking", serving: "Slow-roast with olive oil and thyme", packSize: "250g punnet" },
  { id: "cucumber", name: "Farm Cucumber", category: "Greens", tag: "FRESH", short: "Cool, crisp, salad essential.", description: "Cool, crisp cucumbers — the daily salad essential, grown clean and crunchy.", price: "₹50–₹70", priceValue: 60, image: cucumber, idealFor: "Salads, raita, infused water", serving: "Slice thin and salt for instant pickle", packSize: "2 pieces, ~400g" },

  // Microgreens — 50g, ₹150, requires 7-day harvest lead time
  { id: "mg-white-radish", name: "White Radish Microgreens", category: "Microgreens", tag: "PRE-ORDER · 7 DAY HARVEST", short: "Crisp, peppery white shoots.", description: "Delicate white-stemmed radish microgreens with a clean peppery bite. Sown to order — harvested at peak nutrition.", price: "₹150", priceValue: 150, image: mgWhiteRadish, idealFor: "Salads, sandwiches, garnish", serving: "Snip just before serving", packSize: "50g tray", harvestNote: "Sown to order — delivered after 7-day harvest cycle" },
  { id: "mg-purple-radish", name: "Purple Radish Microgreens", category: "Microgreens", tag: "PRE-ORDER · 7 DAY HARVEST", short: "Vivid magenta, bold spice.", description: "Stunning purple-stemmed radish microgreens — vibrant colour, sharp peppery flavour, dense nutrition.", price: "₹150", priceValue: 150, image: mgPurpleRadish, idealFor: "Plating, salads, finishing", serving: "Use as a vibrant garnish for contrast", packSize: "50g tray", harvestNote: "Sown to order — delivered after 7-day harvest cycle" },
  { id: "mg-sunflower", name: "Sunflower Microgreens", category: "Microgreens", tag: "PRE-ORDER · 7 DAY HARVEST", short: "Crunchy, nutty, protein-rich.", description: "Thick, crunchy sunflower microgreens with a buttery, nutty taste. Loaded with plant protein.", price: "₹150", priceValue: 150, image: mgSunflower, idealFor: "Smoothie bowls, wraps, salads", serving: "Eat raw to retain natural enzymes", packSize: "50g tray", harvestNote: "Sown to order — delivered after 7-day harvest cycle" },
  { id: "mg-basil", name: "Basil Microgreens", category: "Microgreens", tag: "PRE-ORDER · 7 DAY HARVEST", short: "Concentrated basil aroma.", description: "Tiny basil microgreens packed with intense aroma — the essence of basil in concentrated form.", price: "₹150", priceValue: 150, image: mgBasil, idealFor: "Pasta, pizza, mocktails", serving: "Sprinkle over hot dishes off-heat", packSize: "50g tray", harvestNote: "Sown to order — delivered after 7-day harvest cycle" },
  { id: "mg-broccoli", name: "Broccoli Microgreens", category: "Microgreens", tag: "PRE-ORDER · 7 DAY HARVEST", short: "Sulforaphane-rich superfood.", description: "Broccoli microgreens — exceptionally high in sulforaphane, a celebrated antioxidant compound.", price: "₹150", priceValue: 150, image: mgBroccoli, idealFor: "Smoothies, salads, toasts", serving: "Blend into morning smoothies", packSize: "50g tray", harvestNote: "Sown to order — delivered after 7-day harvest cycle" },
  { id: "mg-wheatgrass", name: "Fresh Wheatgrass", category: "Microgreens", tag: "PRE-ORDER · 7 DAY HARVEST", short: "Pure chlorophyll energy shot.", description: "Vibrant wheatgrass — juiced fresh for a daily chlorophyll-rich energy ritual.", price: "₹150", priceValue: 150, image: mgWheatgrass, idealFor: "Daily juice shots, detox", serving: "Cold-press for maximum nutrition", packSize: "50g tray", harvestNote: "Sown to order — delivered after 7-day harvest cycle" },
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

export const WHATSAPP_NUMBER = "917075786577";
export const WHATSAPP_DISPLAY = "+91 70757 86577";
export const DELIVERY_CHARGE = 100;
