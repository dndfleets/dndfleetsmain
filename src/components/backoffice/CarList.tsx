import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Eye, EyeOff } from "lucide-react";

interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price_per_day: number;
  description: string;
  features: string[];
  transmission: string;
  fuel_type: string;
  seats: number;
  doors: number;
  available: boolean;
  delivery_info: string;
  created_at: string;
}

interface CarImage {
  id: string;
  car_id: string;
  image_url: string;
  image_type: string;
  display_order: number;
}

interface CarListProps {
  onEdit?: (car: Car, images: CarImage[]) => void;
}

const CarList = ({ onEdit }: CarListProps) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [carImages, setCarImages] = useState<CarImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      // Fetch cars
      const { data: carsData, error: carsError } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (carsError) throw carsError;

      // Fetch car images
      const { data: imagesData, error: imagesError } = await supabase
        .from('car_images')
        .select('*')
        .order('display_order');

      if (imagesError) throw imagesError;

      setCars(carsData || []);
      setCarImages(imagesData || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cars",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAvailability = async (carId: string, currentAvailability: boolean) => {
    try {
      const { error } = await supabase
        .from('cars')
        .update({ available: !currentAvailability })
        .eq('id', carId);

      if (error) throw error;

      setCars(prev => prev.map(car => 
        car.id === carId ? { ...car, available: !currentAvailability } : car
      ));

      toast({
        title: "Success",
        description: `Car ${!currentAvailability ? 'enabled' : 'disabled'} successfully`,
      });
    } catch (error) {
      console.error('Error updating car:', error);
      toast({
        title: "Error",
        description: "Failed to update car status",
        variant: "destructive",
      });
    }
  };

  const deleteCar = async (carId: string) => {
    if (!confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete car images from storage
      const carImagesList = carImages.filter(img => img.car_id === carId);
      for (const image of carImagesList) {
        const fileName = image.image_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('car-images')
            .remove([fileName]);
        }
      }

      // Delete car (cascade will handle car_images table)
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId);

      if (error) throw error;

      setCars(prev => prev.filter(car => car.id !== carId));
      setCarImages(prev => prev.filter(img => img.car_id !== carId));

      toast({
        title: "Success", 
        description: "Car deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting car:', error);
      toast({
        title: "Error",
        description: "Failed to delete car",
        variant: "destructive",
      });
    }
  };

  const getCarMainImage = (carId: string) => {
    return carImages.find(img => img.car_id === carId && img.image_type === 'main')?.image_url;
  };

  const getCarImageCount = (carId: string) => {
    return carImages.filter(img => img.car_id === carId).length;
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading cars...</div>;
  }

  if (cars.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No cars found. Add your first car to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => {
        const mainImage = getCarMainImage(car.id);
        const imageCount = getCarImageCount(car.id);

        return (
          <Card key={car.id} className={`${!car.available ? 'opacity-60' : ''}`}>
            <CardHeader className="pb-2">
              {mainImage && (
                <img
                  src={mainImage}
                  alt={car.name}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
              )}
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{car.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {car.brand} {car.model} ({car.year})
                  </p>
                </div>
                <Badge variant={car.available ? "default" : "secondary"}>
                  {car.available ? "Available" : "Disabled"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="text-sm space-y-1">
                <p><strong>Price:</strong> ${car.price_per_day}/day</p>
                <p><strong>Seats:</strong> {car.seats} | <strong>Doors:</strong> {car.doors}</p>
                <p><strong>Transmission:</strong> {car.transmission}</p>
                <p><strong>Fuel:</strong> {car.fuel_type}</p>
                <p><strong>Images:</strong> {imageCount}</p>
              </div>

              {car.features && car.features.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {car.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {car.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{car.features.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const carImagesList = carImages.filter(img => img.car_id === car.id);
                    onEdit?.(car, carImagesList);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleAvailability(car.id, car.available)}
                >
                  {car.available ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteCar(car.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CarList;