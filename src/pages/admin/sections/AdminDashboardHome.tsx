import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, AlertTriangle, Package, ArrowRight } from "lucide-react";
import { analyticsRepository, inventoryRepository } from "@/repositories";
import type { AnalyticsSnapshot, InventoryEntry } from "@/types/models";

interface Props { onNavigate: (s: "products" | "inventory" | "orders" | "analytics") => void; }

export const AdminDashboardHome = ({ onNavigate }: Props) => {
  const [snap, setSnap] = useState<AnalyticsSnapshot | null>(null);
  const [alerts, setAlerts] = useState<InventoryEntry[]>([]);

  const load = async () => {
    const [s, a] = await Promise.all([
      analyticsRepository.getSnapshot(),
      inventoryRepository.getLowStock(),
    ]);
    setSnap(s);
    setAlerts(a);
  };

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener("btw:orders-changed", handler);
    window.addEventListener("btw:inventory-changed", handler);
    return () => {
      window.removeEventListener("btw:orders-changed", handler);
      window.removeEventListener("btw:inventory-changed", handler);
    };
  }, []);

  const stats = [
    { label: "Today Revenue", value: snap ? `₹${snap.todayRevenue}` : "—", sub: `${snap?.todayOrders ?? 0} orders today`, icon: TrendingUp, color: "bg-forest" },
    { label: "This Week", value: snap ? `₹${snap.weekRevenue}` : "—", sub: `${snap?.weekOrders ?? 0} orders`, icon: ShoppingBag, color: "bg-gold" },
    { label: "Total Revenue", value: snap ? `₹${snap.totalRevenue}` : "—", sub: `${snap?.totalOrders ?? 0} all time`, icon: TrendingUp, color: "bg-teal" },
    { label: "Low Stock Alerts", value: String(alerts.length), sub: alerts.length > 0 ? "Action needed" : "All good", icon: AlertTriangle, color: alerts.length > 0 ? "bg-red-500" : "bg-sage" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl text-text-dark">Overview</h2>
        <p className="text-text-muted text-sm mt-1">Live business metrics — updated on every order.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-cream rounded-2xl p-5 border border-sand shadow-sm"
          >
            <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <p className="font-display text-2xl text-text-dark">{s.value}</p>
            <p className="text-[11px] text-text-muted mt-0.5">{s.label}</p>
            <p className="text-[10px] text-sage mt-1">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Low Stock Alerts */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-red-700">Low Stock Alerts</h3>
            </div>
            <button onClick={() => onNavigate("inventory")} className="text-xs text-red-600 hover:underline flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {alerts.slice(0, 5).map((a) => (
              <div key={a.productId} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 border border-red-100">
                <span className="text-sm font-medium text-text-dark">{a.productName}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${a.status === "out_of_stock" ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}>
                  {a.status === "out_of_stock" ? "Out of Stock" : `Only ${a.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Products */}
      {snap && snap.topProducts.length > 0 && (
        <div className="bg-cream rounded-2xl border border-sand p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-dark flex items-center gap-2"><Package className="w-4 h-4 text-forest" /> Top Products</h3>
            <button onClick={() => onNavigate("analytics")} className="text-xs text-forest hover:underline flex items-center gap-1">
              Full analytics <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {snap.topProducts.map((p, i) => (
              <div key={p.productId} className="flex items-center gap-3 py-2 border-b border-sand last:border-0">
                <span className="w-6 h-6 rounded-full bg-mist flex items-center justify-center text-xs font-bold text-forest">{i + 1}</span>
                <span className="flex-1 text-sm text-text-dark">{p.name}</span>
                <span className="text-xs text-text-muted">{p.qty} sold</span>
                <span className="text-sm font-semibold text-forest">₹{p.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
