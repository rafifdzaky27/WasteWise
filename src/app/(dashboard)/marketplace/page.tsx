import { createClient } from "../../../lib/supabase/server";
import MarketplaceClient from "../../../components/marketplace/MarketplaceClient";
import type { Product } from "../../../lib/types";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MarketplacePage() {
  const supabase = await createClient();
  
  // Fetch products directly on the server
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return <MarketplaceClient initialProducts={(products as Product[]) || []} />;
}
