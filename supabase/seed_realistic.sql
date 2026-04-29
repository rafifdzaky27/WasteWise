-- =============================================================
-- WasteWise Realistic Seed Data
-- Run this in Supabase SQL Editor after schema is applied
-- Generates: 60+ deposits, 30 days sensors, point transactions
-- =============================================================

-- ─── Seed Waste Deposits (60+ entries over 30 days) ─────────
-- Using the FIRST admin user as verifier and FIRST warga as depositor
-- Adjust the user IDs below if needed (run: SELECT id, role FROM profiles)

DO $$
DECLARE
  v_warga_ids UUID[];
  v_admin_id UUID;
  v_deposit_id UUID;
  v_weight NUMERIC;
  v_waste_type TEXT;
  v_points INT;
  v_day INT;
  v_i INT;
  v_qr TEXT;
  v_created TIMESTAMPTZ;
BEGIN
  -- Get warga user IDs
  SELECT ARRAY_AGG(id) INTO v_warga_ids FROM profiles WHERE role = 'warga' LIMIT 5;
  -- Get admin user ID
  SELECT id INTO v_admin_id FROM profiles WHERE role = 'admin' LIMIT 1;

  -- If no users found, raise notice and exit
  IF v_warga_ids IS NULL OR v_admin_id IS NULL THEN
    RAISE NOTICE 'No warga or admin users found. Please create users first.';
    RETURN;
  END IF;

  -- Generate 60+ deposits over the last 30 days
  FOR v_day IN 0..29 LOOP
    -- 2-3 deposits per day
    FOR v_i IN 1..2 + (random() * 1)::INT LOOP
      -- Random waste type
      IF random() > 0.4 THEN
        v_waste_type := 'organic';
      ELSE
        v_waste_type := 'recyclable';
      END IF;

      -- Random weight between 0.5 and 8 kg
      v_weight := round((random() * 7.5 + 0.5)::numeric, 1);

      -- Calculate points
      IF v_waste_type = 'organic' THEN
        v_points := round(v_weight * 10);
      ELSE
        v_points := round(v_weight * 15);
      END IF;

      v_qr := 'wastewise:deposit:' || gen_random_uuid()::text;
      v_created := NOW() - (v_day || ' days')::interval + ((random() * 12 + 6)::int || ' hours')::interval;

      -- Pick a random warga
      INSERT INTO waste_deposits (user_id, weight_kg, waste_type, qr_code, points_earned, verified_by, created_at)
      VALUES (
        v_warga_ids[1 + (random() * (array_length(v_warga_ids, 1) - 1))::int],
        v_weight,
        v_waste_type,
        v_qr,
        v_points,
        v_admin_id,  -- All seeded deposits are "verified"
        v_created
      )
      RETURNING id INTO v_deposit_id;

      -- Also create point transaction for this deposit
      INSERT INTO point_transactions (user_id, amount, type, reference_id, description, created_at)
      VALUES (
        v_warga_ids[1 + (random() * (array_length(v_warga_ids, 1) - 1))::int],
        v_points,
        'earned',
        v_deposit_id,
        'Setor ' || v_weight || ' kg sampah ' || CASE WHEN v_waste_type = 'organic' THEN 'organik' ELSE 'daur ulang' END,
        v_created
      );
    END LOOP;
  END LOOP;

  -- Update total_points for all warga users based on their transactions
  UPDATE profiles p
  SET total_points = COALESCE((
    SELECT SUM(amount) FROM point_transactions pt
    WHERE pt.user_id = p.id AND pt.type = 'earned'
  ), 0) - COALESCE((
    SELECT SUM(amount) FROM point_transactions pt
    WHERE pt.user_id = p.id AND pt.type = 'redeemed'
  ), 0)
  WHERE p.role = 'warga';

  RAISE NOTICE 'Seeded deposits and point transactions successfully!';
END $$;

