import { createClient } from "../../../../lib/supabase/server";
import { NextRequest } from "next/server";

/**
 * GET /api/sensors/predict?biobin_id=<uuid>
 * Prediksi panen kompos berdasarkan akumulasi hari suhu stabil 50-65°C.
 * Jika ≥ 21 hari berturut-turut → status "ready".
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const biobin_id = searchParams.get("biobin_id");

  if (!biobin_id) {
    return Response.json(
      { error: "biobin_id query parameter is required" },
      { status: 400 }
    );
  }

  // Fetch sensor readings from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: readings, error } = await supabase
    .from("sensor_readings")
    .select("temperature, recorded_at")
    .eq("biobin_id", biobin_id)
    .gte("recorded_at", thirtyDaysAgo.toISOString())
    .order("recorded_at", { ascending: true });

  if (error) {
    console.error("API /sensors/predict Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  if (!readings || readings.length === 0) {
    return Response.json({
      status: "no_data",
      fermentation_days: 0,
      days_remaining: 21,
      predicted_harvest_date: null,
      message: "No sensor data available for prediction",
    });
  }

  // Group readings by date and compute daily average temperature
  const dailyAvg: Record<string, { sum: number; count: number }> = {};
  for (const r of readings) {
    const day = r.recorded_at.split("T")[0]; // "YYYY-MM-DD"
    if (!dailyAvg[day]) {
      dailyAvg[day] = { sum: 0, count: 0 };
    }
    dailyAvg[day].sum += Number(r.temperature);
    dailyAvg[day].count += 1;
  }

  // Count consecutive days with avg temp in the ideal compost range (50-65°C)
  const sortedDays = Object.keys(dailyAvg).sort();
  let consecutiveDays = 0;
  let maxConsecutiveDays = 0;

  for (const day of sortedDays) {
    const avg = dailyAvg[day].sum / dailyAvg[day].count;
    if (avg >= 50 && avg <= 65) {
      consecutiveDays++;
      maxConsecutiveDays = Math.max(maxConsecutiveDays, consecutiveDays);
    } else {
      consecutiveDays = 0;
    }
  }

  // Use the current consecutive streak for prediction
  const fermentationDays = consecutiveDays;
  const HARVEST_THRESHOLD = 21;
  const isReady = fermentationDays >= HARVEST_THRESHOLD;
  const daysRemaining = isReady
    ? 0
    : HARVEST_THRESHOLD - fermentationDays;

  // Calculate predicted harvest date
  const predictedDate = new Date();
  predictedDate.setDate(predictedDate.getDate() + daysRemaining);

  const status = isReady ? "ready" : "predicted";

  // Upsert harvest event
  // Check for existing non-harvested event for this biobin
  const { data: existingEvent } = await supabase
    .from("harvest_events")
    .select("id")
    .eq("biobin_id", biobin_id)
    .in("status", ["predicted", "ready"])
    .order("predicted_at", { ascending: false })
    .limit(1)
    .single();

  if (existingEvent) {
    // Update existing event
    await supabase
      .from("harvest_events")
      .update({
        fermentation_days: fermentationDays,
        status,
      })
      .eq("id", existingEvent.id);
  } else {
    // Create new harvest event
    await supabase.from("harvest_events").insert({
      biobin_id,
      fermentation_days: fermentationDays,
      status,
      compost_weight_kg: 0, // Will be updated on actual harvest
    });
  }

  return Response.json({
    status,
    fermentation_days: fermentationDays,
    max_consecutive_days: maxConsecutiveDays,
    days_remaining: daysRemaining,
    predicted_harvest_date: isReady ? null : predictedDate.toISOString(),
    total_days_tracked: sortedDays.length,
  });
}
