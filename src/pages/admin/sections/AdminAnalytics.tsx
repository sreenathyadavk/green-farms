import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, BarChart2 } from "lucide-react";
import { analyticsRepository } from "@/repositories";
import type { AnalyticsSnapshot } from "@/types/models";

export const AdminAnalytics = () => {
  const [snap, setSnap] = useState<AnalyticsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const data = await analyticsRepository.getSnapshot();
    setSnap(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    window.addEventListener("btw:analytics-changed", load);
    window.addEventListener("btw:orders-changed", load);
    return () => {
      window.removeEventListener("btw:analytics-changed", load);
      window.removeEventListener("btw:orders-changed", load);
    };
  }, []);

  if (loading || !snap) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 bg-sand animate-pulse rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-sand animate-pulse rounded-2xl" />
          ))}
        </div>
        <div className="h-60 bg-sand animate-pulse rounded-2xl" />
      </div>
    );
  }

  const maxRevenue = Math.max(...snap.dailyStats.map((d) => d.revenue), 1);

  const summary = [
    { label: "Total Revenue", value: `₹${snap.totalRevenue}`, icon: TrendingUp, color: "bg-forest" },
    { label: "Total Orders", value: String(snap.totalOrders), icon: ShoppingBag, color: "bg-teal" },
    { label: "This Week Revenue", value: `₹${snap.weekRevenue}`, icon: TrendingUp, color: "bg-gold" },
    { label: "This Week Orders", value: String(snap.weekOrders), icon: ShoppingBag, color: "bg-sage" },
    { label: "Today Revenue", value: `₹${snap.todayRevenue}`, icon: TrendingUp, color: "bg-forest/70" },
    { label: "Today Orders", value: String(snap.todayOrders), icon: ShoppingBag, color: "bg-teal/70" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl text-text-dark">Analytics</h2>
        <p className="text-text-muted text-sm mt-1">Revenue and order trends · last 30 days.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {summary.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-cream rounded-2xl border border-sand p-5 shadow-sm"
          >
            <div className={`w-8 h-8 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <p className="font-display text-2xl text-text-dark">{s.value}</p>
            <p className="text-[11px] text-text-muted mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* 30-day revenue bar chart */}
      <div className="bg-cream rounded-2xl border border-sand p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 className="w-4 h-4 text-forest" />
          <h3 className="font-semibold text-text-dark">30-Day Revenue</h3>
        </div>

        {snap.totalRevenue === 0 ? (
          <div className="h-40 flex items-center justify-center text-text-muted text-sm">
            No revenue data yet. Place your first order to see the chart.
          </div>
        ) : (
          <>
            <div className="flex items-end gap-1 h-40">
              {snap.dailyStats.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group relative">
                  <div
                    className="w-full bg-forest/15 hover:bg-forest rounded-t transition-colors duration-200"
                    style={{
                      height: `${(d.revenue / maxRevenue) * 100}%`,
                      minHeight: d.revenue > 0 ? "4px" : "0",
                    }}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-charcoal text-cream text-[9px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {d.date}<br />₹{d.revenue} · {d.orders} order{d.orders !== 1 ? "s" : ""}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-text-muted">
              <span>{snap.dailyStats[0]?.date}</span>
              <span>{snap.dailyStats[snap.dailyStats.length - 1]?.date}</span>
            </div>
          </>
        )}
      </div>

      {/* Top Products */}
      <div className="bg-cream rounded-2xl border border-sand p-6 shadow-sm">
        <h3 className="font-semibold text-text-dark mb-4">Top Products by Revenue</h3>

        {snap.topProducts.length === 0 ? (
          <p className="text-text-muted text-sm">No product sales data yet.</p>
        ) : (
          <div className="space-y-4">
            {snap.topProducts.map((p, i) => {
              const maxRev = snap.topProducts[0]?.revenue ?? 1;
              return (
                <div key={p.productId} className="flex items-center gap-4">
                  <span className="w-5 text-xs font-bold text-sage text-right">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-text-dark">{p.name}</span>
                      <span className="text-forest font-semibold">₹{p.revenue}</span>
                    </div>
                    <div className="h-2 bg-sand rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(p.revenue / maxRev) * 100}%` }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                        className="h-full bg-forest rounded-full"
                      />
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">{p.qty} units sold</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
