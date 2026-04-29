"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import logo from "../../assets/images/wastewise_logo.png";

interface NavItem {
  href: string;
  label: string;
}

interface DashboardSidebarProps {
  navItems: NavItem[];
  fullName: string;
  role: string;
}

export default function DashboardSidebar({ navItems, fullName, role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = fullName ? fullName.charAt(0).toUpperCase() : "U";

  // Map icons for standard paths
  const getIcon = (href: string, isActive: boolean) => {
    const stroke = isActive ? "currentColor" : "currentColor";
    const className = isActive ? "text-primary" : "text-stone-dark group-hover:text-primary transition-colors";
    
    switch (true) {
      case href === "/dashboard":
        return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
      case href === "/deposit" || href === "/admin/deposits":
        return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>;
      case href === "/rewards":
        return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
      case href === "/marketplace" || href === "/admin/products":
        return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
      case href === "/orders":
        return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
      case href === "/biobin":
        return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77"/></svg>;
      default:
        return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/></svg>;
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-[260px] lg:w-[280px] h-screen fixed top-0 left-0 border-r border-stone-border bg-stone-50/50 backdrop-blur-xl z-40 pb-6">
      {/* Brand Header */}
      <div className="px-8 py-10 flex flex-col gap-2">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <Image src={logo} alt="WasteWise Logo" width={32} height={32} className="w-8 h-8 object-contain drop-shadow-sm group-hover:scale-105 transition-transform" />
          <span className="font-bold text-2xl text-primary-darker tracking-tight font-serif italic">
            WasteWise
          </span>
        </Link>
        <p className="text-[10px] uppercase tracking-[2px] text-muted font-bold ml-11">Dashboard</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? "font-medium text-primary-dark bg-white shadow-sm border border-stone-border/60"
                  : "font-medium text-stone-dark hover:text-foreground hover:bg-white/60 border border-transparent"
              }`}
            >
              {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-full" />}
              {getIcon(item.href, isActive)}
              <span className="tracking-wide relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className="px-6 mt-auto pt-6">
        <div className="bg-white border border-stone-border rounded-2xl p-4 shadow-sm relative group cursor-pointer transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-green flex items-center justify-center text-sm font-bold text-primary shrink-0 border border-primary/10">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate leading-tight">{fullName || "User"}</p>
              <p className="text-[11px] font-medium text-muted uppercase tracking-wider mt-1">{role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 absolute right-4"
              title="Keluar"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
