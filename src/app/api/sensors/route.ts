import { createClient } from "../../../lib/supabase/server";
import { NextRequest } from "next/server";

/**
 * GET /api/sensors?biobin_id=<uuid>&limit=50
 * Fetch recent sensor readings for a given BioBin unit.
 * Requires authentication (dashboard users).
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
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);

  if (!biobin_id) {
    return Response.json(
      { error: "biobin_id query parameter is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("sensor_readings")
    .select("*")
    .eq("biobin_id", biobin_id)
    .order("recorded_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("API /sensors GET Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Return in ascending order for charts (oldest first)
  return Response.json(data?.reverse() || []);
}

/**
 * POST /api/sensors
 * Receive sensor data from ESP8266 or mock script.
 * No auth required — IoT devices can't hold sessions.
 * RLS on sensor_readings allows public insert.
 *
 * Body: { biobin_id, temperature, humidity, methane_level, ammonia_level }
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { biobin_id, temperature, humidity, methane_level, ammonia_level } =
    body;

  // Validate required fields
  if (!biobin_id) {
    return Response.json(
      { error: "biobin_id is required" },
      { status: 400 }
    );
  }

  if (
    typeof temperature !== "number" ||
    typeof humidity !== "number" ||
    typeof methane_level !== "number" ||
    typeof ammonia_level !== "number"
  ) {
    return Response.json(
      {
        error:
          "temperature, humidity, methane_level, ammonia_level must be numbers",
      },
      { status: 400 }
    );
  }

  // Insert sensor reading
  const { data: reading, error: insertError } = await supabase
    .from("sensor_readings")
    .insert({
      biobin_id,
      temperature,
      humidity,
      methane_level,
      ammonia_level,
    })
    .select()
    .single();

  if (insertError) {
    console.error("API /sensors POST Error:", insertError);
    return Response.json({ error: insertError.message }, { status: 500 });
  }

  // Update last_reading_at on the biobin unit
  await supabase
    .from("biobin_units")
    .update({ last_reading_at: new Date().toISOString() })
    .eq("id", biobin_id);

  return Response.json(reading, { status: 201 });
}
