import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Autoplay from "embla-carousel-autoplay";
import { Helmet } from "react-helmet-async";

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
  delivery_info: string | null;
}

interface CarImage {
  id: string;
  car_id: string;
  image_url: string;
  display_order: number | null;
}

const CarDetail = () => {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [carImages, setCarImages] = useState<CarImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      const [carResponse, imagesResponse] = await Promise.all([
        supabase.from('cars').select('*').eq('id', id).maybeSingle(),
        supabase.from('car_images').select('*').eq('car_id', id)
      ]);

      if (carResponse.data) {
        setCar(carResponse.data);
      }
      if (imagesResponse.data) {
        setCarImages(imagesResponse.data.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)));
      }
    } catch (error) {
      console.error('Error fetching car details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCarImages = (): string[] => {
    const images = carImages.map(img => img.image_url);
    return images.length > 0 ? images : ['/placeholder.svg'];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading car details...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-display text-primary mb-4">Car Not Found</h1>
            <Link to="/">
              <Button className="bg-gradient-primary text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const pageTitle = `Rent ${car.name} in Miami | ${car.brand} ${car.model} ${car.year} | DND Fleets`;
  const pageDescription = `Rent the luxurious ${car.brand} ${car.model} ${car.year} in Miami, FL. ${car.description?.slice(0, 100) || 'Premium luxury car rental with delivery. Book now for the ultimate Miami driving experience.'}`;
  const mainImage = getCarImages()[0];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${car.brand} ${car.model} ${car.year} Rental`,
    "description": pageDescription,
    "image": mainImage,
    "brand": {
      "@type": "Brand",
      "name": car.brand
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": car.price_per_day || 0,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": car.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "LocalBusiness",
        "name": "DND Fleets",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Miami",
          "addressRegion": "FL",
          "addressCountry": "US"
        },
        "telephone": "+1-234-567-890"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${car.brand} rental Miami, ${car.model} for rent, luxury car rental Miami, exotic car rental Miami FL, ${car.name} Miami, premium car hire Miami Beach`} />
        <link rel="canonical" href={`https://dndfleets.com/car/${car.id}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={mainImage} />
        <meta property="og:type" content="product" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={mainImage} />
        
        {/* Geo tags for Miami */}
        <meta name="geo.region" content="US-FL" />
        <meta name="geo.placename" content="Miami" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <Header />
      
      <main className="flex-1 py-12 bg-muted/30">
        <article className="container mx-auto px-4" itemScope itemType="https://schema.org/Product">
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Fleet
              </Button>
            </Link>
          </nav>

          {/* Hero Section with Images */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-display text-4xl md:text-5xl text-primary mb-2" itemProp="name">
                  Rent {car.name} in Miami
                </h1>
                <p className="text-xl text-muted-foreground" itemProp="brand">
                  {car.brand} {car.model} {car.year} | Luxury Car Rental Miami, FL
                </p>
              </div>
              <Badge className={car.available ? "bg-gradient-secondary text-white" : "bg-muted"}>
                {car.available ? 'Available Now' : 'Currently Reserved'}
              </Badge>
            </div>

            <div className="relative overflow-hidden rounded-2xl">
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
                  {getCarImages().map((imageUrl, index) => (
                    <CarouselItem key={index}>
                      <img
                        src={imageUrl}
                        alt={`${car.brand} ${car.model} - Image ${index + 1}`}
                        className="w-full h-96 md:h-[600px] object-cover"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>
          </header>

          {car.description && (
            <div className="mb-8">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-lg text-muted-foreground">{car.description}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content - Accordion */}
          <div className="mb-8">
            <Accordion type="multiple" className="w-full space-y-4">
              {/* Specifications */}
              <AccordionItem value="specifications" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <h3 className="font-display text-2xl text-primary">Specifications</h3>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                    <li><span className="font-medium text-foreground">Brand:</span> {car.brand}</li>
                    <li><span className="font-medium text-foreground">Model:</span> {car.model}</li>
                    <li><span className="font-medium text-foreground">Year:</span> {car.year}</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Features */}
              <AccordionItem value="features" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <h3 className="font-display text-2xl text-primary">Features</h3>
                </AccordionTrigger>
                <AccordionContent>
                  {car.features && car.features.length > 0 ? (
                    <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                      {car.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No features listed</p>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Pricing */}
              <AccordionItem value="pricing" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <h3 className="font-display text-2xl text-primary">Pricing</h3>
                </AccordionTrigger>
                <AccordionContent>
                  {car.price_per_day ? (
                    <div>
                      <p className="text-4xl font-bold text-secondary mb-4">
                        ${car.price_per_day}
                        <span className="text-lg font-normal text-muted-foreground">/day</span>
                      </p>
                      <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                        <li>Competitive daily rates</li>
                        <li>Discounts available for extended rentals</li>
                        <li>Contact us for weekly and monthly pricing</li>
                      </ul>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Contact us for pricing information</p>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Delivery */}
              <AccordionItem value="delivery" className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <h3 className="font-display text-2xl text-primary">Delivery</h3>
                </AccordionTrigger>
                <AccordionContent>
                  {car.delivery_info ? (
                    <div className="text-muted-foreground whitespace-pre-line">{car.delivery_info}</div>
                  ) : (
                    <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                      <li>Delivery options available</li>
                      <li>Contact us to discuss your specific delivery requirements</li>
                    </ul>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Contact CTA */}
          <div className="mt-12">
            <Card className="bg-gradient-primary text-white">
              <CardContent className="py-8 text-center">
                <h3 className="font-display text-3xl mb-4">Ready to Reserve This Vehicle?</h3>
                <p className="text-lg mb-6 opacity-90">
                  Contact our team to check availability and complete your reservation
                </p>
                <div className="flex items-center justify-center space-x-2 text-2xl font-display">
                  <span>📞</span>
                  <span>+1 (234) 567-890</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default CarDetail;
