// ============================================================
// REPOSITORY INTERFACES
// Abstract contracts that all implementations must satisfy.
// Swap localStorage → Supabase by replacing implementations
// only — UI never imports concrete classes.
// ============================================================

import type {
  Product,
  Order,
  InventoryEntry,
  AnalyticsSnapshot,
  DailyStats,
  OrderStatus,
} from "@/types/models";

// ---- Product -----------------------------------------------
export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  create(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product>;
  update(id: string, partial: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
  setDiscount(id: string, pct: number, label: string): Promise<Product>;
  removeDiscount(id: string): Promise<Product>;
}

// ---- Inventory ---------------------------------------------
export interface IInventoryRepository {
  getAll(): Promise<InventoryEntry[]>;
  getByProductId(productId: string): Promise<InventoryEntry | null>;
  setStock(productId: string, stock: number): Promise<InventoryEntry>;
  adjustStock(productId: string, delta: number): Promise<InventoryEntry>;
  setThreshold(productId: string, threshold: number): Promise<InventoryEntry>;
  getLowStock(): Promise<InventoryEntry[]>;
  syncFromProducts(products: Product[]): Promise<void>;
}

// ---- Order -------------------------------------------------
export interface IOrderRepository {
  getAll(): Promise<Order[]>;
  getById(id: string): Promise<Order | null>;
  create(order: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">): Promise<Order>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
  delete(id: string): Promise<void>;
  getNextOrderNumber(): Promise<string>;
}

// ---- Analytics ---------------------------------------------
export interface IAnalyticsRepository {
  getSnapshot(): Promise<AnalyticsSnapshot>;
  recordSale(order: Order): Promise<void>;
  getDailyStats(days: number): Promise<DailyStats[]>;
}
