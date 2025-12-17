-- Fix car upload by allowing anonymous inserts on DB tables and storage
-- 1) Update RLS on public tables
DROP POLICY IF EXISTS "Only authenticated users can insert cars" ON public.cars;
DROP POLICY IF EXISTS "Only authenticated users can update cars" ON public.cars;
DROP POLICY IF EXISTS "Only authenticated users can delete cars" ON public.cars;

CREATE POLICY "Anyone can insert cars"
ON public.cars
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update cars"
ON public.cars
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete cars"
ON public.cars
FOR DELETE
USING (true);

DROP POLICY IF EXISTS "Only authenticated users can insert car images" ON public.car_images;
DROP POLICY IF EXISTS "Only authenticated users can update car images" ON public.car_images;
DROP POLICY IF EXISTS "Only authenticated users can delete car images" ON public.car_images;

CREATE POLICY "Anyone can insert car images"
ON public.car_images
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update car images"
ON public.car_images
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete car images"
ON public.car_images
FOR DELETE
USING (true);

-- 2) Storage policies for uploads to 'car-images' bucket
DROP POLICY IF EXISTS "Public read car images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload car images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update car images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete car images" ON storage.objects;

CREATE POLICY "Public read car images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'car-images');

CREATE POLICY "Anyone can upload car images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'car-images');

CREATE POLICY "Anyone can update car images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'car-images');

CREATE POLICY "Anyone can delete car images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'car-images');