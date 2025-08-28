import { Button } from "@/components/ui/button";
import { GraduationCap, Building, Shield, Smartphone, Handshake } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <GraduationCap className="text-primary text-2xl mr-2" />
                <span className="text-xl font-bold text-foreground">Oppliv</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#home" className="text-primary font-medium px-3 py-2 rounded-md text-sm">Home</a>
                <a href="#about" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm">About</a>
                <a href="#contact" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm">Contact</a>
              </div>
            </div>
            <div className="md:hidden">
              <button type="button" className="text-muted-foreground hover:text-foreground">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Connect Students &</span>
                  <span className="block text-primary xl:inline">Companies</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Join our platform to bridge the gap between talented students and innovative companies. Start your journey today.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link href="/student-login">
                      <Button 
                        size="lg" 
                        className="w-full flex items-center justify-center px-8 py-3 md:py-4 md:text-lg md:px-10"
                        data-testid="button-student-login"
                      >
                        <GraduationCap className="mr-2 h-5 w-5" />
                        Student Login
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link href="/company-login">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full flex items-center justify-center px-8 py-3 md:py-4 md:text-lg md:px-10 border-primary text-primary hover:bg-primary hover:text-white"
                        data-testid="button-company-login"
                      >
                        <Building className="mr-2 h-5 w-5" />
                        Company Login
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img 
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=800" 
            alt="Students collaborating on laptops"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Oppliv?
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg leading-6 font-medium text-gray-900">Secure Authentication</h3>
                <p className="mt-2 text-base text-gray-500">Multiple login options including Google OAuth and secure credential management.</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                  <Smartphone className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg leading-6 font-medium text-gray-900">Mobile Friendly</h3>
                <p className="mt-2 text-base text-gray-500">Responsive design that works perfectly on all devices for student access.</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                  <Handshake className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg leading-6 font-medium text-gray-900">Perfect Matching</h3>
                <p className="mt-2 text-base text-gray-500">Connect students with companies based on skills, interests, and opportunities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
