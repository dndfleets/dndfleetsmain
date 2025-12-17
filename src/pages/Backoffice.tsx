import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import CarForm from "@/components/backoffice/CarForm";
import CarList from "@/components/backoffice/CarList";

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

interface CarImage {
  id: string;
  car_id: string;
  image_url: string;
  image_type: string;
  display_order: number;
}

const Backoffice = () => {
  const [activeTab, setActiveTab] = useState("cars");
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [editingImages, setEditingImages] = useState<CarImage[]>([]);

  const handleEdit = (car: Car, images: CarImage[]) => {
    setEditingCar(car);
    setEditingImages(images);
    setActiveTab("add-car");
  };

  const handleSuccess = () => {
    setEditingCar(null);
    setEditingImages([]);
    setActiveTab("cars");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Website
              </Link>
            </Button>
            <h1 className="font-display text-2xl font-bold">Car Rental Backoffice</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cars">Manage Cars</TabsTrigger>
            <TabsTrigger value="add-car">Add New Car</TabsTrigger>
          </TabsList>

          <TabsContent value="cars" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Car Fleet Management</CardTitle>
                <CardDescription>
                  View and manage your car inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CarList onEdit={handleEdit} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-car" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{editingCar ? "Edit Car" : "Add New Car"}</CardTitle>
                <CardDescription>
                  {editingCar ? "Update car details and images" : "Upload car details and images to your fleet"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CarForm 
                  onSuccess={handleSuccess} 
                  editCar={editingCar}
                  editImages={editingImages}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Backoffice;