// ============================================================
// PRODUCTION DATA MODELS
// These interfaces represent the canonical data shapes
// used across all repository implementations (localStorage,
// Supabase, Google Sheets, etc.)
// ============================================================

export type ProductCategory = "Greens" | "Herbs" | "Microgreens" | "Boxes" | "Fitness" | "Premium";

export interface Product {
  id: string;
  name: string;
  description: string;
  short: string;
  image: string;           // URL or base64
  category: ProductCategory;
  tag: string;
  price: string;           // Display string e.g. "₹80–₹120"
  priceValue: number;      // Numeric base price for calculations
  stock: number;
  lowStockThreshold: number;
  discountPercentage: number | null;   // e.g. 20 means 20% off
  discountLabel: string | null;        // e.g. "SPECIAL OFFER"
  tags: string[];
  idealFor?: string;
  serving?: string;
  packSize?: string;
  harvestNote?: string;
  createdAt: string;       // ISO 8601
  updatedAt: string;       // ISO 8601
}

export type OrderStatus = "pending" | "confirmed" | "out_for_delivery" | "delivered" | "cancelled";
export type PaymentMethod = "cod" | "online";

export interface OrderItem {
  productId: string;
  name: string;
  price: string;
  priceValue: number;
  qty: number;
  image: string;
  type: "product" | "package";
}

export interface Order {
  id: string;              // Internal UUID
  orderNumber: string;     // Human-readable: BTW-2026-00001
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  deliveryEstimate: string; // e.g. "24–48 hours"
  status: OrderStatus;
  notes: string;
  createdAt: string;       // ISO 8601
  updatedAt: string;       // ISO 8601
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface InventoryEntry {
  productId: string;
  productName: string;
  category: ProductCategory;
  stock: number;
  lowStockThreshold: number;
  status: StockStatus;
  updatedAt: string;
}

export interface DailyStats {
  date: string;   // YYYY-MM-DD
  revenue: number;
  orders: number;
}

export interface AnalyticsSnapshot {
  todayRevenue: number;
  todayOrders: number;
  weekRevenue: number;
  weekOrders: number;
  totalRevenue: number;
  totalOrders: number;
  dailyStats: DailyStats[];
  topProducts: { productId: string; name: string; qty: number; revenue: number }[];
}

export interface AdminSession {
  passwordHash: string;
  createdAt: string;
}
