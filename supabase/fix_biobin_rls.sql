-- Hapus policy yang mungkin sudah ada agar tidak bentrok
DROP POLICY IF EXISTS "Allow admin to insert biobin_units" ON biobin_units;
DROP POLICY IF EXISTS "Allow admin to update biobin_units" ON biobin_units;
DROP POLICY IF EXISTS "Allow admin to delete biobin_units" ON biobin_units;
DROP POLICY IF EXISTS "Allow everyone to read biobin_units" ON biobin_units;
DROP POLICY IF EXISTS "Allow anonymous to update biobin_units" ON biobin_units;
DROP POLICY IF EXISTS "Allow public to insert sensor readings" ON biobin_units;

-- Pastikan RLS aktif
ALTER TABLE biobin_units ENABLE ROW LEVEL SECURITY;

-- 1. Siapapun bisa melihat daftar BioBin (warga, admin, anonim)
CREATE POLICY "Allow everyone to read biobin_units" 
ON biobin_units FOR SELECT USING (true);

-- 2. HANYA ADMIN yang bisa menambah (INSERT) BioBin baru
CREATE POLICY "Allow admin to insert biobin_units" 
ON biobin_units FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND role = 'admin')
);

-- 3. Mengizinkan pembaruan (UPDATE) - Admin untuk edit status, Anonim untuk update 'last_reading_at' dari IoT
CREATE POLICY "Allow update biobin_units" 
ON biobin_units FOR UPDATE 
USING (true);

-- 4. HANYA ADMIN yang bisa menghapus (DELETE) BioBin
CREATE POLICY "Allow admin to delete biobin_units" 
ON biobin_units FOR DELETE 
TO authenticated 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND role = 'admin')
);
