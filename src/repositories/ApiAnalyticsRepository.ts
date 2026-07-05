import { AnalyticsSnapshot, DailyStats, Order } from "@/types/models";
import { IAnalyticsRepository } from "./interfaces";

const API_URL = import.meta.env.VITE_API_URL || "";

export class ApiAnalyticsRepository implements IAnalyticsRepository {
  async getSnapshot(): Promise<AnalyticsSnapshot> {
    const res = await fetch(`${API_URL}/api/analytics`);
    if (!res.ok) throw new Error("Failed to fetch analytics");
    const data = await res.json();
    return data;
  }

  async recordSale(order: Order): Promise<void> {
    // Handled backend side by saveOrder/updateSales
  }

  async getDailyStats(days: number): Promise<DailyStats[]> {
    const snapshot = await this.getSnapshot();
    return snapshot.recentSales || [];
  }
}
