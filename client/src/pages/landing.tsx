import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, WandSparkles, ArrowRight } from "lucide-react";

export default function Landing() {
  const handleGetStarted = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen">
      {/* SplashScreen Section */}
      <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex items-center justify-center">
        <div className="text-center px-4">
          <div className="animate-pulse mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-xl">
              <WandSparkles className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-6xl font-bold text-white mb-4">Coding Guru</h1>
            <p className="text-xl text-white/90 mb-12">Craft apps, skips the code.</p>
          </div>
          
          <Button 
            onClick={handleGetStarted}
            className="bg-white text-primary hover:bg-gray-50 px-12 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            data-testid="button-get-started"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Features */}
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Welcome to Coding Guru
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Create stunning websites with the power of AI
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-foreground">Drag & Drop Interface</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-foreground">AI-Powered Code Generation</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-foreground">One-Click Deployment</span>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Card */}
            <Card className="w-full max-w-md mx-auto">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Get Started</h3>
                  <p className="text-muted-foreground">Sign in to start building amazing websites</p>
                </div>

                <Button 
                  onClick={handleGetStarted}
                  className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 font-semibold hover:opacity-90 transition-opacity"
                  data-testid="button-sign-in"
                >
                  Sign In to Continue
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>

                <div className="mt-6 flex items-center">
                  <div className="flex-1 border-t border-border"></div>
                  <span className="px-4 text-sm text-muted-foreground">secure authentication</span>
                  <div className="flex-1 border-t border-border"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
