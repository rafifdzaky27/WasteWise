import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "../../assets/images/wastewise_logo.png";
import MobileNav from "../../components/dashboard/MobileNav";

import UserProfile from "../../components/dashboard/UserProfile";
import MobileHeaderLogout from "../../components/dashboard/MobileHeaderLogout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  const navItems = [
    { href: "/dashboard", label: "Beranda", icon: "📊" },
    { href: "/deposit", label: "Setor Sampah", icon: "♻️" },
    { href: "/rewards", label: "Hadiah", icon: "🎁" },
    { href: "/biobin", label: "BioBin", icon: "🌡️" },
    { href: "/orders", label: "Pesanan", icon: "📦" },
  ];

  const adminItems = [
    { href: "/admin/deposits", label: "Verifikasi Setoran", icon: "✅" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col border-r border-stone-border bg-white/60 backdrop-blur-lg sticky top-0 h-screen overflow-y-auto z-40">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-stone-border">
          <Image src={logo} alt="WasteWise Logo" width={32} height={32} className="w-8 h-8 object-contain drop-shadow-sm" />
          <span className="text-lg font-bold text-primary-darker tracking-tight">
            WasteWise
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-accent-green transition-all duration-200"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          {isAdmin && (
            <>
              <div className="pt-4 pb-2 px-4">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Admin</p>
              </div>
              {adminItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-accent-green transition-all duration-200"
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* User Info */}
        <div className="px-4 py-4 border-t border-stone-border">
          <UserProfile fullName={profile?.full_name || ""} role={profile?.role || ""} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar (mobile) */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-stone-border bg-white/60 backdrop-blur-lg">
          <div className="flex items-center gap-2">
            <Image src={logo} alt="WasteWise Logo" width={24} height={24} className="w-6 h-6 object-contain drop-shadow-sm" />
            <span className="text-sm font-bold text-primary-darker">
              WasteWise
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xs font-medium text-muted capitalize px-2 py-1 rounded-full bg-accent-green">
              {profile?.role || "warga"}
            </span>
            <MobileHeaderLogout />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">{children}</main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
}
