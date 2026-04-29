import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "../../components/dashboard/DashboardNavbar";
import MobileNav from "../../components/dashboard/MobileNav";
import Footer from "../../components/landing/Footer";

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
    // Admin: biocompose + verify + products
    ...(isAdmin
      ? [
          { href: "/deposit", label: "Setoran" },
          { href: "/biobin", label: "BioCompose" },
          { href: "/admin/deposits", label: "Verifikasi" },
          { href: "/admin/products", label: "Kelola Produk" },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Floating Top Navbar */}
      <DashboardNavbar
        navItems={navItems}
        fullName={profile?.full_name || ""}
        role={userRole}
      />

      {/* Page Content — full width, generous whitespace */}
      <main className="flex-1 w-full max-w-[1152px] mx-auto px-5 sm:px-6 pt-28 pb-24 md:pb-16">
        {children}
      </main>

      {/* Footer — same as landing for design consistency */}
      <Footer />

      {/* Mobile Bottom Nav — only on mobile for thumb-friendly UX */}
      <MobileNav role={userRole} />
    </div>
  );
}
