import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image as ImageIcon } from "lucide-react";

const carSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  description: z.string().optional(),
  price_per_day: z.number().min(0, "Price must be positive"),
  transmission: z.string().optional(),
  fuel_type: z.string().optional(),
  seats: z.number().min(1).optional(),
  doors: z.number().min(1).optional(),
  features: z.string().optional(),
  delivery_info: z.string().optional(),
});

type CarFormData = z.infer<typeof carSchema>;

interface CarImage {
  id: string;
  car_id: string;
  image_url: string;
  image_type: string;
  display_order: number;
}

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
}

interface CarFormProps {
  onSuccess: () => void;
  editCar?: Car | null;
  editImages?: CarImage[];
}

const CarForm = ({ onSuccess, editCar, editImages }: CarFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Array<{ file: File; type: string; preview: string }>>([]);
  const { toast } = useToast();

  const form = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: editCar ? {
      name: editCar.name,
      brand: editCar.brand,
      model: editCar.model,
      year: editCar.year,
      description: editCar.description || "",
      price_per_day: editCar.price_per_day,
      transmission: editCar.transmission || "",
      fuel_type: editCar.fuel_type || "",
      seats: editCar.seats || 4,
      doors: editCar.doors || 4,
      features: editCar.features?.join(', ') || "",
      delivery_info: editCar.delivery_info || "",
    } : {
      name: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      description: "",
      price_per_day: 0,
      transmission: "",
      fuel_type: "",
      seats: 4,
      doors: 4,
      features: "",
      delivery_info: "",
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, imageType: string) => {
    const files = event.target.files;
    if (!files) return;

    // Check limits for feature images
    const currentFeatureImages = uploadedImages.filter(img => img.type === 'feature').length;
    const newFeatureImages = imageType === 'feature' ? Array.from(files).length : 0;
    
    if (imageType === 'feature' && currentFeatureImages + newFeatureImages > 10) {
      toast({
        title: "Too many images",
        description: `You can only upload up to 10 feature images. Currently have ${currentFeatureImages}.`,
        variant: "destructive",
      });
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        setUploadedImages(prev => [...prev, { file, type: imageType, preview }]);
      }
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadImageToStorage = async (file: File, carId: string, imageType: string, displayOrder: number) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${carId}/${imageType}_${displayOrder}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('car-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('car-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const onSubmit = async (data: CarFormData) => {
    setIsLoading(true);
    
    try {
      // Convert features string to array
      const features = data.features ? data.features.split(',').map(f => f.trim()) : [];
      
      const carPayload = {
        name: data.name,
        brand: data.brand,
        model: data.model,
        year: data.year,
        description: data.description || null,
        price_per_day: data.price_per_day,
        transmission: data.transmission || null,
        fuel_type: data.fuel_type || null,
        seats: data.seats || null,
        doors: data.doors || null,
        features,
        delivery_info: data.delivery_info || null,
      };

      let carData;
      
      if (editCar) {
        // Update existing car
        const { data: updatedCar, error: carError } = await supabase
          .from('cars')
          .update(carPayload)
          .eq('id', editCar.id)
          .select()
          .single();

        if (carError) throw carError;
        carData = updatedCar;
      } else {
        // Insert new car
        const { data: newCar, error: carError } = await supabase
          .from('cars')
          .insert(carPayload)
          .select()
          .single();

        if (carError) throw carError;
        carData = newCar;
      }

      // Upload new images and create image records
      for (let i = 0; i < uploadedImages.length; i++) {
        const { file, type } = uploadedImages[i];
        
        // Upload to storage
        const imageUrl = await uploadImageToStorage(file, carData.id, type, i + 1);
        
        // Insert image record
        const { error: imageError } = await supabase
          .from('car_images')
          .insert({
            car_id: carData.id,
            image_url: imageUrl,
            image_type: type,
            display_order: i + 1,
          });

        if (imageError) throw imageError;
      }

      toast({
        title: "Success",
        description: editCar ? "Car updated successfully!" : "Car added successfully!",
      });

      form.reset();
      setUploadedImages([]);
      onSuccess();
    } catch (error) {
      console.error('Error saving car:', error);
      toast({
        title: "Error",
        description: editCar ? "Failed to update car. Please try again." : "Failed to add car. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Car Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="e.g., Executive SUV"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              {...form.register("brand")}
              placeholder="e.g., BMW"
            />
            {form.formState.errors.brand && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.brand.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              {...form.register("model")}
              placeholder="e.g., X5"
            />
            {form.formState.errors.model && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.model.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              {...form.register("year", { valueAsNumber: true })}
            />
            {form.formState.errors.year && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.year.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="price_per_day">Price per Day ($)</Label>
            <Input
              id="price_per_day"
              type="number"
              step="0.01"
              {...form.register("price_per_day", { valueAsNumber: true })}
            />
            {form.formState.errors.price_per_day && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.price_per_day.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="transmission">Transmission</Label>
            <Input
              id="transmission"
              {...form.register("transmission")}
              placeholder="e.g., Automatic"
            />
          </div>

          <div>
            <Label htmlFor="fuel_type">Fuel Type</Label>
            <Input
              id="fuel_type"
              {...form.register("fuel_type")}
              placeholder="e.g., Gasoline"
            />
          </div>

          <div>
            <Label htmlFor="seats">Seats</Label>
            <Input
              id="seats"
              type="number"
              {...form.register("seats", { valueAsNumber: true })}
            />
          </div>

          <div>
            <Label htmlFor="doors">Doors</Label>
            <Input
              id="doors"
              type="number"
              {...form.register("doors", { valueAsNumber: true })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Description and Features */}
      <Card>
        <CardHeader>
          <CardTitle>Description & Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Describe the car..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="features">Features (comma-separated)</Label>
            <Textarea
              id="features"
              {...form.register("features")}
              placeholder="e.g., Leather Seats, GPS Navigation, Bluetooth"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="delivery_info">Delivery Information</Label>
            <Textarea
              id="delivery_info"
              {...form.register("delivery_info")}
              placeholder="e.g., Free delivery within 50 miles, $50 fee beyond that. Available 24/7."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['main', 'feature', 'interior'].map((type) => {
              const typeImages = uploadedImages.filter(img => img.type === type);
              const maxImages = type === 'feature' ? 10 : type === 'main' ? 3 : 5;
              
              return (
                <div key={type} className="space-y-2">
                  <Label htmlFor={`${type}-images`} className="capitalize flex justify-between">
                    <span>
                      {type} Images
                      {type === 'feature' && <span className="text-xs text-muted-foreground ml-1">(up to 10)</span>}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {typeImages.length}/{maxImages}
                    </span>
                  </Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                    <input
                      id={`${type}-images`}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, type)}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => document.getElementById(`${type}-images`)?.click()}
                      className="w-full"
                      disabled={typeImages.length >= maxImages}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {typeImages.length >= maxImages ? 'Limit reached' : `Upload ${type} images`}
                    </Button>
                    {type === 'feature' && typeImages.length === 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Upload multiple feature images to showcase your car
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Image Previews */}
          {uploadedImages.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Uploaded Images: {uploadedImages.length} total</h4>
              
              {/* Group images by type */}
              {['main', 'feature', 'interior'].map((type) => {
                const typeImages = uploadedImages.filter(img => img.type === type);
                if (typeImages.length === 0) return null;
                
                return (
                  <div key={type} className="space-y-2">
                    <h5 className="font-medium text-sm capitalize">{type} Images ({typeImages.length})</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {typeImages.map((image, index) => {
                        const globalIndex = uploadedImages.findIndex(img => img.preview === image.preview);
                        return (
                          <div key={globalIndex} className="relative">
                            <img
                              src={image.preview}
                              alt={`${type} ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={() => removeImage(globalIndex)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                              {index + 1}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (editCar ? "Updating Car..." : "Adding Car...") : (editCar ? "Update Car" : "Add Car")}
      </Button>
    </form>
  );
};

export default CarForm;