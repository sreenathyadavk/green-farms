/* eslint-disable @typescript-eslint/no-explicit-any, react-refresh/only-export-components, @typescript-eslint/no-require-imports, prefer-const */
import { Product } from "@/types/models";
import { IProductRepository } from "./interfaces";

const API_URL = import.meta.env.VITE_API_URL || "";

export class ApiProductRepository implements IProductRepository {
  async getAll(): Promise<Product[]> {
    const [productsRes, inventoryRes] = await Promise.all([
      fetch(`${API_URL}/api/products`),
      fetch(`${API_URL}/api/inventory`)
    ]);
    
    if (!productsRes.ok) throw new Error("Failed to fetch products");
    
    const productsData = await productsRes.json();
    const inventoryData = inventoryRes.ok ? await inventoryRes.json() : [];

    // Create a lookup map by Product ID only (never by name)
    const stockMap: Record<string, {stock: number, threshold: number}> = {};
    inventoryData.forEach((inv: any) => {
      if (inv.productId) stockMap[inv.productId] = { stock: inv.stock, threshold: inv.threshold };
    });

    return productsData.map((p: any) => {
      // Strictly ID-driven — backend guarantees every product has an inventory row
      const invInfo = stockMap[p.id] || { stock: 0, threshold: 10 };
      return {
        ...p,
        priceValue: p.price,
        price: `₹${p.price}`,
        category: p.type,
        tag: p.tags?.[0] || "",
        short: p.description?.substring(0, 50) || "",
        discountPercentage: p.discount || null,
        stock: invInfo.stock,
        lowStockThreshold: invInfo.threshold
      };
    });
  }

  async getById(id: string): Promise<Product | null> {
    const products = await this.getAll();
    return products.find(p => p.id === id) || null;
  }

  async create(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    const backendPayload = {
      id: `prod-${Date.now()}`,
      name: product.name,
      description: product.description,
      price: product.priceValue,
      image: product.image,
      type: product.category,
      tags: [product.tag, ...(product.tags || [])].filter(Boolean),
      badges: [],
      discount: product.discountPercentage || 0,
      discountLabel: product.discountLabel || ""
    };

    const res = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendPayload)
    });
    if (!res.ok) throw new Error("Failed to create product");
    
    // We just refetch to get the fully mapped object
    const all = await this.getAll();
    return all.find(p => p.id === backendPayload.id) as Product;
  }

  async update(id: string, partial: Partial<Product>): Promise<Product> {
    const backendPartial: any = {};
    if (partial.name !== undefined) backendPartial.name = partial.name;
    if (partial.description !== undefined) backendPartial.description = partial.description;
    if (partial.priceValue !== undefined) backendPartial.price = partial.priceValue;
    if (partial.image !== undefined) backendPartial.image = partial.image;
    if (partial.category !== undefined) backendPartial.type = partial.category;
    if (partial.tags !== undefined) backendPartial.tags = partial.tags;
    if (partial.tag !== undefined) backendPartial.tags = [partial.tag, ...(partial.tags || [])].filter(Boolean);
    if (partial.discountPercentage !== undefined) backendPartial.discount = partial.discountPercentage;
    if (partial.discountLabel !== undefined) backendPartial.discountLabel = partial.discountLabel;

    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendPartial)
    });
    if (!res.ok) throw new Error("Failed to update product");
    
    // Return the mapped version
    const all = await this.getAll();
    return all.find(p => p.id === id) as Product;
  }

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete product");
  }

  async setDiscount(id: string, pct: number, label: string): Promise<Product> {
    return this.update(id, { discountPercentage: pct, discountLabel: label });
  }

  async removeDiscount(id: string): Promise<Product> {
    return this.update(id, { discountPercentage: 0, discountLabel: null });
  }
}
