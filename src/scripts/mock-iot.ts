/**
 * Mock IoT Data Script
 * Simulates an ESP8266 (Wemos D1 Mini) sending sensor data to the API.
 *
 * Usage:
 *   npx tsx src/scripts/mock-iot.ts
 *
 * Environment:
 *   BIOBIN_ID  — UUID of the BioBin unit (required)
 *   API_URL    — Base URL (default: http://localhost:3000)
 *   INTERVAL   — Interval in ms (default: 5000)
 */

const BIOBIN_ID = process.env.BIOBIN_ID || "";
const API_URL = process.env.API_URL || "http://localhost:3000";
const INTERVAL = parseInt(process.env.INTERVAL || "5000");

if (!BIOBIN_ID) {
  console.error(
    "❌ BIOBIN_ID is required. Set it as an environment variable."
  );
  console.error(
    "   Example: BIOBIN_ID=<uuid> npx tsx src/scripts/mock-iot.ts"
  );
  process.exit(1);
}

// Simulation state
let temperature = 55; // Starting temp in optimal compost range
let humidity = 60;
let methane = 250;
let ammonia = 20;
let tick = 0;

/**
 * Generate realistic sensor data with small random fluctuations.
 * Simulates the compost fermentation process.
 */
function generateReading() {
  tick++;

  // Temperature: fluctuates in the 50-65°C optimal compost range
  // With a slight upward trend to simulate active fermentation
  const tempDelta = (Math.random() - 0.45) * 2; // Slight upward bias
  temperature = Math.max(45, Math.min(70, temperature + tempDelta));

  // Humidity: fluctuates around 55-65%
  const humDelta = (Math.random() - 0.5) * 3;
  humidity = Math.max(35, Math.min(80, humidity + humDelta));

  // Methane: fluctuates 100-500 ppm, increases as decomposition progresses
  const metDelta = (Math.random() - 0.45) * 20;
  methane = Math.max(50, Math.min(600, methane + metDelta));

  // Ammonia: fluctuates 5-50 ppm
  const ammDelta = (Math.random() - 0.5) * 5;
  ammonia = Math.max(2, Math.min(60, ammonia + ammDelta));

  return {
    biobin_id: BIOBIN_ID,
    temperature: parseFloat(temperature.toFixed(2)),
    humidity: parseFloat(humidity.toFixed(2)),
    methane_level: parseFloat(methane.toFixed(2)),
    ammonia_level: parseFloat(ammonia.toFixed(2)),
  };
}

async function sendReading() {
  const data = generateReading();

  try {
    const res = await fetch(`${API_URL}/api/sensors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const result = await res.json();
      console.log(
        `✅ [${new Date().toLocaleTimeString("id-ID")}] Sent #${tick}: ` +
          `🌡️ ${data.temperature}°C | ` +
          `💧 ${data.humidity}% | ` +
          `🔥 ${data.methane_level}ppm | ` +
          `🧪 ${data.ammonia_level}ppm` +
          ` → ID: ${result.id?.slice(0, 8)}...`
      );
    } else {
      const err = await res.json();
      console.error(`❌ Error: ${res.status} — ${err.error}`);
    }
  } catch (err) {
    console.error(`❌ Network error:`, (err as Error).message);
  }
}

// Main
console.log("╔══════════════════════════════════════════════════╗");
console.log("║     🌱 WasteWise Mock IoT — Sensor Simulator   ║");
console.log("╠══════════════════════════════════════════════════╣");
console.log(`║  BioBin ID : ${BIOBIN_ID.slice(0, 20)}...`);
console.log(`║  API URL   : ${API_URL}`);
console.log(`║  Interval  : ${INTERVAL}ms`);
console.log("╚══════════════════════════════════════════════════╝");
console.log("");
console.log("Sending sensor data... Press Ctrl+C to stop.\n");

// Send first reading immediately
sendReading();

// Then send at intervals
setInterval(sendReading, INTERVAL);
