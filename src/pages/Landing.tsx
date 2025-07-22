import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Trophy, Users, Zap, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-hackathon.jpg";

export default function Landing() {
  const features = [
    {
      icon: Trophy,
      title: "Track Your Journey",
      description: "Keep a record of all hackathons you've participated in with detailed information and outcomes."
    },
    {
      icon: Code,
      title: "Tech Stack Insights",
      description: "Monitor which technologies you've used and identify patterns in your project choices."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Track solo vs team projects and measure your collaboration experiences."
    },
    {
      icon: Zap,
      title: "Progress Analytics",
      description: "Visualize your hackathon success rate and improvement over time."
    }
  ];

  const stats = [
    { number: "1000+", label: "Developers" },
    { number: "500+", label: "Hackathons Tracked" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Available" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                Track Your{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Hackathon
                </span>{" "}
                Journey
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                The ultimate platform to organize, track, and analyze your hackathon participations. 
                Never lose track of your coding adventures again.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <Button asChild variant="hero" size="xl" className="text-lg px-8 py-4">
                <Link to="/auth">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="text-lg px-8 py-4">
                <Link to="#features">
                  Learn More
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 pt-8 animate-fade-in">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold">
              Why Choose{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                HackTracker
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built by developers, for developers. Track every line of code, every late night, 
              and every victory in your hackathon journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-elegant transition-all duration-300 hover:scale-105 animate-scale-in border-border/50 hover:border-primary/20">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 lg:py-32 bg-gradient-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="flex justify-center space-x-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-primary text-primary" />
              ))}
            </div>
            
            <blockquote className="text-2xl md:text-3xl font-medium text-foreground">
              "HackTracker transformed how I manage my hackathon portfolio. 
              I can finally see my growth as a developer and share my journey with confidence."
            </blockquote>
            
            <div className="space-y-2">
              <div className="font-semibold text-lg">Sarah Chen</div>
              <div className="text-muted-foreground">Full-Stack Developer & 20+ Hackathon Winner</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold">
              Ready to Level Up Your{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Hackathon Game?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of developers who are already tracking their success stories.
            </p>
            <Button asChild variant="hero" size="xl" className="text-lg px-12 py-6">
              <Link to="/auth">
                Start Your Journey Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 HackTracker. Built with ❤️ for the developer community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}