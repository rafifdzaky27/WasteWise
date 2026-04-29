-- ==========================================
-- Supabase Seeder Script for WasteWise
-- Run this in Supabase Dashboard -> SQL Editor
-- ==========================================

-- Pastikan pgcrypto terinstall (biasanya default di Supabase)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Insert Admin (Pradipta Muhtadin)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000', 
    gen_random_uuid(), 
    'authenticated', 
    'authenticated', 
    'pradipta@gmail.com', 
    crypt('admin123', gen_salt('bf')), 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"full_name":"Pradipta Muhtadin","role":"admin"}', 
    now(), 
    now()
);

-- 2. Insert Warga (Rafif Dzaky Daniswara)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000', 
    gen_random_uuid(), 
    'authenticated', 
    'authenticated', 
    'rafif@gmail.com', 
    crypt('warga123', gen_salt('bf')), 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"full_name":"Rafif Dzaky Daniswara","role":"warga"}', 
    now(), 
    now()
);

-- 3. Insert Petani (Sahal Fajri)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000', 
    gen_random_uuid(), 
    'authenticated', 
    'authenticated', 
    'sahal@gmail.com', 
    crypt('petani123', gen_salt('bf')), 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"full_name":"Sahal Fajri","role":"petani"}', 
    now(), 
    now()
);

-- Catatan:
-- Saat query ini dieksekusi, trigger "on_auth_user_created" yang kita buat 
-- di Phase 1 akan otomatis berjalan dan membuat baris yang sesuai 
-- di tabel "public.profiles" dengan mengambil role dari "raw_user_meta_data".
