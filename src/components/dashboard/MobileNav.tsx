"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileNavProps {
  role: string;
}

export default function MobileNav({ role }: MobileNavProps) {
  const pathname = usePathname();

  const isWarga = role === "warga";
  const isPetani = role === "petani";
  const isAdmin = role === "admin";

  const navItems = [
    { href: "/dashboard", label: "Beranda", icon: "📊" },
    // Warga: setor + hadiah
    ...(isWarga
      ? [
          { href: "/deposit", label: "Setor", icon: "♻️" },
          { href: "/rewards", label: "Hadiah", icon: "🎁" },
        ]
      : []),
    // Petani: marketplace + pesanan
    ...(isPetani
      ? [
          { href: "/marketplace", label: "Pasar", icon: "🛒" },
          { href: "/orders", label: "Pesanan", icon: "📦" },
        ]
      : []),
    // Admin: biocompose + verify
    ...(isAdmin
      ? [
          { href: "/biobin", label: "BioCompose", icon: "🌡️" },
          { href: "/admin/deposits", label: "Verifikasi", icon: "✅" },
        ]
      : []),
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-t border-stone-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-[56px] transition-all duration-200 ${
                isActive
                  ? "text-primary"
                  : "text-muted-light hover:text-foreground"
              }`}
            >
              <span className={`text-xl ${isActive ? "scale-110" : ""} transition-transform duration-200`}>
                {item.icon}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-primary" : "text-muted-light"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
