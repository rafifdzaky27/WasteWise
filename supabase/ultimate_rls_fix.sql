-- ==========================================
-- THE ULTIMATE RLS FIX (NO MORE 500 ERRORS)
-- Run di Supabase Dashboard -> SQL Editor
-- ==========================================

-- 1. Kita buat sistem sinkronisasi otomatis.
-- Setiap kali kamu mengubah role di tabel profiles (lewat Table Editor),
-- fungsi ini akan otomatis meng-update metadata di tabel auth.users.
CREATE OR REPLACE FUNCTION public.sync_profile_to_auth()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    to_jsonb(NEW.role)
  )
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Pasang triggernya ke tabel profiles
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  AFTER UPDATE OF role ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.sync_profile_to_auth();

-- 3. [PENTING] Sinkronisasikan SEMUA user yang sudah ada saat ini!
-- Ini akan menyalin role dari public.profiles kembali ke auth.users
UPDATE auth.users u
SET raw_user_meta_data = jsonb_build_object('role', p.role, 'full_name', p.full_name)
FROM public.profiles p
WHERE u.id = p.id;

-- 4. KITA KEMBALIKAN RLS MENGGUNAKAN JWT (SANGAT CEPAT & ANTI RECURSION)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING ( ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin') );

DROP POLICY IF EXISTS "Admins can view all deposits" ON public.waste_deposits;
CREATE POLICY "Admins can view all deposits" ON public.waste_deposits
  FOR SELECT USING ( ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin') );

DROP POLICY IF EXISTS "Admins can update deposits" ON public.waste_deposits;
CREATE POLICY "Admins can update deposits" ON public.waste_deposits
  FOR UPDATE USING ( ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin') );

DROP POLICY IF EXISTS "Admins can update vouchers" ON public.voucher_redemptions;
CREATE POLICY "Admins can update vouchers" ON public.voucher_redemptions
  FOR UPDATE USING ( ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin') );

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING ( ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin') );

DROP POLICY IF EXISTS "Admins can manage impact log" ON public.impact_log;
CREATE POLICY "Admins can manage impact log" ON public.impact_log
  FOR ALL USING ( ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin') );

-- Hapus fungsi is_admin lama karena sudah tidak dipakai lagi
DROP FUNCTION IF EXISTS public.is_admin();
