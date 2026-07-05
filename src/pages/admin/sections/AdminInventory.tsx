import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, AlertTriangle, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { inventoryRepository, productRepository } from "@/repositories";
import type { InventoryEntry } from "@/types/models";

export const AdminInventory = () => {
  const [entries, setEntries] = useState<InventoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState<string | null>(null);
  const [manualStock, setManualStock] = useState<Record<string, string>>({});
  const isSyncing = useRef(false);

  // ── Initial load: sync products → load entries ──────────────────
  const initialSync = async () => {
    if (isSyncing.current) return;
    isSyncing.current = true;
    try {
      const products = await productRepository.getAll();
      await inventoryRepository.syncFromProducts(products);
      const data = await inventoryRepository.getAll();
      setEntries(data);
    } finally {
      isSyncing.current = false;
      setLoading(false);
    }
  };

  // ── Reload entries only (no sync — avoids re-triggering the event) ──
  const reloadEntries = async () => {
    const data = await inventoryRepository.getAll();
    setEntries(data);
  };

  useEffect(() => {
    initialSync();

    // btw:inventory-changed fires from the repository save() call.
    // We only reload entries here — we do NOT call syncFromProducts again.
    const onInventoryChange = () => reloadEntries();

    // When products change in admin (add/edit/delete), re-sync
    const onProductsChange = () => initialSync();

    window.addEventListener("btw:inventory-changed", onInventoryChange);
    window.addEventListener("btw:products-changed", onProductsChange);
    return () => {
      window.removeEventListener("btw:inventory-changed", onInventoryChange);
      window.removeEventListener("btw:products-changed", onProductsChange);
    };
  }, []);

  const adjust = async (id: string, delta: number) => {
    setAdjusting(id);
    try {
      await inventoryRepository.adjustStock(id, delta);
      // reloadEntries is triggered by btw:inventory-changed event
    } finally {
      setAdjusting(null);
    }
  };

  const setManualValue = async (id: string) => {
    const val = parseInt(manualStock[id] ?? "", 10);
    if (isNaN(val) || val < 0) return;
    setAdjusting(id);
    try {
      await inventoryRepository.setStock(id, val);
      setManualStock((m) => { const n = { ...m }; delete n[id]; return n; });
    } finally {
      setAdjusting(null);
    }
  };

  const statusIcon = (status: InventoryEntry["status"]) => {
    if (status === "in_stock")   return <CheckCircle className="w-4 h-4 text-forest" />;
    if (status === "low_stock")  return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const statusBadge = (status: InventoryEntry["status"]) => {
    if (status === "in_stock")  return "bg-forest/10 text-forest";
    if (status === "low_stock") return "bg-orange-50 text-orange-600";
    return "bg-red-50 text-red-600";
  };

  const statusLabel = (status: InventoryEntry["status"]) =>
    status === "in_stock" ? "In Stock" : status === "low_stock" ? "Low Stock" : "Out of Stock";

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 bg-sand animate-pulse rounded-xl" />
        <div className="h-64 bg-sand animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-3xl text-text-dark">Inventory</h2>
          <p className="text-text-muted text-sm mt-1">
            {entries.length} products · auto-reduced on order · synced with Google Sheets
          </p>
        </div>
        <button
          onClick={initialSync}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-sand text-text-muted text-sm hover:border-forest hover:text-forest transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Sync
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="bg-cream rounded-2xl border border-sand p-10 text-center text-text-muted">
          No inventory data. Add products first.
        </div>
      ) : (
        <div className="bg-cream rounded-2xl border border-sand overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sand bg-mist/60">
                  {["Product", "Category", "Status", "Stock", "Threshold", "Quick Add"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-sage">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {entries.map((e) => (
                  <motion.tr key={e.productId} layout className="hover:bg-mist/40 transition-colors">
                    <td className="px-5 py-4 font-medium text-text-dark whitespace-nowrap">{e.productName}</td>
                    <td className="px-5 py-4 text-text-muted">{e.category}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge(e.status)}`}>
                        {statusIcon(e.status)} {statusLabel(e.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => adjust(e.productId, -1)}
                          disabled={adjusting === e.productId || e.stock <= 0}
                          className="w-7 h-7 rounded-lg bg-mist hover:bg-sand border border-sand flex items-center justify-center transition-colors disabled:opacity-40"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          value={manualStock[e.productId] !== undefined ? manualStock[e.productId] : e.stock}
                          onChange={(ev) => setManualStock((m) => ({ ...m, [e.productId]: ev.target.value }))}
                          onBlur={() => setManualValue(e.productId)}
                          className="w-14 text-center font-bold text-text-dark bg-transparent outline-none border-b-2 border-transparent focus:border-forest transition-colors"
                        />
                        <button
                          onClick={() => adjust(e.productId, 1)}
                          disabled={adjusting === e.productId}
                          className="w-7 h-7 rounded-lg bg-mist hover:bg-sand border border-sand flex items-center justify-center transition-colors disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-text-muted">{e.lowStockThreshold}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => adjust(e.productId, 10)}
                        disabled={adjusting === e.productId}
                        className="px-3 py-1.5 rounded-lg bg-forest/10 text-forest text-xs font-semibold hover:bg-forest/20 transition-colors disabled:opacity-40"
                      >
                        +10
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
