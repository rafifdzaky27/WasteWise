-- =============================================================
-- WasteWise Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New)
-- =============================================================

-- ─── User Profiles ───────────────────────────────────────────
-- Extends Supabase auth.users with app-specific data
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null default '',
  role text not null default 'warga' check (role in ('warga', 'admin', 'petani')),
  total_points integer not null default 0,
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'warga')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Waste Deposits ──────────────────────────────────────────
create table public.waste_deposits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  weight_kg numeric(6,2) not null,
  waste_type text not null check (waste_type in ('organic', 'recyclable')),
  qr_code text not null,
  points_earned integer not null default 0,
  verified_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ─── Point Transactions ─────────────────────────────────────
create table public.point_transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount integer not null,
  type text not null check (type in ('earned', 'redeemed')),
  reference_id uuid,
  description text not null default '',
  created_at timestamptz not null default now()
);

-- ─── Voucher Redemptions ────────────────────────────────────
create table public.voucher_redemptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  points_spent integer not null,
  voucher_type text not null check (voucher_type in ('lpg', 'marketplace')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'claimed')),
  created_at timestamptz not null default now()
);

-- ─── BioBin Units ───────────────────────────────────────────
create table public.biobin_units (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  location text not null default '',
  status text not null default 'active' check (status in ('active', 'maintenance', 'harvesting')),
  last_reading_at timestamptz
);

-- ─── Sensor Readings ────────────────────────────────────────
create table public.sensor_readings (
  id uuid default gen_random_uuid() primary key,
  biobin_id uuid references public.biobin_units(id) on delete cascade not null,
  temperature numeric(5,2) not null,
  humidity numeric(5,2) not null,
  methane_level numeric(8,2) not null default 0,
  ammonia_level numeric(8,2) not null default 0,
  recorded_at timestamptz not null default now()
);

-- Index for fast time-series queries
create index idx_sensor_readings_biobin_time
  on public.sensor_readings (biobin_id, recorded_at desc);

-- ─── Harvest Events ─────────────────────────────────────────
create table public.harvest_events (
  id uuid default gen_random_uuid() primary key,
  biobin_id uuid references public.biobin_units(id) on delete cascade not null,
  compost_weight_kg numeric(8,2) not null default 0,
  fermentation_days integer not null default 0,
  status text not null default 'predicted' check (status in ('predicted', 'ready', 'harvested')),
  predicted_at timestamptz not null default now(),
  harvested_at timestamptz
);

-- ─── Products ───────────────────────────────────────────────
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null default '',
  image_url text not null default '',
  price_rp integer not null,
  stock_qty integer not null default 0,
  category text not null check (category in ('compost', 'liquid', 'seeds', 'briquettes')),
  harvest_id uuid references public.harvest_events(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─── Orders ─────────────────────────────────────────────────
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  buyer_id uuid references public.profiles(id) on delete cascade not null,
  total_price_rp integer not null default 0,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'completed')),
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) not null,
  quantity integer not null default 1,
  unit_price_rp integer not null
);

-- ─── Impact Log ─────────────────────────────────────────────
create table public.impact_log (
  id uuid default gen_random_uuid() primary key,
  period_date date not null unique,
  total_waste_collected_kg numeric(10,2) not null default 0,
  total_compost_produced_kg numeric(10,2) not null default 0,
  landfill_reduction_pct numeric(5,2) not null default 0,
  active_participants integer not null default 0
);

-- =============================================================
-- Row Level Security (RLS)
-- =============================================================

alter table public.profiles enable row level security;
alter table public.waste_deposits enable row level security;
alter table public.point_transactions enable row level security;
alter table public.voucher_redemptions enable row level security;
alter table public.biobin_units enable row level security;
alter table public.sensor_readings enable row level security;
alter table public.harvest_events enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.impact_log enable row level security;

-- Profiles: users can read their own, admins can read all
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Admins can view all profiles" on public.profiles
  for select using (
    ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  );

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Waste deposits: own records, admins see all
create policy "Users can view own deposits" on public.waste_deposits
  for select using (auth.uid() = user_id);

create policy "Admins can view all deposits" on public.waste_deposits
  for select using (
    ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  );

create policy "Users can insert deposits" on public.waste_deposits
  for insert with check (auth.uid() = user_id);

create policy "Admins can update deposits" on public.waste_deposits
  for update using (
    ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  );

-- Points: own records
create policy "Users can view own points" on public.point_transactions
  for select using (auth.uid() = user_id);

create policy "System can insert points" on public.point_transactions
  for insert with check (auth.uid() = user_id);

-- Vouchers: own records
create policy "Users can view own vouchers" on public.voucher_redemptions
  for select using (auth.uid() = user_id);

create policy "Users can insert vouchers" on public.voucher_redemptions
  for insert with check (auth.uid() = user_id);

create policy "Admins can update vouchers" on public.voucher_redemptions
  for update using (
    ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  );

-- BioBin, sensors, harvests: public read
create policy "Anyone can view biobin units" on public.biobin_units
  for select using (true);

create policy "Anyone can view sensor readings" on public.sensor_readings
  for select using (true);

create policy "Anyone can insert sensor readings" on public.sensor_readings
  for insert with check (true);  -- IoT device inserts via service role or anon

create policy "Anyone can view harvest events" on public.harvest_events
  for select using (true);

-- Products: public read
create policy "Anyone can view active products" on public.products
  for select using (is_active = true);

create policy "Admins can manage products" on public.products
  for all using (
    ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  );

-- Orders: own records
create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = buyer_id);

create policy "Users can insert orders" on public.orders
  for insert with check (auth.uid() = buyer_id);

create policy "Users can view own order items" on public.order_items
  for select using (
    exists (select 1 from public.orders where id = order_id and buyer_id = auth.uid())
  );

create policy "Users can insert order items" on public.order_items
  for insert with check (
    exists (select 1 from public.orders where id = order_id and buyer_id = auth.uid())
  );

-- Impact log: public read
create policy "Anyone can view impact log" on public.impact_log
  for select using (true);

create policy "Admins can manage impact log" on public.impact_log
  for all using (
    ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  );

-- =============================================================
-- Enable Realtime for sensor_readings (for live dashboard)
-- =============================================================
alter publication supabase_realtime add table public.sensor_readings;
