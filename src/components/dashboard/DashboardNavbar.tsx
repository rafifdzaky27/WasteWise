"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import logo from "../../assets/images/wastewise_logo.png";

interface NavItem {
  href: string;
  label: string;
}

interface DashboardNavbarProps {
  navItems: NavItem[];
  fullName: string;
  role: string;
}

export default function DashboardNavbar({ navItems, fullName, role }: DashboardNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = fullName ? fullName.charAt(0).toUpperCase() : "U";

  return (
    <>
      <nav
        role="navigation"
        aria-label="Menu dashboard"
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between w-[min(1024px,calc(100%-2rem))] h-[66px] px-4 sm:px-6 rounded-full border border-white/20 shadow-md transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-2xl shadow-lg"
            : "glass"
        }`}
      >
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <Image src={logo} alt="WasteWise Logo" width={32} height={32} className="w-8 h-8 object-contain drop-shadow-sm" />
          <span className="font-bold text-xl text-primary-darker tracking-tight hidden sm:inline">
            WasteWise
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm px-4 py-2 rounded-full transition-all duration-200 ${
                  isActive
                    ? "font-bold text-foreground"
                    : "font-medium text-stone-dark hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="w-px h-6 bg-stone-border mx-2" />

          {/* Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full transition-all duration-200 ${
                accountOpen ? "font-bold text-foreground" : "font-medium text-stone-dark hover:text-primary"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Akun Saya
            </button>

            {accountOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />
                <div className="absolute top-full right-0 mt-3 w-56 bg-white border border-stone-border rounded-2xl shadow-xl p-2 z-50 animate-fade-in">
                  {/* User Info */}
                  <div className="px-3 py-3 border-b border-stone-border mb-1">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{fullName || "User"}</p>
                        <p className="text-xs text-muted capitalize">{role}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setAccountOpen(false); handleLogout(); }}
                    className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium flex items-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Keluar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
          className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-xl hover:bg-white/30 transition-colors"
        >
          <span className={`block w-5 h-0.5 bg-foreground rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
          <span className={`block w-5 h-0.5 bg-foreground rounded-full mt-1.5 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} />
        </button>
      </nav>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden animate-fade-in" onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed top-0 right-0 z-[45] w-[280px] h-full bg-white shadow-2xl md:hidden flex flex-col transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{fullName || "User"}</p>
              <p className="text-[10px] text-muted capitalize">{role}</p>
            </div>
          </div>
          <button onClick={() => setMenuOpen(false)} aria-label="Tutup menu" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-light transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all duration-200 ${
                  isActive
                    ? "font-bold text-primary bg-accent-green"
                    : "font-medium text-stone-dark hover:text-primary hover:bg-accent-green"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-6 border-t border-stone-border">
          <button
            onClick={() => { setMenuOpen(false); handleLogout(); }}
            className="w-full text-center text-sm font-medium text-red-600 py-3 rounded-xl border border-red-200 hover:bg-red-50 transition-colors"
          >
            Keluar dari Akun
          </button>
        </div>
      </div>
    </>
  );
}
