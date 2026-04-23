-- ==========================================
-- SQL Script untuk Menghapus User yang Error
-- Run di Supabase Dashboard -> SQL Editor
-- ==========================================

-- Hapus ketiga user yang bermasalah langsung dari tabel auth.users.
-- Karena ada "ON DELETE CASCADE" di tabel public.profiles, 
-- profil mereka juga akan otomatis terhapus tanpa error.

DELETE FROM auth.users 
WHERE email IN (
    'pradipta@gmail.com',
    'rafif@gmail.com',
    'sahal@gmail.com'
);
