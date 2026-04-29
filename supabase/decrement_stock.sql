-- Atomic stock decrement to prevent race conditions
-- Run this in Supabase SQL Editor
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id UUID, p_quantity INT)
RETURNS void AS $$
BEGIN
  UPDATE public.products
  SET stock_qty = stock_qty - p_quantity
  WHERE id = p_product_id AND stock_qty >= p_quantity;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Stok tidak mencukupi untuk produk %', p_product_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
