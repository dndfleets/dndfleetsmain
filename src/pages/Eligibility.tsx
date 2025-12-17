import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, User, CreditCard, FileText, CheckCircle } from "lucide-react";

const Eligibility = () => {
  const requirements = [
    {
      icon: User,
      title: "AGE REQUIREMENTS",
      content: "To rent a vehicle from Murci Luxury, you must be at least 21 years old. Some high-performance vehicles may have higher age requirements."
    },
    {
      icon: FileText,
      title: "DRIVER'S LICENSE", 
      content: "You must possess a valid driver's license that has been held for at least one year. International driver's licenses are accepted."
    },
    {
      icon: Shield,
      title: "INSURANCE",
      content: "Proof of full coverage auto insurance is required. We also offer additional insurance options to purchase for your peace of mind. Can Purchase Insurance through Elite Daily Counter Insurance at checkout see page for pricing."
    },
    {
      icon: CreditCard,
      title: "CREDIT CARD",
      content: "A major credit card in the renter's name is required for the security deposit and rental charges."
    },
    {
      icon: CheckCircle,
      title: "DRIVING RECORD",
      content: "We reserve the right to check your driving record. A clean driving record may be required for certain high-performance vehicles."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 bg-gradient-luxury bg-clip-text text-transparent">
              Eligibility Requirements
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Before you can experience our luxury fleet, please ensure you meet the following requirements for vehicle rental.
            </p>
          </div>

          {/* Requirements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {requirements.map((requirement, index) => {
              const IconComponent = requirement.icon;
              
              return (
                <Card key={index} className="card-luxury group hover:shadow-luxury transition-luxury border-luxury">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-3 bg-gradient-secondary rounded-full w-16 h-16 flex items-center justify-center group-hover:shadow-glow transition-luxury">
                      <IconComponent className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="font-display text-xl font-bold text-gradient-primary">
                      {requirement.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed text-center">
                      {requirement.content}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Info */}
          <Card className="mt-12 max-w-4xl mx-auto card-luxury border-luxury">
            <CardHeader className="text-center">
              <CardTitle className="font-display text-2xl font-bold text-gradient-primary">
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground leading-relaxed">
                All requirements must be met at the time of rental. Additional documentation may be required for certain vehicle categories. 
                We recommend contacting us in advance if you have any questions about eligibility or specific vehicle requirements.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Eligibility;