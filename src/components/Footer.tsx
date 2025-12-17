import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-luxury text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-16 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center">
                <span className="text-white font-display text-xl">DND</span>
              </div>
              <div>
                <h3 className="font-display text-3xl">DND Fleets</h3>
                <p className="text-luxury-platinum text-sm">Luxury Redefined</p>
              </div>
            </div>
            <p className="text-luxury-platinum leading-relaxed mb-6 max-w-md">
              Experience the pinnacle of automotive luxury with our curated collection 
              of premium vehicles. Every journey becomes extraordinary with DND Fleets.
            </p>
            <div className="flex items-center space-x-2 text-secondary text-xl font-display">
              <Phone className="w-5 h-5" />
              <span>+1 (234) 567-890</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-luxury text-xl mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Our Fleet", href: "#fleet" },
                { name: "Services", href: "#services" },
                { name: "Contact", href: "#contact" },
                { name: "About Us", href: "#about" }
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-luxury-platinum hover:text-secondary transition-smooth"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-luxury text-xl mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-luxury-platinum">24/7 Reservations</p>
                  <p className="text-white font-medium">+1 (234) 567-890</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-luxury-platinum">Email Support</p>
                  <p className="text-white font-medium">info@dndfleets.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-luxury-platinum">Service Area</p>
                  <p className="text-white font-medium">Nationwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-luxury-platinum text-sm">
              © 2024 DND Fleets. All rights reserved. Luxury vehicle rental services.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-luxury-platinum hover:text-secondary transition-smooth">
                Privacy Policy
              </a>
              <a href="#" className="text-luxury-platinum hover:text-secondary transition-smooth">
                Terms of Service
              </a>
              <a href="#" className="text-luxury-platinum hover:text-secondary transition-smooth">
                Insurance
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;