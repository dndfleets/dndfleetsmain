-- Create storage bucket for car images
INSERT INTO storage.buckets (id, name, public) VALUES ('car-images', 'car-images', true);

-- Create cars table
CREATE TABLE public.cars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price_per_day DECIMAL(10,2),
  description TEXT,
  features TEXT[],
  transmission TEXT,
  fuel_type TEXT,
  seats INTEGER,
  doors INTEGER,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create car_images table
CREATE TABLE public.car_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type TEXT NOT NULL CHECK (image_type IN ('main', 'feature', 'interior')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_images ENABLE ROW LEVEL SECURITY;

-- Create policies for cars (public read access)
CREATE POLICY "Cars are viewable by everyone" 
ON public.cars 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can insert cars" 
ON public.cars 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update cars" 
ON public.cars 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Only authenticated users can delete cars" 
ON public.cars 
FOR DELETE 
TO authenticated
USING (true);

-- Create policies for car_images (public read access)
CREATE POLICY "Car images are viewable by everyone" 
ON public.car_images 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can insert car images" 
ON public.car_images 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update car images" 
ON public.car_images 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Only authenticated users can delete car images" 
ON public.car_images 
FOR DELETE 
TO authenticated
USING (true);

-- Create storage policies for car images
CREATE POLICY "Car images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'car-images');

CREATE POLICY "Authenticated users can upload car images" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'car-images');

CREATE POLICY "Authenticated users can update car images" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'car-images');

CREATE POLICY "Authenticated users can delete car images" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'car-images');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_cars_updated_at
BEFORE UPDATE ON public.cars
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_cars_brand ON public.cars(brand);
CREATE INDEX idx_cars_available ON public.cars(available);
CREATE INDEX idx_car_images_car_id ON public.car_images(car_id);
CREATE INDEX idx_car_images_type ON public.car_images(image_type);
CREATE INDEX idx_car_images_display_order ON public.car_images(display_order);