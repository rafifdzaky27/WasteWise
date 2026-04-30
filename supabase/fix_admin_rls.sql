-- ==========================================
-- FIX: Missing Admin RLS Policies
-- Run di Supabase Dashboard -> SQL Editor
-- ==========================================
-- Masalah: Admin tidak bisa melihat voucher, orders, order_items milik user lain
-- dan tidak bisa insert point_transactions atau update profiles untuk user lain.

-- 1. Admin SELECT on voucher_redemptions (agar admin bisa lihat semua voucher)
DROP POLICY IF EXISTS "Admins can view all vouchers" ON public.voucher_redemptions;
CREATE POLICY "Admins can view all vouchers" ON public.voucher_redemptions
  FOR SELECT USING (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'));

-- 2. Admin SELECT on orders (agar admin bisa lihat semua pesanan)
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'));

-- 3. Admin UPDATE on orders (agar admin bisa ubah status pesanan)
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'));

-- 4. Admin SELECT on order_items (agar admin bisa lihat detail item pesanan)
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT USING (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'));

-- 5. Admin INSERT on point_transactions (agar admin bisa kasih poin ke warga saat verifikasi)
DROP POLICY IF EXISTS "Admins can insert points" ON public.point_transactions;
CREATE POLICY "Admins can insert points" ON public.point_transactions
  FOR INSERT WITH CHECK (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'));

-- 6. Admin UPDATE on profiles (agar admin bisa update total_points warga)
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'));

-- 7. Admin SELECT on point_transactions (agar admin bisa lihat semua transaksi poin)
DROP POLICY IF EXISTS "Admins can view all points" ON public.point_transactions;
CREATE POLICY "Admins can view all points" ON public.point_transactions
  FOR SELECT USING (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'));

-- DONE! Semua policy admin sudah lengkap.
