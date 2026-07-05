import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Tag, X, Check, Search } from "lucide-react";
import { productRepository, inventoryRepository } from "@/repositories";
import type { Product, ProductCategory } from "@/types/models";

const CATEGORIES: ProductCategory[] = ["Greens", "Herbs", "Microgreens", "Boxes", "Fitness", "Premium"];

const EMPTY_FORM = {
  name: "", short: "", description: "", price: "", priceValue: 0,
  category: "Greens" as ProductCategory, tag: "", image: "",
  stock: 20, lowStockThreshold: 5,
  discountPercentage: null as number | null, discountLabel: null as string | null,
  tags: [] as string[], idealFor: "", serving: "", packSize: "",
};

export const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [discountForm, setDiscountForm] = useState<{ id: string; pct: string; label: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => setProducts(await productRepository.getAll());

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener("btw:products-changed", handler);
    return () => window.removeEventListener("btw:products-changed", handler);
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm({ ...EMPTY_FORM }); setEditingId(null); setShowForm(true); };
  const openEdit = (p: Product) => {
    setForm({
      name: p.name, short: p.short, description: p.description,
      price: p.price, priceValue: p.priceValue, category: p.category,
      tag: p.tag, image: p.image, stock: p.stock, lowStockThreshold: p.lowStockThreshold,
      discountPercentage: p.discountPercentage, discountLabel: p.discountLabel,
      tags: p.tags, idealFor: p.idealFor ?? "", serving: p.serving ?? "", packSize: p.packSize ?? "",
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);
    try {
      if (editingId) {
        await productRepository.update(editingId, { ...form, updatedAt: new Date().toISOString() });
      } else {
        const created = await productRepository.create({ ...form, harvestNote: "" });
        await inventoryRepository.syncFromProducts(await productRepository.getAll());
      }
      await load();
      setShowForm(false);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await productRepository.delete(id);
    await load();
  };

  const handleSetDiscount = async () => {
    if (!discountForm) return;
    const pct = parseInt(discountForm.pct, 10);
    if (isNaN(pct) || pct < 1 || pct > 99) return;
    await productRepository.setDiscount(discountForm.id, pct, discountForm.label || `${pct}% OFF`);
    setDiscountForm(null);
    await load();
  };

  const handleRemoveDiscount = async (id: string) => {
    await productRepository.removeDiscount(id);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-3xl text-text-dark">Products</h2>
          <p className="text-text-muted text-sm mt-1">{products.length} products · changes reflect on storefront instantly</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-forest text-cream text-sm font-semibold hover:bg-teal transition-colors shadow-card-hover">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 h-11 px-4 rounded-xl bg-cream border border-sand max-w-sm">
        <Search className="w-4 h-4 text-text-muted" />
        <input className="flex-1 bg-transparent text-sm text-text-dark outline-none placeholder:text-text-muted/60" placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Product Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => {
          const discountedPrice = p.discountPercentage ? Math.round(p.priceValue * (1 - p.discountPercentage / 100)) : null;
          return (
            <motion.div key={p.id} layout className="bg-cream rounded-2xl border border-sand overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-video bg-sand">
                {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                {p.discountPercentage && (
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider">
                    {p.discountLabel ?? `${p.discountPercentage}% OFF`}
                  </span>
                )}
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-text-dark text-sm leading-snug">{p.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-mist text-sage font-medium whitespace-nowrap">{p.category}</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    {discountedPrice ? (
                      <>
                        <span className="text-forest font-bold text-sm">₹{discountedPrice}</span>
                        <span className="text-text-muted text-xs line-through">{p.price}</span>
                      </>
                    ) : (
                      <span className="text-forest font-semibold text-sm">{p.price}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span>Stock: <strong className={p.stock <= p.lowStockThreshold ? "text-red-500" : "text-forest"}>{p.stock}</strong></span>
                  <span>·</span>
                  <span>Threshold: {p.lowStockThreshold}</span>
                </div>

                <div className="flex gap-2 pt-1">
                  <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-mist hover:bg-sand text-text-dark text-xs font-medium transition-colors border border-sand">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => setDiscountForm({ id: p.id, pct: String(p.discountPercentage ?? ""), label: p.discountLabel ?? "" })}
                    className="flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold text-xs font-medium transition-colors border border-gold/20"
                  >
                    <Tag className="w-3 h-3" />
                  </button>
                  {p.discountPercentage && (
                    <button onClick={() => handleRemoveDiscount(p.id)} className="flex items-center justify-center h-9 px-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-xs border border-red-100 transition-colors" title="Remove discount">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(p.id)} className="flex items-center justify-center h-9 w-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-colors border border-red-100">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="fixed inset-0 bg-charcoal/50 z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-8 bottom-8 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[600px] bg-cream rounded-3xl z-50 overflow-y-auto shadow-2xl"
            >
              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl text-text-dark">{editingId ? "Edit Product" : "New Product"}</h3>
                  <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-full bg-mist hover:bg-sand flex items-center justify-center transition-colors"><X className="w-4 h-4" /></button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Product Name *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
                  <FormField label="Short Description *" value={form.short} onChange={(v) => setForm((f) => ({ ...f, short: v }))} />
                  <FormField label="Price Display (e.g. ₹80–₹120) *" value={form.price} onChange={(v) => setForm((f) => ({ ...f, price: v }))} />
                  <FormField label="Base Price (numeric) *" value={String(form.priceValue)} onChange={(v) => setForm((f) => ({ ...f, priceValue: Number(v) }))} type="number" />
                  <div>
                    <label className="block text-[11px] font-bold tracking-widest uppercase text-sage mb-1.5">Category</label>
                    <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ProductCategory }))}
                      className="w-full h-10 px-3 rounded-xl bg-mist border border-sand text-sm text-text-dark outline-none focus:border-forest transition-colors">
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <FormField label="Tag (e.g. HYDRO GROWN)" value={form.tag} onChange={(v) => setForm((f) => ({ ...f, tag: v }))} />
                  <FormField label="Initial Stock" value={String(form.stock)} onChange={(v) => setForm((f) => ({ ...f, stock: Number(v) }))} type="number" />
                  <FormField label="Low Stock Threshold" value={String(form.lowStockThreshold)} onChange={(v) => setForm((f) => ({ ...f, lowStockThreshold: Number(v) }))} type="number" />
                  <FormField label="Image URL (or paste base64)" value={form.image} onChange={(v) => setForm((f) => ({ ...f, image: v }))} />
                  <FormField label="Ideal For" value={form.idealFor} onChange={(v) => setForm((f) => ({ ...f, idealFor: v }))} />
                  <FormField label="Serving Suggestion" value={form.serving} onChange={(v) => setForm((f) => ({ ...f, serving: v }))} />
                  <FormField label="Pack Size" value={form.packSize} onChange={(v) => setForm((f) => ({ ...f, packSize: v }))} />
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-widest uppercase text-sage mb-1.5">Full Description</label>
                  <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3} className="w-full px-3 py-2 rounded-xl bg-mist border border-sand text-sm text-text-dark outline-none focus:border-forest transition-colors resize-none" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowForm(false)} className="flex-1 h-11 rounded-xl border border-sand text-text-muted text-sm hover:bg-mist transition-colors">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className="flex-1 h-11 rounded-xl bg-forest text-cream text-sm font-semibold hover:bg-teal transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                    {saving ? "Saving…" : <><Check className="w-4 h-4" /> Save Product</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Discount Modal */}
      <AnimatePresence>
        {discountForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDiscountForm(null)} className="fixed inset-0 bg-charcoal/50 z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-cream rounded-2xl z-50 p-6 shadow-2xl space-y-4"
            >
              <h3 className="font-display text-xl text-text-dark">Set Discount</h3>
              <FormField label="Discount %" value={discountForm.pct} onChange={(v) => setDiscountForm((f) => f ? { ...f, pct: v } : f)} type="number" placeholder="e.g. 20" />
              <FormField label="Label (optional)" value={discountForm.label} onChange={(v) => setDiscountForm((f) => f ? { ...f, label: v } : f)} placeholder="e.g. SPECIAL OFFER" />
              <div className="flex gap-3">
                <button onClick={() => setDiscountForm(null)} className="flex-1 h-10 rounded-xl border border-sand text-sm text-text-muted hover:bg-mist transition-colors">Cancel</button>
                <button onClick={handleSetDiscount} className="flex-1 h-10 rounded-xl bg-gold text-charcoal text-sm font-semibold hover:bg-gold/80 transition-colors">Apply</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

function FormField({ label, value, onChange, type = "text", placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold tracking-widest uppercase text-sage mb-1.5">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full h-10 px-3 rounded-xl bg-mist border border-sand text-sm text-text-dark outline-none focus:border-forest transition-colors" />
    </div>
  );
}
