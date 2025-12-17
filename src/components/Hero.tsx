import { Button } from "@/components/ui/button";
import { Phone, Star } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/4ec8a679-7f1a-42f0-ba74-b84a7abc8784.png"
          alt="Luxury car hero background"
          className="w-full h-full object-cover object-center"
        />
        
        {/* Enhanced overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>
        
        {/* Luxury accent gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,165,0,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,140,0,0.12),transparent_60%)]"></div>
        
        {/* Geometric luxury patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 border border-secondary/30 rotate-45 rounded-3xl"></div>
          <div className="absolute bottom-32 right-32 w-96 h-96 border border-secondary/20 rotate-12 rounded-full"></div>
        </div>
      </div>


      {/* Premium Content Container */}
      <div className="relative z-20 min-h-screen flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-4xl">
            {/* Luxury Brand Header with Better Contrast */}
            <div className="mb-6 sm:mb-8 animate-fade-in">
              <div className="flex items-center space-x-2 sm:space-x-4 mb-4 sm:mb-6">
                <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-secondary to-transparent"></div>
                <div className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-black/60 backdrop-blur-xl rounded-full border border-secondary/30 shadow-lg">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-3 h-3 sm:w-4 sm:h-4 fill-secondary text-secondary animate-pulse" style={{ animationDelay: `${star * 0.1}s` }} />
                  ))}
                  <span className="text-[10px] sm:text-xs font-luxury text-white tracking-wider sm:tracking-[0.3em] uppercase ml-1 sm:ml-2">
                    Premium Collection
                  </span>
                </div>
              </div>
            </div>

            {/* Monumental Typography with Premium Fonts */}
            <div className="mb-8 sm:mb-12 animate-fade-in">
              <h1 className="font-display mb-6 sm:mb-8">
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white text-shadow-luxury tracking-tight leading-[0.9] sm:leading-[0.85]">
                  LUXURY
                </span>
                <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif-elegant bg-gradient-to-r from-secondary via-orange-400 to-secondary bg-clip-text text-transparent text-shadow-glow tracking-wide mt-2">
                  REDEFINED
                </span>
              </h1>
              
              {/* Premium Description with Enhanced Typography */}
              <div className="max-w-2xl mt-6 sm:mt-10">
                <p className="text-white/95 text-base sm:text-xl md:text-2xl leading-relaxed font-luxury text-shadow-luxury mb-3 sm:mb-4">
                  Immerse yourself in unparalleled automotive excellence
                </p>
                <p className="text-secondary font-serif-elegant text-sm sm:text-lg md:text-xl text-shadow-glow italic">
                  Where every drive becomes a masterpiece
                </p>
              </div>
            </div>

            {/* Premium Call-to-Action with Enhanced Visibility */}
            <div className="mb-12 sm:mb-16 animate-fade-in">
              <a href="tel:+12345678900" className="group inline-block w-full sm:w-auto">
                <div className="relative overflow-hidden">
                  <Button 
                    size="lg"
                    className="relative w-full sm:w-auto bg-gradient-to-r from-secondary to-orange-500 hover:from-orange-500 hover:to-secondary text-black font-bold px-6 sm:px-12 py-4 sm:py-6 text-base sm:text-lg rounded-2xl shadow-2xl hover:shadow-secondary/50 transition-all duration-500 border-2 border-secondary/50 hover:border-secondary group-hover:scale-105 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="tracking-wide font-luxury text-base sm:text-lg">RESERVE NOW</span>
                      <span className="hidden sm:inline text-sm font-luxury opacity-90">+1 (234) 567-890</span>
                    </div>
                    
                    {/* Premium button effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-orange-500 rounded-2xl opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-500"></div>
                  </Button>
                </div>
              </a>
            </div>

            {/* Luxury Statistics with High Contrast */}
            <div className="animate-fade-in">
              <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl">
                <div className="group text-center">
                  <div className="mb-2 sm:mb-3 relative">
                    <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-shadow-luxury group-hover:scale-110 transition-transform duration-500">
                      15<span className="text-secondary font-serif-elegant">+</span>
                    </div>
                    <div className="absolute -inset-2 bg-secondary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"></div>
                  </div>
                  <div className="text-white/90 text-xs sm:text-sm font-luxury tracking-wider uppercase text-shadow-luxury">
                    Elite Vehicles
                  </div>
                </div>
                
                <div className="group text-center">
                  <div className="mb-2 sm:mb-3 relative">
                    <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-shadow-luxury group-hover:scale-110 transition-transform duration-500">
                      24<span className="text-secondary font-serif-elegant">/</span>7
                    </div>
                    <div className="absolute -inset-2 bg-secondary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"></div>
                  </div>
                  <div className="text-white/90 text-xs sm:text-sm font-luxury tracking-wider uppercase text-shadow-luxury">
                    Support
                  </div>
                </div>
                
                <div className="group text-center">
                  <div className="mb-2 sm:mb-3 relative">
                    <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-shadow-luxury group-hover:scale-110 transition-transform duration-500">
                      100<span className="text-secondary font-serif-elegant">%</span>
                    </div>
                    <div className="absolute -inset-2 bg-secondary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"></div>
                  </div>
                  <div className="text-white/90 text-xs sm:text-sm font-luxury tracking-wider uppercase text-shadow-luxury">
                    Excellence
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>


    </section>
  );
};

export default Hero;