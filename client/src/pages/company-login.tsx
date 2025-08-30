import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Building, Eye, EyeOff, ArrowLeft, Monitor } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companyLoginSchema, type CompanyLoginData } from "@shared/models";
import { useIsMobile } from "@/hooks/use-mobile";

export default function CompanyLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const form = useForm<CompanyLoginData>({
    resolver: zodResolver(companyLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      companyCode: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: CompanyLoginData) => {
      return await apiRequest("POST", "/api/auth/company/login", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Login successful! Redirecting...",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials or company code. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (isMobile) {
      toast({
        title: "Desktop Required",
        description: "Company login is only available on desktop/web browsers.",
        variant: "destructive",
      });
    }
  }, [isMobile, toast]);

  const onSubmit = (data: CompanyLoginData) => {
    if (isMobile) {
      toast({
        title: "Desktop Required",
        description: "Company login is only available on desktop/web browsers.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(data);
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Monitor className="mx-auto h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Desktop Required</h2>
            <p className="text-gray-600 mb-6">
              Company login is only available on desktop and web browsers. Please access this page from a computer.
            </p>
            <Link href="/">
              <Button className="w-full" data-testid="button-back-home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Building className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Company Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your company dashboard
          </p>
          <div className="mt-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-md text-sm inline-flex items-center">
            <Monitor className="mr-1 h-4 w-4" />
            Desktop/Web access only
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="email">Company Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="company@example.com"
                  className="mt-1"
                  {...form.register("email")}
                  data-testid="input-company-email"
                />
                {form.formState.errors.email && (
                  <p className="mt-1 text-sm text-destructive" data-testid="text-email-error">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="mt-1 relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="pr-10"
                    {...form.register("password")}
                    data-testid="input-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute inset-y-0 right-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {form.formState.errors.password && (
                  <p className="mt-1 text-sm text-destructive" data-testid="text-password-error">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="companyCode">Company Code</Label>
                <Input
                  id="companyCode"
                  type="text"
                  placeholder="Enter company verification code"
                  className="mt-1"
                  {...form.register("companyCode")}
                  data-testid="input-company-code"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Contact your administrator for the company code
                </p>
                {form.formState.errors.companyCode && (
                  <p className="mt-1 text-sm text-destructive" data-testid="text-company-code-error">
                    {form.formState.errors.companyCode.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm">Keep me signed in</Label>
                </div>
                <Button variant="link" className="px-0 text-sm" data-testid="link-reset-password">
                  Reset password?
                </Button>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loginMutation.isPending}
                data-testid="button-submit"
              >
                {loginMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  "Access Dashboard"
                )}
              </Button>

              <div className="text-center">
                <span className="text-sm text-gray-600">New company? </span>
                <Button variant="link" className="px-0 text-sm" data-testid="link-register">
                  Register here
                </Button>
              </div>
            </form>

            {/* Company Benefits */}
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Company Benefits</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Access to talent pool
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Advanced filtering tools
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Dedicated support
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <Link href="/">
            <Button variant="link" className="text-sm" data-testid="link-back-home">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
