// ============================================================
// useProducts — Live reactive hook
// Reads products from the repository and re-fires whenever
// the admin changes anything (btw:products-changed event).
// Both the storefront AND admin section use this hook,
// so they are always in sync with zero manual refresh.
// ============================================================

import { useEffect, useState, useCallback } from "react";
import { productRepository } from "@/repositories";
import type { Product } from "@/types/models";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const data = await productRepository.getAll();
    setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
    window.addEventListener("btw:products-changed", reload);
    return () => window.removeEventListener("btw:products-changed", reload);
  }, [reload]);

  return { products, loading, reload };
}

// Helper: compute the effective display price accounting for discount
export function effectivePrice(product: Product): {
  display: string;       // e.g. "₹80" or "₹80–₹120"
  numeric: number;       // discounted numeric value
  original: string;      // original display string
  discounted: boolean;
  discountLabel: string | null;
} {
  if (product.discountPercentage) {
    const numeric = Math.round(product.priceValue * (1 - product.discountPercentage / 100));
    return {
      display: `₹${numeric}`,
      numeric,
      original: product.price,
      discounted: true,
      discountLabel: product.discountLabel ?? `${product.discountPercentage}% OFF`,
    };
  }
  return {
    display: product.price,
    numeric: product.priceValue,
    original: product.price,
    discounted: false,
    discountLabel: null,
  };
}
