// ============================================================
// SUPABASE PRODUCT REPOSITORY SKELETON
// Replace LocalStorageProductRepository with this class
// once Supabase credentials are configured.
// TODO: npm install @supabase/supabase-js and set env vars
// ============================================================

// import { createClient } from "@supabase/supabase-js";
// const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

import type { Product } from "@/types/models";
import type { IProductRepository } from "./interfaces";

export class SupabaseProductRepository implements IProductRepository {
  private table = "products";

  async getAll(): Promise<Product[]> {
    // TODO: const { data, error } = await supabase.from(this.table).select("*").order("created_at", { ascending: false });
    // if (error) throw error;
    // return data;
    throw new Error("SupabaseProductRepository: not yet connected. Set SUPABASE_URL and SUPABASE_ANON_KEY.");
  }

  async getById(id: string): Promise<Product | null> {
    // TODO: const { data, error } = await supabase.from(this.table).select("*").eq("id", id).single();
    throw new Error("SupabaseProductRepository: not yet connected.");
  }

  async create(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    // TODO: const { data: row, error } = await supabase.from(this.table).insert(data).select().single();
    throw new Error("SupabaseProductRepository: not yet connected.");
  }

  async update(id: string, partial: Partial<Product>): Promise<Product> {
    // TODO: const { data: row, error } = await supabase.from(this.table).update(partial).eq("id", id).select().single();
    throw new Error("SupabaseProductRepository: not yet connected.");
  }

  async delete(id: string): Promise<void> {
    // TODO: const { error } = await supabase.from(this.table).delete().eq("id", id);
    throw new Error("SupabaseProductRepository: not yet connected.");
  }

  async setDiscount(id: string, pct: number, label: string): Promise<Product> {
    return this.update(id, { discountPercentage: pct, discountLabel: label });
  }

  async removeDiscount(id: string): Promise<Product> {
    return this.update(id, { discountPercentage: null, discountLabel: null });
  }
}

// ============================================================
// SUPABASE ORDER REPOSITORY SKELETON
// ============================================================
import type { Order, OrderStatus } from "@/types/models";
import type { IOrderRepository } from "./interfaces";

export class SupabaseOrderRepository implements IOrderRepository {
  private table = "orders";

  async getAll(): Promise<Order[]> {
    // TODO: const { data, error } = await supabase.from(this.table).select("*").order("created_at", { ascending: false });
    throw new Error("SupabaseOrderRepository: not yet connected.");
  }

  async getById(id: string): Promise<Order | null> {
    throw new Error("SupabaseOrderRepository: not yet connected.");
  }

  async getNextOrderNumber(): Promise<string> {
    // TODO: use a Postgres sequence or RPC
    throw new Error("SupabaseOrderRepository: not yet connected.");
  }

  async create(data: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">): Promise<Order> {
    throw new Error("SupabaseOrderRepository: not yet connected.");
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    throw new Error("SupabaseOrderRepository: not yet connected.");
  }

  async delete(id: string): Promise<void> {
    throw new Error("SupabaseOrderRepository: not yet connected.");
  }
}

// ============================================================
// SUPABASE INVENTORY REPOSITORY SKELETON
// ============================================================
import type { InventoryEntry } from "@/types/models";
import type { IInventoryRepository } from "./interfaces";

export class SupabaseInventoryRepository implements IInventoryRepository {
  private table = "inventory";

  async getAll(): Promise<InventoryEntry[]> {
    throw new Error("SupabaseInventoryRepository: not yet connected.");
  }
  async getByProductId(_id: string): Promise<InventoryEntry | null> {
    throw new Error("SupabaseInventoryRepository: not yet connected.");
  }
  async setStock(_productId: string, _stock: number): Promise<InventoryEntry> {
    throw new Error("SupabaseInventoryRepository: not yet connected.");
  }
  async adjustStock(_productId: string, _delta: number): Promise<InventoryEntry> {
    throw new Error("SupabaseInventoryRepository: not yet connected.");
  }
  async setThreshold(_productId: string, _threshold: number): Promise<InventoryEntry> {
    throw new Error("SupabaseInventoryRepository: not yet connected.");
  }
  async getLowStock(): Promise<InventoryEntry[]> {
    throw new Error("SupabaseInventoryRepository: not yet connected.");
  }
  async syncFromProducts(_products: Product[]): Promise<void> {
    throw new Error("SupabaseInventoryRepository: not yet connected.");
  }
}
