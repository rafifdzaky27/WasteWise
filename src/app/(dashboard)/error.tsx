"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl mb-6">
        ⚠️
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">
        Terjadi Kesalahan
      </h2>
      <p className="text-sm text-muted mb-6 leading-relaxed">
        Maaf, terjadi kesalahan saat memuat halaman ini. Silakan coba lagi atau
        hubungi administrator jika masalah berlanjut.
      </p>
      <button
        onClick={reset}
        className="bg-primary-dark text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-darker transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  );
}
