import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6">
      <div className="w-24 h-24 bg-stone-light rounded-full flex items-center justify-center text-5xl mb-8">
        🔍
      </div>
      <h1 className="text-4xl font-bold text-foreground mb-3">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-muted max-w-md mb-8 leading-relaxed">
        Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan. Silakan kembali ke beranda.
      </p>
      <Link
        href="/"
        className="bg-primary-dark text-white px-8 py-3 rounded-xl font-medium text-sm hover:bg-primary-darker transition-colors"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
