-- ==========================================
-- SQL Script untuk Memperbaiki RLS Admin
-- Run di Supabase Dashboard -> SQL Editor
-- ==========================================

-- 1. Buat fungsi kebal RLS (Security Definer) untuk mengecek admin
-- Fungsi ini akan membaca tabel profiles secara aman tanpa memicu infinite recursion.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Hapus policy yang bermasalah
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update own profile" ON public.profiles;

DROP POLICY IF EXISTS "Admins can view all deposits" ON public.waste_deposits;
DROP POLICY IF EXISTS "Admins can update deposits" ON public.waste_deposits;

DROP POLICY IF EXISTS "Admins can update vouchers" ON public.voucher_redemptions;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage impact log" ON public.impact_log;

-- 3. Buat ulang policy dengan menggunakan fungsi is_admin() yang aman
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING ( public.is_admin() );

CREATE POLICY "Admins can view all deposits" ON public.waste_deposits
  FOR SELECT USING ( public.is_admin() );

CREATE POLICY "Admins can update deposits" ON public.waste_deposits
  FOR UPDATE USING ( public.is_admin() );

CREATE POLICY "Admins can update vouchers" ON public.voucher_redemptions
  FOR UPDATE USING ( public.is_admin() );

CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING ( public.is_admin() );

CREATE POLICY "Admins can manage impact log" ON public.impact_log
  FOR ALL USING ( public.is_admin() );
