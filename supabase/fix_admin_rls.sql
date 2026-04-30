-- Admin SELECT on voucher_redemptions
CREATE POLICY "Admins can view all vouchers" ON public.voucher_redemptions
  FOR SELECT USING (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'));

-- Admin SELECT on orders
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'));

-- Admin UPDATE on orders (for status changes)  
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'));

-- Admin SELECT on order_items
CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT USING (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'));

-- Admin INSERT on point_transactions (for awarding points to others)
CREATE POLICY "Admins can insert points" ON public.point_transactions
  FOR INSERT WITH CHECK (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'));

-- Admin UPDATE on profiles (for updating total_points)
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'));
