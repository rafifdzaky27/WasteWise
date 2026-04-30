"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "../../lib/store/cart";
import type { Product } from "../../lib/types";

interface MarketplaceClientProps {
  initialProducts: Product[];
}

import productCompost from "../../assets/images/product-compost.png";
import productLiquid from "../../assets/images/product-liquid.png";
import productSeeds from "../../assets/images/product-seeds.png";
import productBriquettes from "../../assets/images/product-briquettes.png";

const categoryLabels: Record<string, string> = {
  compost: "Restorasi Tanah",
  liquid: "Nutrisi Tanaman",
  seeds: "Pertanian Urban",
  briquettes: "Energi Hijau",
};

const categoryImages: Record<string, any> = {
  compost: productCompost,
  liquid: productLiquid,
  seeds: productSeeds,
  briquettes: productBriquettes,
};

const SHIPPING_COST = 5000;

export default function MarketplaceClient({ initialProducts }: MarketplaceClientProps) {
  const [products] = useState<Product[]>(initialProducts);
  const [checkingOut, setCheckingOut] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [transferProofUrl, setTransferProofUrl] = useState("");
  const [transferProofPreview, setTransferProofPreview] = useState<string | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const proofInputRef = useRef<HTMLInputElement>(null);

  const cart = useCartStore();
  const router = useRouter();

  const shippingCost = deliveryMethod === "delivery" ? SHIPPING_COST : 0;
  const grandTotal = cart.totalPrice() + shippingCost;

  async function handleProofUpload(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => setTransferProofPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setUploadingProof(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setTransferProofUrl(data.url);
      } else {
        setMessage({ type: "error", text: data.error || "Gagal mengunggah bukti" });
        setTransferProofPreview(null);
      }
    } catch {
      setMessage({ type: "error", text: "Gagal mengunggah bukti transfer" });
      setTransferProofPreview(null);
    }
    setUploadingProof(false);
  }

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
          delivery_method: deliveryMethod,
          payment_method: paymentMethod,
          shipping_cost: shippingCost,
          payment_proof_url: transferProofUrl || undefined,
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

  // Featured product = first one, rest are regular
  const featured = products[0] || null;
  const regularProducts = products.slice(1);

  return (
    <>
      <div className="animate-fade-in">
        {/* Editorial Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Pasar <span className="font-serif italic text-primary">Berkelanjutan</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted max-w-lg leading-relaxed">
            Belanja produk organik yang diproduksi langsung dari pengelolaan sampah desa.
          </p>
        </div>

        {/* Cart Button */}
        <button
          onClick={() => setShowCart(!showCart)}
          aria-label={`Keranjang belanja, ${cart.totalItems()} item`}
          className="relative shrink-0 w-11 h-11 rounded-full border border-stone-border bg-white flex items-center justify-center hover:bg-stone-light transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {cart.totalItems() > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-dark text-white text-[10px] font-bold rounded-full flex items-center justify-center">
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
            <h2 className="text-lg font-medium text-foreground">Keranjang Belanja</h2>
            <button onClick={() => setShowCart(false)} aria-label="Tutup keranjang" className="text-muted hover:text-foreground">✕</button>
          </div>
          
          {cart.items.length === 0 ? (
            <p className="text-muted text-sm">Keranjang kosong</p>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {cart.items.map((item) => (
                  <div key={item.product_id} className="flex flex-wrap items-center justify-between gap-3 bg-stone-light/50 rounded-xl px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted">Rp {item.price_rp.toLocaleString("id-ID")} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => cart.updateQuantity(item.product_id, item.quantity - 1)} aria-label={`Kurangi ${item.name}`} className="w-7 h-7 rounded-lg bg-white border border-stone-border text-foreground text-sm flex items-center justify-center hover:bg-stone-light">−</button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => cart.updateQuantity(item.product_id, item.quantity + 1)} aria-label={`Tambah ${item.name}`} className="w-7 h-7 rounded-lg bg-white border border-stone-border text-foreground text-sm flex items-center justify-center hover:bg-stone-light">+</button>
                      <button onClick={() => cart.removeItem(item.product_id)} aria-label={`Hapus ${item.name}`} className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm flex items-center justify-center hover:bg-red-100 ml-1">×</button>
                    </div>
                    <p className="text-sm font-semibold text-foreground w-full sm:w-24 text-right">Rp {(item.price_rp * item.quantity).toLocaleString("id-ID")}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-stone-border">
                <p className="text-base font-medium text-foreground">Total: <span className="text-primary">Rp {cart.totalPrice().toLocaleString("id-ID")}</span></p>
                <button onClick={() => setShowCheckoutModal(true)} className="bg-primary-dark text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-darker transition-colors">
                  Checkout ({cart.totalItems()})
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Product Bento Grid */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <div className="w-16 h-16 bg-stone-light rounded-full flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
          </div>
          <h2 className="text-xl font-medium text-foreground mb-2">Belum ada produk</h2>
          <p className="text-muted text-sm">Produk hasil daur ulang akan segera tersedia.</p>
        </div>
      ) : (
        <div className="space-y-6 mt-8">
          {/* Featured Product */}
          {featured && (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 bg-white border border-stone-border rounded-2xl overflow-hidden">
              <div className="sm:col-span-3 relative aspect-[4/3] sm:aspect-auto bg-stone-light overflow-hidden">
                {featured.image_url || categoryImages[featured.category] ? (
                  <Image src={featured.image_url || categoryImages[featured.category]} alt={featured.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 60vw" unoptimized={!!featured.image_url} />
                ) : (
                  <div className="w-full h-full min-h-[240px] flex items-center justify-center bg-stone-light">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d6d3d1" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                  </div>
                )}
                {featured.stock_qty <= 3 && featured.stock_qty > 0 && (
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full text-foreground">Terlaris</span>
                )}
                {featured.stock_qty === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white font-bold text-lg">Habis</span></div>
                )}
              </div>
              <div className="sm:col-span-2 p-6 flex flex-col justify-center">
                <p className="text-[10px] font-bold text-primary uppercase tracking-[2px] mb-2">{categoryLabels[featured.category] || featured.category}</p>
                <h3 className="text-xl font-medium text-foreground mb-2">{featured.name}</h3>
                <p className="text-sm text-muted leading-relaxed mb-6">{featured.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-medium text-foreground">Rp {featured.price_rp.toLocaleString("id-ID")}</p>
                  <button
                    onClick={() => { cart.addItem({ product_id: featured.id, name: featured.name, price_rp: featured.price_rp, image_url: featured.image_url, stock_qty: featured.stock_qty }); setShowCart(true); }}
                    disabled={featured.stock_qty === 0}
                    className="bg-primary-dark text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-primary-darker transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Tambah
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Regular Products Grid */}
          {regularProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularProducts.map((product) => (
                <div key={product.id} className="bg-white border border-stone-border rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 group">
                  <div className="relative aspect-[4/3] bg-stone-light overflow-hidden">
                    {product.image_url || categoryImages[product.category] ? (
                      <Image src={product.image_url || categoryImages[product.category]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized={!!product.image_url} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d6d3d1" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                      </div>
                    )}
                    {product.stock_qty === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white font-bold">Habis</span></div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[2px] mb-1">{categoryLabels[product.category] || product.category}</p>
                    <h3 className="text-base font-medium text-foreground mb-1">{product.name}</h3>
                    <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-base font-medium text-foreground">Rp {product.price_rp.toLocaleString("id-ID")}</p>
                      <button
                        onClick={() => { cart.addItem({ product_id: product.id, name: product.name, price_rp: product.price_rp, image_url: product.image_url, stock_qty: product.stock_qty }); setShowCart(true); }}
                        disabled={product.stock_qty === 0}
                        aria-label={`Tambah ${product.name} ke keranjang`}
                        className="w-10 h-10 rounded-full border border-stone-border bg-white flex items-center justify-center hover:bg-stone-light transition-colors disabled:opacity-40"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Brand Story */}
          <div className="flex flex-col items-center text-center py-12">
            <h3 className="text-xl sm:text-2xl font-medium text-foreground mb-2">
              Setiap produk bercerita tentang <span className="font-serif italic text-primary">pembaruan.</span>
            </h3>
            <p className="text-sm text-muted max-w-lg leading-relaxed">
              Kami bermitra dengan koperasi desa untuk mengubah apa yang dulunya dianggap &lsquo;sampah&rsquo; menjadi sumber daya premium untuk rumah dan kebun Anda.
            </p>
          </div>
        </div>
      )}
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div role="dialog" aria-modal="true" aria-label="Checkout pesanan" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-stone-border flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground">Checkout Pesanan</h3>
              <button onClick={() => setShowCheckoutModal(false)} aria-label="Tutup checkout" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-light transition-colors">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <p className="text-[10px] font-bold text-muted uppercase tracking-[2px] mb-3">Ringkasan</p>
              <div className="bg-stone-light/50 rounded-xl p-4 mb-6 space-y-2">
                {cart.items.map(item => (
                  <div key={item.product_id} className="flex justify-between text-sm">
                    <span className="text-foreground">{item.name} <span className="text-muted">×{item.quantity}</span></span>
                    <span className="font-medium">Rp {(item.price_rp * item.quantity).toLocaleString("id-ID")}</span>
                  </div>
                ))}
                {shippingCost > 0 && (
                  <div className="flex justify-between text-sm text-muted">
                    <span>Ongkos Kirim</span>
                    <span className="font-medium text-foreground">Rp {shippingCost.toLocaleString("id-ID")}</span>
                  </div>
                )}
                <div className="border-t border-stone-border pt-2 mt-2 flex justify-between font-bold text-base">
                  <span>Total Pembayaran</span>
                  <span className="text-primary">Rp {grandTotal.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <p className="text-[10px] font-bold text-muted uppercase tracking-[2px] mb-3">Pengiriman</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[{v:"pickup", l:"Ambil Sendiri", d:"Di BUMDes (Gratis)"}, {v:"delivery", l:"Kirim ke Rumah", d:"Ongkir Rp 5.000"}].map(m => (
                  <button key={m.v} onClick={() => setDeliveryMethod(m.v)} className={`p-3 rounded-xl border text-left transition-all ${deliveryMethod === m.v ? "border-primary bg-primary/5" : "border-stone-border hover:bg-stone-50"}`}>
                    <p className="font-medium text-sm text-foreground mb-1">{m.l}</p>
                    <p className="text-xs text-muted">{m.d}</p>
                  </button>
                ))}
              </div>

              <p className="text-[10px] font-bold text-muted uppercase tracking-[2px] mb-3">Pembayaran</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[{v:"cod", l:"Bayar di Tempat", d:"Tunai saat diambil"}, {v:"transfer", l:"Transfer Bank", d:"BCA / Mandiri"}].map(m => (
                  <button key={m.v} onClick={() => { setPaymentMethod(m.v); if (m.v === "cod") { setTransferProofUrl(""); setTransferProofPreview(null); } }} className={`p-3 rounded-xl border text-left transition-all ${paymentMethod === m.v ? "border-primary bg-primary/5" : "border-stone-border hover:bg-stone-50"}`}>
                    <p className="font-medium text-sm text-foreground mb-1">{m.l}</p>
                    <p className="text-xs text-muted">{m.d}</p>
                  </button>
                ))}
              </div>

              {/* Bank Info + Proof Upload (only for transfer) */}
              {paymentMethod === "transfer" && (
                <div className="mt-4 space-y-4">
                  <div className="bg-blue-bg border border-blue-border rounded-xl p-4">
                    <p className="text-xs font-bold text-foreground mb-2">Informasi Rekening BUMDes</p>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Bank</span>
                        <span className="font-medium text-foreground">BCA</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">No. Rekening</span>
                        <span className="font-mono font-bold text-foreground">7840 2931 56</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Atas Nama</span>
                        <span className="font-medium text-foreground">BUMDes Desa Telkom</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted mt-3">Transfer sebesar <span className="font-bold text-foreground">Rp {grandTotal.toLocaleString("id-ID")}</span> ke rekening di atas.</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-foreground mb-2">Bukti Transfer</p>
                    <input ref={proofInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleProofUpload(f); }} />
                    {transferProofPreview ? (
                      <div className="relative group">
                        <img src={transferProofPreview} alt="Bukti transfer" className="w-full h-40 object-cover rounded-xl border border-stone-border" />
                        {uploadingProof && (
                          <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
                            <div className="flex items-center gap-2 text-sm text-muted"><span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />Mengunggah...</div>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => { setTransferProofPreview(null); setTransferProofUrl(""); if (proofInputRef.current) proofInputRef.current.value = ""; }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 border border-stone-border text-muted hover:text-red-500 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >✕</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => proofInputRef.current?.click()}
                        className="w-full h-28 border-2 border-dashed border-stone-border rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        <p className="text-xs text-muted">Unggah bukti transfer</p>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-stone-border">
              <button onClick={handleConfirmCheckout} disabled={checkingOut || (paymentMethod === "transfer" && !transferProofUrl)} className="w-full bg-primary-dark text-white py-3.5 rounded-xl font-medium text-sm hover:bg-primary-darker transition-colors disabled:opacity-50 flex justify-center items-center gap-2">
                {checkingOut ? (<><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />Memproses...</>) : `Konfirmasi & Bayar — Rp ${grandTotal.toLocaleString("id-ID")}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
