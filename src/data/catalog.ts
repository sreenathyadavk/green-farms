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

// Products are now dynamically loaded from the API / Google Sheets

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
