"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { SensorReading } from "../../lib/types";

interface SensorChartProps {
  readings: SensorReading[];
  dataKey: "temperature" | "humidity" | "methane_level" | "ammonia_level";
  label: string;
  unit: string;
  color: string;
  gradientId: string;
}

const CHART_CONFIGS = {
  temperature: {
    color: "#ef4444",
    gradientFrom: "#ef4444",
    gradientTo: "#fef2f2",
    label: "Suhu",
    unit: "°C",
  },
  humidity: {
    color: "#3b82f6",
    gradientFrom: "#3b82f6",
    gradientTo: "#eff6ff",
    label: "Kelembapan",
    unit: "%",
  },
  methane_level: {
    color: "#f59e0b",
    gradientFrom: "#f59e0b",
    gradientTo: "#fffbeb",
    label: "Metana (CH₄)",
    unit: " ppm",
  },
  ammonia_level: {
    color: "#8b5cf6",
    gradientFrom: "#8b5cf6",
    gradientTo: "#faf5ff",
    label: "Amonia (NH₃)",
    unit: " ppm",
  },
};

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  const config =
    CHART_CONFIGS[data.dataKey as keyof typeof CHART_CONFIGS];
  return (
    <div className="bg-white/95 backdrop-blur-md border border-stone-border rounded-xl px-4 py-3 shadow-lg">
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className="text-sm font-semibold text-foreground">
        {Number(data.value).toFixed(1)}
        {config?.unit || ""}
      </p>
    </div>
  );
}

export default function SensorChart({
  readings,
  dataKey,
  label,
  unit,
  color,
  gradientId,
}: SensorChartProps) {
  const chartData = readings.map((r) => ({
    time: formatTime(r.recorded_at),
    [dataKey]: Number(r[dataKey]),
  }));

  const config = CHART_CONFIGS[dataKey];

  return (
    <div className="glass-card rounded-2xl border border-stone-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{label}</h3>
          <p className="text-xs text-muted mt-0.5">Real-time monitoring</p>
        </div>
        {readings.length > 0 && (
          <div
            className="text-xl font-bold"
            style={{ color: config?.color || color }}
          >
            {Number(readings[readings.length - 1]?.[dataKey]).toFixed(1)}
            <span className="text-xs font-normal text-muted ml-1">
              {unit}
            </span>
          </div>
        )}
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-muted text-sm">
          Menunggu data sensor...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id={gradientId}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={config?.gradientFrom || color}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={config?.gradientTo || "#fff"}
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e7e5e4"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "#79716b" }}
              tickLine={false}
              axisLine={{ stroke: "#e7e5e4" }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#79716b" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={config?.color || color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              animationDuration={300}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export { CHART_CONFIGS };
