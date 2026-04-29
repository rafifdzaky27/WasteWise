"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../assets/images/wastewise_logo.png";

import { createClient } from "../../lib/supabase/client";

const navLinks = [
  { label: "Tentang", href: "/about" },
  { label: "Reward", href: "/#features" },
  { label: "Dampak", href: "/impact" },
  { label: "Pasar", href: "/#marketplace" },
  { label: "Vitalitas", href: "/#vitality" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);

    // Fetch user
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
        if (data) setUserName(data.full_name);
      }
    };
    fetchUser();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Menu utama"
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between w-[min(1024px,calc(100%-2rem))] h-[66px] px-4 sm:px-6 rounded-full border border-white/20 shadow-md transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-2xl shadow-lg"
            : "glass"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src={logo} alt="WasteWise Logo" width={32} height={32} className="w-8 h-8 object-contain drop-shadow-sm" />
          <span className="font-bold text-xl text-primary-darker tracking-tight">
            WasteWise
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-stone-dark hover:text-primary transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {userName ? (
            <Link
              href="/dashboard"
              className="bg-primary-dark text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-lg hover:bg-primary-darker hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
            >
              Dashboard <span className="opacity-60">—</span> {userName.split(' ')[0]}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-stone-dark hover:text-primary transition-colors duration-200"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="bg-primary-dark text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-lg hover:bg-primary-darker hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
          className="sm:hidden flex flex-col items-center justify-center w-10 h-10 rounded-xl hover:bg-white/30 transition-colors"
        >
          <span
            className={`block w-5 h-0.5 bg-foreground rounded-full transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-[3px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-foreground rounded-full mt-1.5 transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-[3px]" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm sm:hidden animate-fade-in"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 z-[45] w-[280px] h-full bg-white shadow-2xl sm:hidden flex flex-col transition-transform duration-300 ease-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-border">
          <span className="font-bold text-lg text-primary-darker tracking-tight">
            Menu
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Tutup menu"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-light transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-stone-dark hover:text-primary hover:bg-accent-green transition-all duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="px-6 py-6 border-t border-stone-border space-y-3">
          {userName ? (
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center w-full bg-primary-dark text-white text-base font-medium py-3.5 rounded-xl hover:bg-primary-darker transition-colors"
            >
              Dashboard <span className="opacity-60 mx-2">—</span> {userName.split(' ')[0]}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center w-full bg-stone-light/50 text-stone-dark text-base font-medium py-3.5 rounded-xl hover:bg-stone-light transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center w-full bg-primary-dark text-white text-base font-medium py-3.5 rounded-xl hover:bg-primary-darker transition-colors"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
