"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "../../../lib/store/cart";
import { createClient } from "../../../lib/supabase/client";
import type { Product } from "../../../lib/types";

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const cart = useCartStore();

  // Load products on first render via ref callback
  const loadRef = (node: HTMLDivElement | null) => {
    if (node && !loaded) {
      setLoaded(true);
      fetch("/api/products")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setProducts(data);
        });
    }
  };

  async function handleCheckout() {
    if (cart.items.length === 0) return;
    setCheckingOut(true);
    setMessage(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Gagal membuat pesanan" });
      } else {
        setMessage({ type: "success", text: "Pesanan berhasil dibuat! Cek halaman pesanan Anda." });
        cart.clearCart();
        setShowCart(false);
        // Refresh products to get updated stock
        const updated = await fetch("/api/products").then((r) => r.json());
        if (Array.isArray(updated)) setProducts(updated);
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan" });
    } finally {
      setCheckingOut(false);
    }
  }

  const categoryLabels: Record<string, string> = {
    compost: "Kompos",
    liquid: "Nutrisi Cair",
    seeds: "Benih",
    briquettes: "Briket",
  };

  return (
    <div ref={loadRef} className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Marketplace{" "}
            <span className="font-serif italic text-primary">BUMDes</span>
          </h1>
          <p className="text-muted mt-1 text-sm">
            Produk daur ulang berkualitas langsung dari desa.
          </p>
        </div>

        {/* Cart Button */}
        <button
          onClick={() => setShowCart(!showCart)}
          className="relative bg-primary-dark text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-darker transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="inline mr-2">
            <path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1Z" fill="white"/>
          </svg>
          Keranjang
          {cart.totalItems() > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {cart.totalItems()}
            </span>
          )}
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm ${
          message.type === "success"
            ? "bg-accent-green border border-accent-green-border text-green-status-text"
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      {/* Cart Panel */}
      {showCart && (
        <div className="mb-8 bg-white border border-stone-border rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-foreground mb-4">Keranjang Belanja</h2>
          {cart.items.length === 0 ? (
            <p className="text-muted text-sm">Keranjang kosong</p>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {cart.items.map((item) => (
                  <div key={item.product_id} className="flex items-center justify-between gap-4 bg-stone-light rounded-xl px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted">Rp {item.price_rp.toLocaleString("id-ID")} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => cart.updateQuantity(item.product_id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-stone-border text-foreground text-sm flex items-center justify-center hover:bg-stone-light"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => cart.updateQuantity(item.product_id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-stone-border text-foreground text-sm flex items-center justify-center hover:bg-stone-light"
                      >
                        +
                      </button>
                      <button
                        onClick={() => cart.removeItem(item.product_id)}
                        className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm flex items-center justify-center hover:bg-red-100 ml-1"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-foreground w-24 text-right">
                      Rp {(item.price_rp * item.quantity).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-border">
                <p className="text-base font-semibold text-foreground">
                  Total: Rp {cart.totalPrice().toLocaleString("id-ID")}
                </p>
                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="bg-primary-dark text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-darker transition-colors disabled:opacity-50"
                >
                  {checkingOut ? "Memproses..." : "Checkout"}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Product Grid */}
      {!loaded ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-stone-light rounded-2xl p-4 animate-pulse">
              <div className="aspect-[4/3] bg-stone-light rounded-xl mb-4" />
              <div className="h-4 bg-stone-light rounded w-3/4 mb-2" />
              <div className="h-3 bg-stone-light rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <div className="w-20 h-20 bg-stone-light rounded-full flex items-center justify-center text-4xl mb-6">🛒</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Belum ada produk</h2>
          <p className="text-muted text-sm">Produk hasil daur ulang akan segera tersedia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white border border-stone-light rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] bg-stone-light overflow-hidden">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl text-muted-light">
                    📦
                  </div>
                )}
                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-primary-dark/90 text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-full uppercase">
                  {categoryLabels[product.category] || product.category}
                </span>
                {/* Stock Badge */}
                {product.stock_qty <= 3 && product.stock_qty > 0 && (
                  <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    Sisa {product.stock_qty}
                  </span>
                )}
                {product.stock_qty === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Habis</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-semibold text-foreground leading-snug">
                    {product.name}
                  </h3>
                  <span className="text-base font-bold text-primary whitespace-nowrap">
                    Rp {product.price_rp.toLocaleString("id-ID")}
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">
                  {product.description}
                </p>
                <button
                  onClick={() =>
                    cart.addItem({
                      product_id: product.id,
                      name: product.name,
                      price_rp: product.price_rp,
                      image_url: product.image_url,
                      stock_qty: product.stock_qty,
                    })
                  }
                  disabled={product.stock_qty === 0}
                  className="w-full flex items-center justify-center gap-2 bg-primary-dark text-white text-sm font-medium py-3 rounded-xl hover:bg-primary-darker transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                  {product.stock_qty === 0 ? "Stok Habis" : "Tambah ke Keranjang"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
