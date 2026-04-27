"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";
import type { UserRole } from "../../../lib/types";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("warga");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
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
    { value: "warga", label: "🏘️ Warga", desc: "Setor sampah & dapatkan reward" },
    { value: "petani", label: "👨‍🌾 Petani", desc: "Beli produk daur ulang" },
    { value: "admin", label: "🏛️ Admin BUMDes", desc: "Kelola operasional" },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-foreground text-center mb-2">
        Bergabung dengan WasteWise
      </h1>
      <p className="text-sm text-muted text-center mb-8">
        Buat akun Anda dan mulai berkontribusi
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Nama Lengkap
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nama lengkap"
            required
            className="w-full px-4 py-3 rounded-xl border border-stone-border bg-white text-foreground placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 rounded-xl border border-stone-border bg-white text-foreground placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Kata Sandi
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 karakter"
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl border border-stone-border bg-white text-foreground placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        {/* Role selector */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Saya adalah...
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
                <span className="text-lg mb-1">{r.label.split(" ")[0]}</span>
                <span className="text-[11px] font-medium text-foreground leading-tight">
                  {r.label.split(" ").slice(1).join(" ")}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted mt-1.5 text-center">
            {roles.find((r) => r.value === role)?.desc}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-dark text-white font-medium py-3.5 rounded-xl hover:bg-primary-darker transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="opacity-25"
                />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  className="opacity-75"
                />
              </svg>
              Membuat akun...
            </span>
          ) : (
            "Buat Akun"
          )}
        </button>
      </form>

      <p className="text-sm text-muted text-center mt-6">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          Masuk
        </Link>
      </p>
    </>
  );
}
