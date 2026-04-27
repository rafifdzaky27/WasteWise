"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TrendData {
  date: string;
  label: string;
  organic: number;
  recyclable: number;
  total: number;
}

interface ImpactChartProps {
  data: TrendData[];
}

export default function ImpactChart({ data }: ImpactChartProps) {
  return (
    <div className="bg-white/60 border border-stone-border rounded-3xl p-5 sm:p-8 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">
          📈 Tren Pengumpulan Sampah
        </h3>
        <p className="text-sm text-muted mt-1">
          Data 30 hari terakhir (kg)
        </p>
      </div>
      <div className="w-full h-[300px] sm:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
            <defs>
              <linearGradient id="gradientOrganic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#016630" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#016630" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientRecyclable" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#78716c" }}
              tickLine={false}
              axisLine={{ stroke: "#d6d3d1" }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#78716c" }}
              tickLine={false}
              axisLine={false}
              unit=" kg"
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e7e5e4",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                fontSize: "12px",
              }}
              formatter={(value: any, name: any) => [
                `${Number(value).toFixed(1)} kg`,
                name === "organic" ? "Organik" : "Daur Ulang",
              ]}
              labelFormatter={(label: any) => `Tanggal: ${label}`}
            />
            <Legend
              formatter={(value: string) =>
                value === "organic" ? "Organik" : "Daur Ulang"
              }
              wrapperStyle={{ fontSize: "12px" }}
            />
            <Area
              type="monotone"
              dataKey="organic"
              stroke="#016630"
              strokeWidth={2}
              fill="url(#gradientOrganic)"
              dot={false}
              activeDot={{ r: 4, stroke: "#016630", strokeWidth: 2, fill: "#fff" }}
            />
            <Area
              type="monotone"
              dataKey="recyclable"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#gradientRecyclable)"
              dot={false}
              activeDot={{ r: 4, stroke: "#3B82F6", strokeWidth: 2, fill: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
