import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (href: string) => {
    // If we're not on the home page, navigate there first
    if (window.location.pathname !== '/') {
      navigate('/');
      // Wait for navigation and then scroll
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  type NavItem = {
    name: string;
    href: string;
    isRoute?: boolean;
  };

  const handleNavClick = (item: NavItem) => {
    if (item.isRoute) {
      navigate(item.href);
    } else {
      scrollToSection(item.href);
    }
    setIsMenuOpen(false);
  };

  const navItems: NavItem[] = [
    { name: "Home", href: "#home" },
    { name: "Fleet", href: "#fleet" },
    { name: "Eligibility", href: "/eligibility", isRoute: true },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Home Button */}
          <button
            onClick={() => {
              navigate('/');
              setIsMenuOpen(false);
            }}
            className="flex items-center hover:opacity-80 transition-opacity"
            aria-label="Go to home"
          >
            <img 
              src="/images/df94e162-ecab-41d6-b1cf-a6c61bf636a1.png" 
              alt="DND Fleets Logo" 
              className="h-12 w-auto object-contain cursor-pointer"
              loading="eager"
              decoding="async"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className="text-foreground hover:text-secondary transition-smooth font-medium"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Call Button */}
          <a href="tel:+14436221457">
            <Button 
              variant="default"
              className="hidden md:flex items-center space-x-2 bg-gradient-secondary hover:shadow-glow transition-luxury btn-luxury-hover px-6"
            >
              <Phone className="w-4 h-4" />
              <span>+1 (443) 622 1457</span>
            </Button>
          </a>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <nav className="flex flex-col space-y-4 mt-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className="text-foreground hover:text-secondary transition-smooth font-medium"
                >
                  {item.name}
                </button>
              ))}
              <a href="tel:+14436221457">
                <Button 
                  variant="default"
                  className="flex items-center justify-center space-x-2 bg-gradient-secondary hover:shadow-glow transition-luxury btn-luxury-hover"
                >
                  <Phone className="w-4 h-4" />
                  <span>+1 (443) 622 1457</span>
                </Button>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;