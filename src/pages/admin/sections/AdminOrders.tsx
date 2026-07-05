import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ChevronDown, Package } from "lucide-react";
import { orderRepository } from "@/repositories";
import type { Order, OrderStatus } from "@/types/models";

const STATUSES: OrderStatus[] = ["pending", "confirmed", "out_for_delivery", "delivered", "cancelled"];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending:          "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed:        "bg-blue-50 text-blue-700 border-blue-200",
  out_for_delivery: "bg-purple-50 text-purple-700 border-purple-200",
  delivered:        "bg-green-50 text-green-700 border-green-200",
  cancelled:        "bg-red-50 text-red-600 border-red-200",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:          "Pending",
  confirmed:        "Confirmed",
  out_for_delivery: "Out for Delivery",
  delivered:        "Delivered",
  cancelled:        "Cancelled",
};

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    const data = await orderRepository.getAll();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    window.addEventListener("btw:orders-changed", load);
    return () => window.removeEventListener("btw:orders-changed", load);
  }, []);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const updateStatus = async (id: string, status: OrderStatus) => {
    await orderRepository.updateStatus(id, status);
    // load() is triggered via btw:orders-changed event
  };

  const exportCSV = () => {
    const rows = [
      ["Order #", "Customer", "Phone", "Address", "Items", "Subtotal", "Delivery", "Total", "Payment", "Status", "Date"],
      ...orders.map((o) => [
        o.orderNumber,
        o.customerName,
        o.customerPhone,
        o.customerAddress,
        o.items.map((i) => `${i.name} x${i.qty}`).join(" | "),
        `₹${o.subtotal}`,
        `₹${o.deliveryCharge}`,
        `₹${o.total}`,
        o.paymentMethod.toUpperCase(),
        STATUS_LABELS[o.status],
        new Date(o.createdAt).toLocaleString("en-IN"),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `btw-orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 bg-sand animate-pulse rounded-xl" />
        <div className="h-32 bg-sand animate-pulse rounded-2xl" />
        <div className="h-32 bg-sand animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-3xl text-text-dark">Orders</h2>
          <p className="text-text-muted text-sm mt-1">{orders.length} total orders</p>
        </div>
        <button
          onClick={exportCSV}
          disabled={orders.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-forest text-forest text-sm font-semibold hover:bg-forest hover:text-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === s
                ? "bg-forest text-cream"
                : "bg-cream border border-sand text-text-muted hover:border-forest hover:text-forest"
            }`}
          >
            {s === "all" ? "All" : STATUS_LABELS[s]}
            {s !== "all" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({orders.filter((o) => o.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="bg-cream rounded-2xl border border-sand p-12 text-center">
          <Package className="w-10 h-10 text-sand mx-auto mb-3" />
          <p className="font-display text-xl text-text-dark">No orders yet</p>
          <p className="text-text-muted text-sm mt-1">Orders will appear here when customers place them.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <motion.div key={o.id} layout className="bg-cream rounded-2xl border border-sand overflow-hidden shadow-sm">
              <button
                onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-mist/40 transition-colors text-left"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="min-w-0">
                    <p className="font-semibold text-text-dark text-sm">{o.orderNumber}</p>
                    <p className="text-xs text-text-muted truncate">
                      {o.customerName} · {o.customerPhone}
                    </p>
                  </div>
                  <span className={`hidden sm:inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[o.status]}`}>
                    {STATUS_LABELS[o.status]}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <span className="font-display text-lg text-forest">₹{o.total}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-text-muted transition-transform ${expanded === o.id ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {expanded === o.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-sand overflow-hidden"
                  >
                    <div className="px-5 py-4 space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5 text-sm">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-widest text-sage mb-2">Items Ordered</p>
                          <ul className="space-y-1">
                            {o.items.map((item, idx) => (
                              <li key={idx} className="flex justify-between text-text-dark">
                                <span>{item.name} × {item.qty}</span>
                                <span className="text-text-muted">₹{item.priceValue * item.qty}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 pt-4 border-t border-sand">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-sage mb-2">Delivery Address</p>
                            <p className="text-sm text-text-dark whitespace-pre-wrap">{o.customerAddress}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-widest text-sage mb-2">Summary</p>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between text-text-muted"><span>Subtotal</span><span>₹{o.subtotal}</span></div>
                            <div className="flex justify-between text-text-muted"><span>Delivery</span><span>₹{o.deliveryCharge}</span></div>
                            <div className="flex justify-between font-semibold text-text-dark border-t border-sand pt-1 mt-1"><span>Total</span><span>₹{o.total}</span></div>
                          </div>
                          <p className="text-xs text-text-muted mt-2">
                            {new Date(o.createdAt).toLocaleString("en-IN")} · {o.paymentMethod.toUpperCase()}
                          </p>
                          {o.notes && <p className="text-xs text-sage mt-1 italic">{o.notes}</p>}
                        </div>
                      </div>

                      {/* Status update */}
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-sage mb-2">Update Status</p>
                        <div className="flex gap-2 flex-wrap">
                          {STATUSES.map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(o.id, s)}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                o.status === s
                                  ? STATUS_STYLES[s] + " ring-2 ring-offset-1 ring-forest/30"
                                  : "border-sand text-text-muted hover:border-forest hover:text-forest bg-cream"
                              }`}
                            >
                              {STATUS_LABELS[s]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
