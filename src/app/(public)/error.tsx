"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Public Page Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-4xl mb-6">
        😔
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-3">
        Halaman Bermasalah
      </h1>
      <p className="text-muted max-w-md mb-8 leading-relaxed">
        Maaf, terjadi kesalahan saat memuat konten. Silakan muat ulang halaman
        atau kembali ke beranda.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-primary-dark text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-darker transition-colors"
        >
          Muat Ulang
        </button>
        <Link
          href="/"
          className="border border-stone-border px-6 py-2.5 rounded-xl font-medium text-sm text-foreground hover:bg-stone-light transition-colors"
        >
          Ke Beranda
        </Link>
      </div>
    </div>
  );
}
