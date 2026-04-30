"use client";

import { useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price_rp: number;
  stock_qty: number;
  category: string;
  is_active: boolean;
  created_at: string;
}

const categories = [
  { value: "compost", label: "Kompos" },
  { value: "liquid", label: "Nutrisi Cair" },
  { value: "seeds", label: "Benih" },
  { value: "briquettes", label: "Briket" },
];

const emptyForm = { name: "", description: "", price_rp: "", stock_qty: "", category: "compost", image_url: "" };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [form, setForm] = useState(emptyForm);

  // Edit modal state
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editSaving, setEditSaving] = useState(false);

  // Delete state
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadRef = (node: HTMLDivElement | null) => {
    if (node && !loaded) {
      setLoaded(true);
      fetch("/api/products").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setProducts(d); });
    }
  };

  async function handleAdd() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price_rp: Number(form.price_rp), stock_qty: Number(form.stock_qty) }),
      });
      const data = await res.json();
      if (!res.ok) { setMsg({ type: "error", text: data.error }); }
      else {
        setProducts((p) => [data, ...p]);
        setForm(emptyForm);
        setShowForm(false);
        setMsg({ type: "success", text: "Produk berhasil ditambahkan!" });
      }
    } catch { setMsg({ type: "error", text: "Gagal menambahkan produk" }); }
    finally { setSaving(false); }
  }

  async function toggleActive(product: Product) {
    const res = await fetch("/api/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id, is_active: !product.is_active }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts((p) => p.map((pr) => (pr.id === updated.id ? updated : pr)));
    }
  }

  async function updateStock(id: string, stock_qty: number) {
    const res = await fetch("/api/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, stock_qty }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts((p) => p.map((pr) => (pr.id === updated.id ? updated : pr)));
    }
  }

  function openEdit(product: Product) {
    setEditProduct(product);
    setEditForm({
      name: product.name,
      description: product.description || "",
      price_rp: String(product.price_rp),
      stock_qty: String(product.stock_qty),
      category: product.category,
      image_url: product.image_url || "",
    });
  }

  async function handleEdit() {
    if (!editProduct) return;
    setEditSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editProduct.id,
          name: editForm.name,
          description: editForm.description,
          price_rp: Number(editForm.price_rp),
          stock_qty: Number(editForm.stock_qty),
          category: editForm.category,
          image_url: editForm.image_url,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "error", text: data.error });
      } else {
        setProducts((p) => p.map((pr) => (pr.id === data.id ? data : pr)));
        setEditProduct(null);
        setMsg({ type: "success", text: "Produk berhasil diperbarui!" });
      }
    } catch {
      setMsg({ type: "error", text: "Gagal memperbarui produk" });
    }
    setEditSaving(false);
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Apakah Anda yakin ingin menghapus "${product.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setDeleting(product.id);
    setMsg(null);
    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "error", text: data.error });
      } else if (data.soft_deleted) {
        // Product was soft-deleted (deactivated) due to active orders
        setProducts((p) => p.map((pr) => (pr.id === product.id ? { ...pr, is_active: false } : pr)));
        setMsg({ type: "success", text: "Produk dinonaktifkan karena masih memiliki pesanan aktif." });
      } else {
        setProducts((p) => p.filter((pr) => pr.id !== product.id));
        setMsg({ type: "success", text: "Produk berhasil dihapus!" });
      }
    } catch {
      setMsg({ type: "error", text: "Gagal menghapus produk" });
    }
    setDeleting(null);
  }

  return (
    <div ref={loadRef} className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Kelola <span className="font-serif italic text-primary">Produk</span>
          </h1>
          <p className="text-muted mt-1 text-sm">Tambah, ubah, dan kelola stok produk marketplace.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary-dark text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-darker transition-colors">
          {showForm ? "Batal" : "+ Tambah Produk"}
        </button>
      </div>

      {msg && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm ${msg.type === "success" ? "bg-accent-green border border-accent-green-border text-green-status-text" : "bg-red-50 border border-red-200 text-red-700"}`}>
          {msg.text}
        </div>
      )}

      {/* Add Product Form */}
      {showForm && (
        <div className="bg-white border border-stone-border rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">Produk Baru</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nama Produk</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-stone-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Kompos Premium 2kg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Kategori</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-stone-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                {categories.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Harga (Rp)</label>
              <input type="number" value={form.price_rp} onChange={(e) => setForm({ ...form, price_rp: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-stone-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="15000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Stok</label>
              <input type="number" value={form.stock_qty} onChange={(e) => setForm({ ...form, stock_qty: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-stone-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="50" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-1">Deskripsi</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-stone-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Pupuk kompos organik berkualitas tinggi..." />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-1">URL Gambar (opsional)</label>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-stone-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="https://..." />
          </div>
          <button onClick={handleAdd} disabled={saving || !form.name || !form.price_rp} className="bg-primary-dark text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-darker transition-colors disabled:opacity-50">
            {saving ? "Menyimpan..." : "Simpan Produk"}
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Edit Produk</h2>
              <button
                onClick={() => setEditProduct(null)}
                className="w-8 h-8 rounded-full bg-stone-light flex items-center justify-center text-muted hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nama Produk</label>
                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-stone-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Kategori</label>
                <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-stone-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {categories.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Harga (Rp)</label>
                <input type="number" value={editForm.price_rp} onChange={(e) => setEditForm({ ...editForm, price_rp: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-stone-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Stok</label>
                <input type="number" value={editForm.stock_qty} onChange={(e) => setEditForm({ ...editForm, stock_qty: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-stone-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-1">Deskripsi</label>
              <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-stone-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-1">URL Gambar</label>
              <input value={editForm.image_url} onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-stone-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setEditProduct(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-border text-sm font-medium text-muted hover:bg-stone-light transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleEdit}
                disabled={editSaving || !editForm.name || !editForm.price_rp}
                className="flex-1 bg-primary-dark text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-darker transition-colors disabled:opacity-50"
              >
                {editSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product List */}
      {!loaded ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => (<div key={i} className="bg-white border border-stone-light rounded-2xl p-5 animate-pulse"><div className="h-4 bg-stone-light rounded w-1/3 mb-2" /><div className="h-3 bg-stone-light rounded w-1/2" /></div>))}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-muted">Belum ada produk. Klik &quot;+ Tambah Produk&quot; untuk memulai.</div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className={`bg-white border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all ${product.is_active ? "border-stone-border" : "border-red-200 opacity-60"}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-foreground truncate">{product.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-light text-muted">{categories.find((c) => c.value === product.category)?.label}</span>
                </div>
                <p className="text-xs text-muted truncate">{product.description || "Tidak ada deskripsi"}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0 flex-wrap">
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">Rp {product.price_rp.toLocaleString("id-ID")}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <button onClick={() => updateStock(product.id, Math.max(0, product.stock_qty - 1))} className="w-6 h-6 rounded bg-stone-light text-foreground text-xs flex items-center justify-center hover:bg-stone-border">−</button>
                    <span className="text-xs font-medium w-8 text-center">{product.stock_qty}</span>
                    <button onClick={() => updateStock(product.id, product.stock_qty + 1)} className="w-6 h-6 rounded bg-stone-light text-foreground text-xs flex items-center justify-center hover:bg-stone-border">+</button>
                  </div>
                </div>
                {/* Edit Button */}
                <button
                  onClick={() => openEdit(product)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Edit produk"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit
                </button>
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(product)}
                  disabled={deleting === product.id}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="Hapus produk"
                >
                  {deleting === product.id ? "..." : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      Hapus
                    </>
                  )}
                </button>
                {/* Toggle Active */}
                <button onClick={() => toggleActive(product)} className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${product.is_active ? "border-red-200 text-red-600 hover:bg-red-50" : "border-accent-green-border text-green-status-text hover:bg-accent-green"}`}>
                  {product.is_active ? "Nonaktifkan" : "Aktifkan"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
