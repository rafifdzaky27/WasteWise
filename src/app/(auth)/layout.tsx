import Link from "next/link";
import Image from "next/image";
import logo from "../../assets/images/wastewise_logo.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-green via-background to-background" />

      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-8"
        >
          <Image src={logo} alt="WasteWise Logo" width={48} height={48} className="w-12 h-12 object-contain drop-shadow-sm" />
          <span className="text-3xl font-bold text-primary-darker tracking-tight">
            WasteWise
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white/70 border border-white/40 rounded-3xl shadow-xl p-8 backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
