import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import MobileNav from "../../components/dashboard/MobileNav";

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

  const userRole = profile?.role || "warga";
  const isAdmin = userRole === "admin";
  const isWarga = userRole === "warga";
  const isPetani = userRole === "petani";

  // Navigation items based on role — clean labels, no emoji
  const navItems = [
    { href: "/dashboard", label: "Beranda" },
    // Warga: setor sampah + hadiah
    ...(isWarga
      ? [
          { href: "/deposit", label: "Setor Sampah" },
          { href: "/rewards", label: "Hadiah" },
        ]
      : []),
    // Petani: marketplace + pesanan
    ...(isPetani
      ? [
          { href: "/marketplace", label: "Marketplace" },
          { href: "/orders", label: "Pesanan" },
        ]
      : []),
    // Admin: biocompose + verify + products + orders + vouchers
    ...(isAdmin
      ? [
          { href: "/biobin", label: "BioCompose" },
          { href: "/admin/deposits", label: "Verifikasi Setoran" },
          { href: "/admin/orders", label: "Pesanan Masuk" },
          { href: "/admin/products", label: "Kelola Produk" },
          { href: "/admin/vouchers", label: "Penukaran Voucher" },
        ]
      : []),
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Left Sidebar */}
      <DashboardSidebar
        navItems={navItems}
        fullName={profile?.full_name || ""}
        role={userRole}
      />

      {/* Page Content — pushed to right on desktop */}
      <main className="flex-1 w-full max-w-[1152px] mx-auto px-5 sm:px-8 pt-10 pb-24 md:pb-16 md:ml-[260px] lg:ml-[280px]">
        {children}
      </main>

      {/* Mobile Bottom Nav — only on mobile for thumb-friendly UX */}
      <MobileNav role={userRole} />
    </div>
  );
}
