-- First, ensure the product-images bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing restricted upload policy if it exists (assuming it was named something specific, or just add a new one)
-- To be safe, we'll create a new policy that allows ANY authenticated user to upload.

-- Policy: Allow all authenticated users to upload files to 'product-images'
CREATE POLICY "Allow authenticated users to upload to product-images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'product-images' );

-- Ensure everyone can view the images (for public reading)
CREATE POLICY "Allow public viewing of product-images" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'product-images' );
