"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../assets/images/wastewise_logo.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between w-[min(1024px,calc(100%-2rem))] h-[66px] px-6 rounded-full border border-white/20 shadow-md transition-all duration-500 ${
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

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        {[{label:"Fitur",href:"/#features"},{label:"Dampak",href:"/impact"},{label:"Pasar",href:"/#marketplace"},{label:"Vitalitas",href:"/#vitality"}].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="text-sm font-medium text-stone-dark hover:text-primary transition-colors duration-200"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/register"
        className="hidden sm:block bg-primary-dark text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-lg hover:bg-primary-darker hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
      >
        Bergabung Sekarang
      </Link>
    </nav>
  );
}
