import { InventoryEntry, Product } from "@/types/models";
import { IInventoryRepository } from "./interfaces";

const API_URL = import.meta.env.VITE_API_URL || "";

export class ApiInventoryRepository implements IInventoryRepository {
  async getAll(): Promise<InventoryEntry[]> {
    const res = await fetch(`${API_URL}/api/inventory`);
    if (!res.ok) throw new Error("Failed to fetch inventory");
    return res.json();
  }

  async getByProductId(productId: string): Promise<InventoryEntry | null> {
    const all = await this.getAll();
    return all.find(i => i.productId === productId) || null;
  }

  async setStock(productId: string, stock: number): Promise<InventoryEntry> {
    const res = await fetch(`${API_URL}/api/inventory/${productId}/stock`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock })
    });
    if (!res.ok) throw new Error("Failed to set stock");
    
    // Notify UI to refresh
    window.dispatchEvent(new Event("btw:inventory-changed"));
    window.dispatchEvent(new Event("btw:products-changed"));
    
    return this.getByProductId(productId) as Promise<InventoryEntry>;
  }

  async adjustStock(productId: string, delta: number): Promise<InventoryEntry> {
    // Backend self-heals: no need for name fallback
    const item = await this.getByProductId(productId);
    const newStock = Math.max(0, (item?.stock || 0) + delta);
    return this.setStock(productId, newStock);
  }

  async setThreshold(productId: string, threshold: number): Promise<InventoryEntry> {
    // Basic MVP: Since backend only updates stock, we don't have a direct threshold endpoint yet. 
    // This can be expanded if needed, but for now we just return the item.
    return (await this.getByProductId(productId)) as InventoryEntry;
  }

  async getLowStock(): Promise<InventoryEntry[]> {
    const all = await this.getAll();
    return all.filter(i => i.stock <= i.threshold);
  }

  async syncFromProducts(products: Product[]): Promise<void> {
    // In Google Sheets, this happens implicitly or by the backend.
  }
}
