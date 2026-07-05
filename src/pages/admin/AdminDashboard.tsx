import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, Package, Boxes, ShoppingBag, BarChart3,
  LogOut, Menu, X, Leaf, ChevronRight,
} from "lucide-react";
import { useAdminAuth } from "@/store/adminAuth";
import { AdminDashboardHome } from "./sections/AdminDashboardHome";
import { AdminProducts } from "./sections/AdminProducts";
import { AdminInventory } from "./sections/AdminInventory";
import { AdminOrders } from "./sections/AdminOrders";
import { AdminAnalytics } from "./sections/AdminAnalytics";

type Section = "dashboard" | "products" | "inventory" | "orders" | "analytics";

const NAV: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products",  label: "Products",  icon: Package },
  { id: "inventory", label: "Inventory", icon: Boxes },
  { id: "orders",    label: "Orders",    icon: ShoppingBag },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({
  section,
  setSection,
  onClose,
}: {
  section: Section;
  setSection: (s: Section) => void;
  onClose?: () => void;
}) {
  const logout = useAdminAuth((s) => s.logout);

  return (
    <div className="flex flex-col h-full bg-charcoal">
      {/* Header */}
      <div className="px-6 py-6 border-b border-cream/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-forest flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5 text-cream" />
          </div>
          <div>
            <p className="text-cream text-sm font-semibold leading-none">BTW Admin</p>
            <p className="text-cream/40 text-xs mt-0.5">Hydro Farm</p>
          </div>
        </div>
        {/* Mobile close button */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden w-8 h-8 flex items-center justify-center text-cream/50 hover:text-cream">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setSection(id); onClose?.(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              section === id
                ? "bg-forest text-cream shadow-[0_4px_12px_rgba(108,140,90,0.3)]"
                : "text-cream/60 hover:bg-cream/5 hover:text-cream"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-6">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-cream/50 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard shell ──────────────────────────────────────────────────────────
export const AdminDashboard = () => {
  const [section, setSection] = useState<Section>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const SECTIONS: Record<Section, React.ReactNode> = {
    dashboard: <AdminDashboardHome onNavigate={setSection} />,
    products:  <AdminProducts />,
    inventory: <AdminInventory />,
    orders:    <AdminOrders />,
    analytics: <AdminAnalytics />,
  };

  const currentLabel = NAV.find((n) => n.id === section)?.label ?? "";

  return (
    <div className="min-h-screen bg-mist flex overflow-hidden">

      {/* ── Desktop sidebar (always visible, never animated) ── */}
      <aside className="hidden lg:flex w-64 flex-col flex-shrink-0 shadow-2xl">
        <Sidebar section={section} setSection={setSection} />
      </aside>

      {/* ── Mobile sidebar (drawer overlay) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-charcoal/60 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-64 z-50 shadow-2xl lg:hidden"
            >
              <Sidebar
                section={section}
                setSection={setSection}
                onClose={() => setMobileOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-cream border-b border-sand px-5 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-9 h-9 inline-flex items-center justify-center rounded-xl hover:bg-sand transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-sm ml-auto">
            <span className="text-text-muted">Admin</span>
            <ChevronRight className="w-3 h-3 text-text-muted" />
            <span className="font-semibold text-forest">{currentLabel}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-8 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {SECTIONS[section]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
