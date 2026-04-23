import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "../../assets/images/wastewise_logo.png";

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

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/dashboard", label: "Deposit", icon: "♻️" },
    { href: "/dashboard", label: "Rewards", icon: "🎁" },
    { href: "/dashboard", label: "BioBin", icon: "🌡️" },
    { href: "/dashboard", label: "Orders", icon: "📦" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col border-r border-stone-border bg-white/60 backdrop-blur-lg">
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
        </nav>

        {/* User Info */}
        <div className="px-4 py-4 border-t border-stone-border">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
              {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {profile?.full_name || "User"}
              </p>
              <p className="text-xs text-muted capitalize">
                {profile?.role || "warga"}
              </p>
            </div>
          </div>
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
          <span className="text-xs font-medium text-muted capitalize px-2 py-1 rounded-full bg-accent-green">
            {profile?.role || "warga"}
          </span>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
