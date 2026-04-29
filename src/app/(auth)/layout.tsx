import Link from "next/link";
import Image from "next/image";
import logo from "../../assets/images/wastewise_logo.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-green/30 via-background to-background pointer-events-none" />

      {/* Logo */}
      <Link
        href="/"
        className="relative z-10 flex items-center gap-2 mb-10"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#016630" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77" />
        </svg>
        <span className="text-xl font-bold text-primary-darker tracking-tight">
          WasteWise
        </span>
      </Link>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-stone-border rounded-2xl shadow-sm p-8 sm:p-10">
        {children}
      </div>
    </div>
  );
}
