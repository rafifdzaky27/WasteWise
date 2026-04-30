/* ─── User Roles ──────────────────────────────────────────────── */

export type UserRole = "warga" | "admin" | "petani";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  total_points: number;
  created_at: string;
}

/* ─── Waste Deposits (FR-01, FR-02) ──────────────────────────── */

export type WasteType = "organic" | "recyclable";

export interface WasteDeposit {
  id: string;
  user_id: string;
  weight_kg: number;
  waste_type: WasteType;
  qr_code: string;
  points_earned: number;
  verified_by: string | null;
  created_at: string;
}

/* ─── Points & Vouchers (FR-03, FR-04) ───────────────────────── */

export type PointTransactionType = "earned" | "redeemed";

export interface PointTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: PointTransactionType;
  reference_id: string | null;
  description: string;
  created_at: string;
}

export type VoucherType = "lpg" | "marketplace";
export type VoucherStatus = "pending" | "approved" | "claimed";

export interface VoucherRedemption {
  id: string;
  user_id: string;
  points_spent: number;
  voucher_type: VoucherType;
  status: VoucherStatus;
  created_at: string;
}

/* ─── BioBin & Sensors (FR-05 → FR-08) ───────────────────────── */

export type BioBinStatus = "active" | "maintenance" | "harvesting";

export interface BioBinUnit {
  id: string;
  name: string;
  location: string;
  status: BioBinStatus;
  last_reading_at: string | null;
}

export interface SensorReading {
  id: string;
  biobin_id: string;
  temperature: number;
  humidity: number;
  methane_level: number;
  ammonia_level: number;
  recorded_at: string;
}

export type HarvestStatus = "predicted" | "ready" | "harvested";

export interface HarvestEvent {
  id: string;
  biobin_id: string;
  compost_weight_kg: number;
  fermentation_days: number;
  status: HarvestStatus;
  predicted_at: string;
  harvested_at: string | null;
}

/* ─── Products & Marketplace (FR-11 → FR-13) ─────────────────── */

export type ProductCategory = "compost" | "liquid";

export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price_rp: number;
  stock_qty: number;
  category: ProductCategory;
  harvest_id: string | null;
  is_active: boolean;
  created_at: string;
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "completed";

export interface Order {
  id: string;
  buyer_id: string;
  total_price_rp: number;
  status: OrderStatus;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price_rp: number;
}

/* ─── Impact Logger (FR-09, FR-10) ───────────────────────────── */

export interface ImpactLog {
  id: string;
  period_date: string;
  total_waste_collected_kg: number;
  total_compost_produced_kg: number;
  landfill_reduction_pct: number;
  active_participants: number;
}

/* ─── Phase 2 Constants ──────────────────────────────────────── */

export const POINT_RATES: Record<WasteType, number> = {
  organic: 10,
  recyclable: 15,
};

export interface VoucherOption {
  type: VoucherType;
  label: string;
  description: string;
  cost: number;
}

export const VOUCHER_OPTIONS: VoucherOption[] = [
  {
    type: "lpg",
    label: "Voucher LPG 3kg",
    description: "Tukarkan poin Anda dengan voucher LPG 3kg untuk memasak.",
    cost: 500,
  },
];

/* ─── Joined Types (for admin views) ─────────────────────────── */

export interface DepositWithProfile extends WasteDeposit {
  profiles: Pick<UserProfile, "full_name" | "email">;
}
