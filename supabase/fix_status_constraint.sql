-- Update the check constraint on the 'status' column in the 'orders' table
-- to allow the new 'rejected' status.

-- 1. Drop the existing constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- 2. Add the updated constraint including 'rejected'
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'confirmed', 'shipped', 'completed', 'rejected'));
