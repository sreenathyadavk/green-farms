import { Order, OrderStatus } from "@/types/models";
import { IOrderRepository } from "./interfaces";

const API_URL = import.meta.env.VITE_API_URL || "";

export class ApiOrderRepository implements IOrderRepository {
  async getAll(): Promise<Order[]> {
    const res = await fetch(`${API_URL}/api/orders`);
    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
  }

  async getById(id: string): Promise<Order | null> {
    const all = await this.getAll();
    return all.find(o => o.id === id) || null;
  }

  async create(order: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">): Promise<Order> {
    const orderNumber = await this.getNextOrderNumber();
    const newOrder: Order = {
      ...order,
      id: orderNumber,
      orderNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // The actual backend submission is handled by OrderService.ts
    // to include the secure Razorpay payment signature
    return newOrder;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error("Failed to update order status");
    return (await this.getById(id)) as Order;
  }

  async delete(id: string): Promise<void> {
    // Basic MVP: deleting orders is not supported via sheets yet
  }

  async getNextOrderNumber(): Promise<string> {
    const all = await this.getAll();
    const count = all.length + 1;
    const year = new Date().getFullYear();
    return `BTW-${year}-${count.toString().padStart(5, "0")}`;
  }
}
