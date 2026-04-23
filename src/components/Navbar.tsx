"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#016630"/>
        </svg>
        <span className="font-bold text-xl text-primary-darker tracking-tight">
          WasteWise
        </span>
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        {["Features", "Impact", "Marketplace", "Vitality"].map((item) => (
          <Link
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-sm font-medium text-stone-dark hover:text-primary transition-colors duration-200"
          >
            {item}
          </Link>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="#"
        className="hidden sm:block bg-primary-dark text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-lg hover:bg-primary-darker hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
      >
        Join the Movement
      </Link>
    </nav>
  );
}
