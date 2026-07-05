// ============================================================
// DEPENDENCY INJECTION CONTAINER
// This is the ONLY place that imports concrete implementations.
// To migrate to Supabase, swap LocalStorage* classes here.
// UI code only imports from this file.
// ============================================================

import { ApiProductRepository } from "./ApiProductRepository";
import { ApiOrderRepository } from "./ApiOrderRepository";
import { ApiInventoryRepository } from "./ApiInventoryRepository";
import { ApiAnalyticsRepository } from "./ApiAnalyticsRepository";
import type { IProductRepository } from "./interfaces";
import type { IOrderRepository } from "./interfaces";
import type { IInventoryRepository } from "./interfaces";
import type { IAnalyticsRepository } from "./interfaces";

// Singletons
export const productRepository: IProductRepository = new ApiProductRepository();
export const orderRepository: IOrderRepository = new ApiOrderRepository();
export const inventoryRepository: IInventoryRepository = new ApiInventoryRepository();
export const analyticsRepository: IAnalyticsRepository = new ApiAnalyticsRepository();
