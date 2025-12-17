import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Phone } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-luxury">
      <div className="text-center text-white px-4">
        <div className="mb-8">
          <h1 className="font-display text-8xl md:text-9xl text-secondary mb-4">404</h1>
          <h2 className="font-display text-3xl md:text-4xl mb-4">Page Not Found</h2>
          <p className="text-xl text-luxury-platinum mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist. Let's get you back to our luxury fleet.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            className="bg-secondary hover:bg-secondary-dark transition-luxury btn-luxury-hover px-8 py-4 text-lg"
            onClick={() => window.location.href = '/'}
          >
            <Home className="w-5 h-5 mr-2" />
            Return Home
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            className="border-2 border-white/30 text-white hover:bg-white/10 transition-luxury px-8 py-4 text-lg"
            onClick={() => window.open('tel:+12345678900')}
          >
            <Phone className="w-5 h-5 mr-2" />
            Call Us
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
