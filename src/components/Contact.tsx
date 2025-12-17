import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-12 sm:py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <Badge className="bg-gradient-secondary text-white mb-3 sm:mb-4 text-xs sm:text-sm">Get In Touch</Badge>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary mb-4 sm:mb-6 px-4">
            Ready to Drive <span className="text-secondary">Luxury?</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Our luxury fleet specialists are available 24/7 to help you find the perfect vehicle. 
            Call now for instant pricing and availability.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8">
            {/* Main CTA */}
            <Card className="bg-gradient-luxury text-white border-0 shadow-luxury">
              <CardContent className="p-6 sm:p-8 text-center">
                <Phone className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 text-secondary" />
                <h3 className="font-display text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">
                  Call Now to Reserve
                </h3>
                <a href="tel:+12345678900" className="block text-xl sm:text-2xl md:text-3xl font-display text-secondary mb-4 sm:mb-6 hover:text-secondary-light transition-colors">
                  +1 (234) 567-890
                </a>
                <Button 
                  size="lg"
                  className="w-full sm:w-auto bg-secondary hover:bg-secondary-dark transition-luxury btn-luxury-hover px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
                  onClick={() => window.open('tel:+12345678900')}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Why Choose Us */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="font-display text-2xl sm:text-3xl text-primary mb-6 sm:mb-8 text-center lg:text-left">
              Why Choose DND Fleets?
            </h3>

            <div className="space-y-3 sm:space-y-4">
              {[
                {
                  title: "Exclusive Fleet",
                  description: "Carefully curated collection of the world's finest luxury vehicles"
                },
                {
                  title: "White Glove Service",
                  description: "Personalized attention to every detail of your rental experience"
                },
                {
                  title: "Instant Availability",
                  description: "Real-time fleet status with immediate booking confirmation"
                },
                {
                  title: "Flexible Terms",
                  description: "Hourly, daily, weekly, or monthly rentals to suit your needs"
                },
                {
                  title: "Premium Insurance",
                  description: "Comprehensive coverage included with every rental"
                },
                {
                  title: "Concierge Support",
                  description: "24/7 assistance for any request, anywhere, anytime"
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-secondary rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                    <span className="text-white font-bold text-xs sm:text-sm">✓</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-luxury text-base sm:text-lg text-primary mb-1">{item.title}</h4>
                    <p className="text-sm sm:text-base text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8 sm:mt-12 md:mt-16">
          <div className="bg-white rounded-2xl shadow-elegant p-6 sm:p-8 max-w-4xl mx-auto">
            <h3 className="font-display text-2xl sm:text-3xl text-primary mb-3 sm:mb-4">
              Don't Wait – Luxury Awaits
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-4 sm:mb-6 px-2">
              Our premium vehicles are in high demand. Secure your reservation now and experience 
              the difference that true luxury makes.
            </p>
            <Button 
              size="lg"
              className="w-full sm:w-auto bg-gradient-secondary hover:shadow-glow transition-luxury btn-luxury-hover px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg md:text-xl"
              onClick={() => window.open('tel:+12345678900')}
            >
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              <span className="hidden sm:inline">Call +1 (234) 567-890 Now</span>
              <span className="sm:hidden">Call Now</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;