-- Add new columns to orders table for delivery, payment, and proof tracking
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_method text DEFAULT 'pickup';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'cod';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_cost int4 DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_proof_url text DEFAULT '';
