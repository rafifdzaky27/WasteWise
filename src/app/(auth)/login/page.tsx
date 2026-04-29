"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";
import type { UserRole } from "../../../lib/types";

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";
  
  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("warga");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  const roles: { value: UserRole; label: string; desc: string }[] = [
    { value: "warga", label: "Warga", desc: "Setor & reward" },
    { value: "petani", label: "Petani", desc: "Beli produk" },
    { value: "admin", label: "Admin", desc: "Kelola operasi" },
  ];

  return (
    <>
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-medium text-foreground text-center mb-1">
        {tab === "login" ? (
          <>Selamat <span className="font-serif italic text-primary">Datang</span> Kembali</>
        ) : (
          <>Bergabung <span className="font-serif italic text-primary">Bersama</span> Kami</>
        )}
      </h1>
      <p className="text-sm text-muted text-center mb-8">
        {tab === "login"
          ? "Masuk untuk melanjutkan pelestarian sumber daya."
          : "Buat akun dan mulai kontribusi Anda."}
      </p>

      {/* Tab Switcher */}
      <div className="flex bg-stone-light rounded-xl p-1 mb-8">
        <button
          onClick={() => { setTab("login"); setError(""); }}
          className={`flex-1 text-sm font-medium py-2.5 rounded-lg transition-all duration-200 ${
            tab === "login"
              ? "bg-white text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          Masuk
        </button>
        <button
          onClick={() => { setTab("register"); setError(""); }}
          className={`flex-1 text-sm font-medium py-2.5 rounded-lg transition-all duration-200 ${
            tab === "register"
              ? "bg-white text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          Buat Akun
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {/* Login Form */}
      {tab === "login" && (
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-[10px] font-bold text-muted uppercase tracking-[2px] mb-3">
              Alamat Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@example.com"
              required
              className="w-full text-base text-foreground bg-transparent border-b-2 border-stone-border pb-2 focus:border-primary focus:outline-none transition-colors placeholder:text-stone-lighter"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="password" className="block text-[10px] font-bold text-muted uppercase tracking-[2px]">
                Kata Sandi
              </label>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full text-base text-foreground bg-transparent border-b-2 border-stone-border pb-2 focus:border-primary focus:outline-none transition-colors placeholder:text-stone-lighter"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-dark text-white font-medium py-4 rounded-xl hover:bg-primary-darker transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base mt-2"
          >
            {loading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Memproses...
              </>
            ) : (
              <>
                Masuk
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </>
            )}
          </button>

          <p className="text-sm text-muted text-center mt-4">
            Belum punya akun?{" "}
            <button type="button" onClick={() => setTab("register")} className="text-primary font-medium hover:underline font-serif italic">
              Gabung Gerakan Ini
            </button>
          </p>
        </form>
      )}

      {/* Register Form */}
      {tab === "register" && (
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-[10px] font-bold text-muted uppercase tracking-[2px] mb-3">
              Nama Lengkap
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama Anda"
              required
              className="w-full text-base text-foreground bg-transparent border-b-2 border-stone-border pb-2 focus:border-primary focus:outline-none transition-colors placeholder:text-stone-lighter"
            />
          </div>

          <div>
            <label htmlFor="regEmail" className="block text-[10px] font-bold text-muted uppercase tracking-[2px] mb-3">
              Alamat Email
            </label>
            <input
              id="regEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@example.com"
              required
              className="w-full text-base text-foreground bg-transparent border-b-2 border-stone-border pb-2 focus:border-primary focus:outline-none transition-colors placeholder:text-stone-lighter"
            />
          </div>

          <div>
            <label htmlFor="regPassword" className="block text-[10px] font-bold text-muted uppercase tracking-[2px] mb-3">
              Kata Sandi
            </label>
            <input
              id="regPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 karakter"
              required
              minLength={6}
              className="w-full text-base text-foreground bg-transparent border-b-2 border-stone-border pb-2 focus:border-primary focus:outline-none transition-colors placeholder:text-stone-lighter"
            />
          </div>

          {/* Role selector */}
          <div>
            <label className="block text-[10px] font-bold text-muted uppercase tracking-[2px] mb-3">
              Saya Adalah
            </label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`flex flex-col items-center text-center p-3 rounded-xl border-2 transition-all duration-200 ${
                    role === r.value
                      ? "border-primary bg-accent-green"
                      : "border-stone-border bg-white hover:border-stone-lighter"
                  }`}
                >
                  <span className="text-xs font-medium text-foreground">{r.label}</span>
                  <span className="text-[10px] text-muted mt-0.5">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-dark text-white font-medium py-4 rounded-xl hover:bg-primary-darker transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base mt-2"
          >
            {loading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Membuat akun...
              </>
            ) : (
              <>
                Buat Akun
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </>
            )}
          </button>

          <p className="text-sm text-muted text-center mt-4">
            Sudah punya akun?{" "}
            <button type="button" onClick={() => setTab("login")} className="text-primary font-medium hover:underline">
              Masuk
            </button>
          </p>
        </form>
      )}
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="animate-pulse space-y-4"><div className="h-8 bg-stone-light rounded w-2/3 mx-auto" /><div className="h-4 bg-stone-light rounded w-1/2 mx-auto" /></div>}>
      <LoginPageInner />
    </Suspense>
  );
}