-- ─── Seed 30 Days of Sensor Readings ───────────────────────
-- Uses the FIRST biobin_unit. Create one first if none exist.

DO $$
DECLARE
  v_biobin_id UUID;
  v_day INT;
  v_hour INT;
  v_temp NUMERIC;
  v_humid NUMERIC;
  v_methane NUMERIC;
  v_ammonia NUMERIC;
  v_recorded TIMESTAMPTZ;
  v_base_temp NUMERIC := 55;
BEGIN
  SELECT id INTO v_biobin_id FROM biobin_units LIMIT 1;

  -- Create a default biobin if none exists
  IF v_biobin_id IS NULL THEN
    INSERT INTO biobin_units (name, location, status)
    VALUES ('BioBin Utama', 'Kantor BUMDes Desa Sejahtera', 'active')
    RETURNING id INTO v_biobin_id;
    RAISE NOTICE 'Created default BioBin unit';
  END IF;

  -- Generate readings every 2 hours for 30 days = 360 readings
  FOR v_day IN 0..29 LOOP
    -- Simulate composting: temperature rises in first 2 weeks, then stabilizes
    v_base_temp := CASE
      WHEN v_day < 7 THEN 35 + v_day * 4            -- Mesophilic → Thermophilic
      WHEN v_day < 14 THEN 60 + (random() * 5)      -- Peak thermophilic
      WHEN v_day < 21 THEN 55 - (v_day - 14) * 2    -- Cooling
      ELSE 35 + (random() * 5)                       -- Maturation
    END;

    FOR v_hour IN 0..11 LOOP
      v_temp := round((v_base_temp + (random() * 4 - 2))::numeric, 1);
      v_humid := round((55 + (random() * 15))::numeric, 1);
      v_methane := round((CASE
        WHEN v_day < 7 THEN 50 + v_day * 15
        WHEN v_day < 14 THEN 150 + (random() * 30)
        WHEN v_day < 21 THEN 150 - (v_day - 14) * 15
        ELSE 30 + (random() * 20)
      END)::numeric, 1);
      v_ammonia := round((CASE
        WHEN v_day < 7 THEN 10 + v_day * 3
        WHEN v_day < 14 THEN 30 + (random() * 10)
        WHEN v_day < 21 THEN 30 - (v_day - 14) * 3
        ELSE 8 + (random() * 5)
      END)::numeric, 1);

      v_recorded := NOW() - (v_day || ' days')::interval + (v_hour * 2 || ' hours')::interval;

      INSERT INTO sensor_readings (biobin_id, temperature, humidity, methane_level, ammonia_level, recorded_at)
      VALUES (v_biobin_id, v_temp, v_humid, v_methane, v_ammonia, v_recorded);
    END LOOP;
  END LOOP;

  -- Update biobin last_reading_at
  UPDATE biobin_units SET last_reading_at = NOW() WHERE id = v_biobin_id;

  RAISE NOTICE 'Seeded 360 sensor readings over 30 days!';
END $$;

-- ─── Seed Impact Log (Daily aggregates) ─────────────────────
DO $$
DECLARE
  v_day INT;
  v_date DATE;
  v_total NUMERIC;
  v_compost NUMERIC;
  v_participants INT;
BEGIN
  FOR v_day IN 0..29 LOOP
    v_date := CURRENT_DATE - v_day;
    v_total := round((random() * 20 + 10)::numeric, 2);
    v_compost := round((v_total * 0.4)::numeric, 2);
    v_participants := (random() * 5 + 3)::INT;

    INSERT INTO impact_log (period_date, total_waste_collected_kg, total_compost_produced_kg, landfill_reduction_pct, active_participants)
    VALUES (v_date, v_total, v_compost, round((random() * 20 + 40)::numeric, 2), v_participants)
    ON CONFLICT (period_date) DO NOTHING;
  END LOOP;

  RAISE NOTICE 'Seeded 30 days of impact log data!';
END $$;
