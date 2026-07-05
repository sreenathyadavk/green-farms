const products = [
  {
    name: "Hydro Fresh Kale",
    description: "Crisp, nutrient-dense kale from clean hydroponic beds. Naturally rich in iron, calcium and vitamin K.",
    price: 100,
    image: "/src/assets/p-kale.jpg",
    type: "Greens",
    tags: ["HYDRO GROWN"],
    discount: 0
  },
  {
    name: "Premium Green Lettuce",
    description: "Soft, butter-textured green lettuce heads grown in controlled nutrient flow for unmatched tenderness.",
    price: 75,
    image: "/src/assets/p-lettuce-green.jpg",
    type: "Greens",
    tags: ["HYDRO GROWN"],
    discount: 10,
    discountLabel: "FRESH DEAL"
  },
  {
    name: "Hydro Cherry Tomatoes",
    description: "Plump, sweet, vine-ripened cherry tomatoes — bursts of summer in every bite.",
    price: 140,
    image: "/src/assets/p-tomato.jpg",
    type: "Premium",
    tags: ["PREMIUM"],
    discount: 0
  }
];

async function seed() {
  for (const product of products) {
    console.log(`Adding ${product.name}...`);
    try {
      const res = await fetch("http://localhost:4050/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
      });
      if (res.ok) {
        console.log(`✅ Added ${product.name}`);
      } else {
        console.error(`❌ Failed to add ${product.name}:`, await res.text());
      }
    } catch (err) {
      console.error(`❌ Error adding ${product.name}:`, err);
    }
  }
}

seed();
