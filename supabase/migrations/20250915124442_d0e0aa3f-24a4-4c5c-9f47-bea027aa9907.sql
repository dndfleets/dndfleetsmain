-- Update RLS policies to allow anonymous access for car uploads
-- This is a temporary fix until authentication is implemented

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Only authenticated users can insert cars" ON public.cars;
DROP POLICY IF EXISTS "Only authenticated users can update cars" ON public.cars;
DROP POLICY IF EXISTS "Only authenticated users can delete cars" ON public.cars;

DROP POLICY IF EXISTS "Only authenticated users can insert car images" ON public.car_images;
DROP POLICY IF EXISTS "Only authenticated users can update car images" ON public.car_images;
DROP POLICY IF EXISTS "Only authenticated users can delete car images" ON public.car_images;

-- Create new policies that allow anonymous access
-- Cars table policies
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

-- Car images table policies  
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

-- Add foreign key constraint between car_images and cars tables for data integrity
ALTER TABLE public.car_images 
ADD CONSTRAINT car_images_car_id_fkey 
FOREIGN KEY (car_id) 
REFERENCES public.cars(id) 
ON DELETE CASCADE;