import { createClient } from "../../../../lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all verified deposits with dates
    const { data: deposits, error: depositsError } = await supabase
      .from("waste_deposits")
      .select("weight_kg, waste_type, created_at, verified_by")
      .not("verified_by", "is", null)
      .order("created_at", { ascending: true });

    if (depositsError) throw depositsError;

    // Total stats
    const totalWaste = deposits?.reduce((sum, d) => sum + Number(d.weight_kg), 0) || 0;
    const organicWaste = deposits?.filter(d => d.waste_type === "organic").reduce((sum, d) => sum + Number(d.weight_kg), 0) || 0;
    const recyclableWaste = deposits?.filter(d => d.waste_type === "recyclable").reduce((sum, d) => sum + Number(d.weight_kg), 0) || 0;

    // CO2 estimation: 1 kg organic waste managed = ~0.5 kg CO₂ avoided
    // Recyclable: 1 kg = ~1.2 kg CO₂ avoided (more impact)
    const co2Avoided = (organicWaste * 0.5) + (recyclableWaste * 1.2);

    // Compost produced estimate: ~40% of organic waste becomes compost
    const compostProduced = organicWaste * 0.4;

    // Active participants
    const { count: activeUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "warga");

    // Total deposits count
    const totalDeposits = deposits?.length || 0;

    // Daily trend data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyMap: Record<string, { organic: number; recyclable: number; total: number }> = {};
    
    // Initialize all 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const key = date.toISOString().split("T")[0];
      dailyMap[key] = { organic: 0, recyclable: 0, total: 0 };
    }

    // Fill with actual data
    deposits?.forEach((d) => {
      const key = new Date(d.created_at).toISOString().split("T")[0];
      if (dailyMap[key]) {
        const weight = Number(d.weight_kg);
        dailyMap[key].total += weight;
        if (d.waste_type === "organic") {
          dailyMap[key].organic += weight;
        } else {
          dailyMap[key].recyclable += weight;
        }
      }
    });

    const dailyTrend = Object.entries(dailyMap).map(([date, data]) => ({
      date,
      label: new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      ...data,
    }));

    // Landfill reduction percentage (target: reduce 100kg/month from TPA)
    const monthlyTarget = 100; // kg
    const currentMonthDeposits = deposits?.filter((d) => {
      const created = new Date(d.created_at);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    });
    const currentMonthWeight = currentMonthDeposits?.reduce((sum, d) => sum + Number(d.weight_kg), 0) || 0;
    const landfillReduction = Math.min((currentMonthWeight / monthlyTarget) * 100, 100);

    return NextResponse.json({
      totalWaste: Math.round(totalWaste * 10) / 10,
      organicWaste: Math.round(organicWaste * 10) / 10,
      recyclableWaste: Math.round(recyclableWaste * 10) / 10,
      co2Avoided: Math.round(co2Avoided * 10) / 10,
      compostProduced: Math.round(compostProduced * 10) / 10,
      activeUsers: activeUsers || 0,
      totalDeposits,
      landfillReduction: Math.round(landfillReduction),
      currentMonthWeight: Math.round(currentMonthWeight * 10) / 10,
      monthlyTarget,
      dailyTrend,
    });
  } catch (error) {
    console.error("Impact API error:", error);
    return NextResponse.json({ error: "Gagal memuat data dampak" }, { status: 500 });
  }
}
