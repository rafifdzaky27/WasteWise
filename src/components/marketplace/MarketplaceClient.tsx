"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "../../lib/store/cart";
import type { Product } from "../../lib/types";

interface MarketplaceClientProps {
  initialProducts: Product[];
}

export default function MarketplaceClient({ initialProducts }: MarketplaceClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [checkingOut, setCheckingOut] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Checkout Form State
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const cart = useCartStore();
  const router = useRouter();

  async function handleConfirmCheckout() {
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
          // We pass these even if the API currently ignores them, for future proofing
          delivery_method: deliveryMethod,
          payment_method: paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Gagal membuat pesanan" });
        setCheckingOut(false);
      } else {
        cart.clearCart();
        setShowCheckoutModal(false);
        setShowCart(false);
        router.push("/orders");
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan" });
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
    <div className="max-w-6xl mx-auto">
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
          aria-label={`Keranjang belanja, ${cart.totalItems()} item`}
          className="relative bg-primary-dark text-white px-3 sm:px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-darker transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="inline sm:mr-2">
            <path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1Z" fill="white"/>
          </svg>
          <span className="hidden sm:inline">Keranjang</span>
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
        <div className="mb-8 bg-white border border-stone-border rounded-2xl p-6 shadow-md animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Keranjang Belanja</h2>
            <button onClick={() => setShowCart(false)} aria-label="Tutup keranjang" className="text-muted hover:text-foreground">✕</button>
          </div>
          
          {cart.items.length === 0 ? (
            <p className="text-muted text-sm">Keranjang kosong</p>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {cart.items.map((item) => (
                  <div key={item.product_id} className="flex flex-wrap items-center justify-between gap-3 bg-stone-light rounded-xl px-3 sm:px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted">Rp {item.price_rp.toLocaleString("id-ID")} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => cart.updateQuantity(item.product_id, item.quantity - 1)}
                        aria-label={`Kurangi jumlah ${item.name}`}
                        className="w-7 h-7 rounded-lg bg-white border border-stone-border text-foreground text-sm flex items-center justify-center hover:bg-stone-light"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => cart.updateQuantity(item.product_id, item.quantity + 1)}
                        aria-label={`Tambah jumlah ${item.name}`}
                        className="w-7 h-7 rounded-lg bg-white border border-stone-border text-foreground text-sm flex items-center justify-center hover:bg-stone-light"
                      >
                        +
                      </button>
                      <button
                        onClick={() => cart.removeItem(item.product_id)}
                        aria-label={`Hapus ${item.name} dari keranjang`}
                        className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm flex items-center justify-center hover:bg-red-100 ml-1"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-foreground w-full sm:w-24 text-right">
                      Rp {(item.price_rp * item.quantity).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-border">
                <p className="text-base font-semibold text-foreground">
                  Total: <span className="text-primary">Rp {cart.totalPrice().toLocaleString("id-ID")}</span>
                </p>
                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="bg-primary-dark text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-darker transition-colors"
                >
                  Checkout ({cart.totalItems()} item)
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Product Grid (Instantly Rendered) */}
      {products.length === 0 ? (
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
                  onClick={() => {
                    cart.addItem({
                      product_id: product.id,
                      name: product.name,
                      price_rp: product.price_rp,
                      image_url: product.image_url,
                      stock_qty: product.stock_qty,
                    });
                    setShowCart(true);
                  }}
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

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div role="dialog" aria-modal="true" aria-label="Checkout pesanan" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-stone-border flex items-center justify-between bg-stone-light/50">
              <h3 className="text-lg font-bold text-foreground">Checkout Pesanan</h3>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                aria-label="Tutup checkout"
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <h4 className="font-semibold text-sm text-muted mb-3 uppercase tracking-wider">Ringkasan Belanja</h4>
              <div className="bg-stone-light rounded-xl p-4 mb-6 space-y-2">
                {cart.items.map(item => (
                  <div key={item.product_id} className="flex justify-between text-sm">
                    <span className="text-foreground">{item.name} <span className="text-muted">x{item.quantity}</span></span>
                    <span className="font-medium">Rp {(item.price_rp * item.quantity).toLocaleString("id-ID")}</span>
                  </div>
                ))}
                <div className="border-t border-stone-border pt-2 mt-2 flex justify-between font-bold text-base">
                  <span>Total Tagihan</span>
                  <span className="text-primary">Rp {cart.totalPrice().toLocaleString("id-ID")}</span>
                </div>
              </div>

              <h4 className="font-semibold text-sm text-muted mb-3 uppercase tracking-wider">Metode Pengiriman</h4>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    deliveryMethod === "pickup" 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "border-stone-border hover:bg-stone-50"
                  }`}
                >
                  <div className="font-medium text-sm text-foreground mb-1">Ambil Sendiri</div>
                  <div className="text-xs text-muted">Ambil di BUMDes (Gratis)</div>
                </button>
                <button
                  onClick={() => setDeliveryMethod("delivery")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    deliveryMethod === "delivery" 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "border-stone-border hover:bg-stone-50"
                  }`}
                >
                  <div className="font-medium text-sm text-foreground mb-1">Kirim ke Rumah</div>
                  <div className="text-xs text-muted">Ongkir Rp 5.000</div>
                </button>
              </div>

              <h4 className="font-semibold text-sm text-muted mb-3 uppercase tracking-wider">Metode Pembayaran</h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === "cod" 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "border-stone-border hover:bg-stone-50"
                  }`}
                >
                  <div className="font-medium text-sm text-foreground mb-1">Bayar di Tempat</div>
                  <div className="text-xs text-muted">Tunai saat barang tiba/diambil</div>
                </button>
                <button
                  onClick={() => setPaymentMethod("transfer")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === "transfer" 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "border-stone-border hover:bg-stone-50"
                  }`}
                >
                  <div className="font-medium text-sm text-foreground mb-1">Transfer Bank</div>
                  <div className="text-xs text-muted">BCA / Mandiri / BNI</div>
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-stone-border bg-stone-light/30">
              <button
                onClick={handleConfirmCheckout}
                disabled={checkingOut}
                className="w-full bg-primary-dark text-white py-3.5 rounded-xl font-bold text-sm hover:bg-primary-darker transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {checkingOut ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Memproses...
                  </>
                ) : (
                  "Konfirmasi & Bayar Sekarang"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
