import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";

interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price_per_day: number | null;
  description: string | null;
  features: string[] | null;
  transmission: string | null;
  fuel_type: string | null;
  seats: number | null;
  doors: number | null;
  available: boolean | null;
  created_at: string;
  updated_at: string;
}

interface CarImage {
  id: string;
  car_id: string;
  image_url: string;
  image_type: string;
  display_order: number | null;
  created_at: string;
}

const Fleet = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [carImages, setCarImages] = useState<CarImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const [carsResponse, imagesResponse] = await Promise.all([
        supabase.from('cars').select('*').eq('available', true),
        supabase.from('car_images').select('*')
      ]);

      if (carsResponse.error) {
        console.error('Error fetching cars:', carsResponse.error);
        throw carsResponse.error;
      }
      if (imagesResponse.error) {
        console.error('Error fetching images:', imagesResponse.error);
        throw imagesResponse.error;
      }

      if (carsResponse.data) {
        setCars(carsResponse.data);
      }
      if (imagesResponse.data) {
        setCarImages(imagesResponse.data);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
      // Set empty arrays on error to show empty state
      setCars([]);
      setCarImages([]);
    } finally {
      setLoading(false);
    }
  };

  const getCarImages = (carId: string): string[] => {
    const images = carImages
      .filter(img => img.car_id === carId)
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      .map(img => img.image_url);
    
    return images.length > 0 ? images : ['/placeholder.svg'];
  };

  if (loading) {
    return (
      <section id="fleet" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-xl text-muted-foreground">Loading our premium fleet...</p>
          </div>
        </div>
      </section>
    );
  }

  if (cars.length === 0) {
    return (
      <section id="fleet" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Badge className="bg-gradient-secondary text-white mb-4">Our Premium Fleet</Badge>
            <h2 className="font-display text-4xl md:text-6xl text-primary mb-6">
              Curated Excellence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our fleet is being updated. Please check back soon for our premium vehicles.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="fleet" className="py-12 sm:py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <Badge className="bg-gradient-secondary text-white mb-3 sm:mb-4 text-xs sm:text-sm">Our Premium Fleet</Badge>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary mb-4 sm:mb-6 px-4">
            Curated Excellence
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            From executive SUVs to exotic sports cars, our meticulously maintained fleet 
            offers the perfect vehicle for every occasion and preference.
          </p>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {cars.map((car) => (
            <Link key={car.id} to={`/car/${car.id}`}>
              <Card className="group hover:shadow-luxury transition-luxury cursor-pointer overflow-hidden border-0 bg-white h-full">
                <div className="relative overflow-hidden">
                  <Carousel
                    opts={{ loop: true }}
                    plugins={[
                      Autoplay({
                        delay: 3000,
                      }),
                    ]}
                    className="w-full"
                  >
                    <CarouselContent>
                      {getCarImages(car.id).map((imageUrl, index) => (
                        <CarouselItem key={index}>
                          <img
                            src={imageUrl}
                            alt={`${car.brand} ${car.model} - Image ${index + 1}`}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-luxury"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                  <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-luxury pointer-events-none"></div>
                </div>
                
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-display text-xl sm:text-2xl text-primary mb-2">
                    {car.name}
                  </h3>
                  
                  {car.price_per_day && (
                    <p className="text-base sm:text-lg font-bold text-black">
                      ${car.price_per_day}/day
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8 sm:mt-12 md:mt-16">
          <div className="bg-white rounded-2xl shadow-elegant p-6 sm:p-8 max-w-2xl mx-auto">
            <h3 className="font-display text-2xl sm:text-3xl text-primary mb-3 sm:mb-4">
              Ready to Experience Luxury?
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-2">
              Our fleet specialists are standing by to help you select the perfect vehicle 
              for your needs. Call now for instant availability and pricing.
            </p>
            
            <a href="tel:+12345678900" className="flex items-center justify-center space-x-2 text-xl sm:text-2xl font-display text-secondary hover:text-secondary-dark transition-colors">
              <span>📞</span>
              <span>+1 (234) 567-890</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Fleet;