import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, registerSchema, LoginData, RegisterData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RiRobot2Line } from "react-icons/ri";

export default function AuthPage() {
  const [location, setLocation] = useLocation();
  const { user, loginMutation, registerMutation, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Get referral code from URL
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const referralCode = searchParams.get('ref');
  
  // Login form
  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // Register form
  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      referrerId: referralCode ? parseInt(referralCode) : undefined,
    },
  });
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);
  
  // Handle login form submission
  const onLoginSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };
  
  // Handle register form submission
  const onRegisterSubmit = (data: RegisterData) => {
    registerMutation.mutate(data);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:order-2 flex flex-col justify-center">
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mb-4">
                <RiRobot2Line className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold">CryptoBot Platform</CardTitle>
              <CardDescription>
                Login or create an account to start trading with our automated bots
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-between items-center">
                        <Button variant="link" className="px-0 text-sm" onClick={() => alert("Reset password functionality will be implemented")}>
                          Forgot password?
                        </Button>
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                        {loginMutation.isPending ? "Logging in..." : "Log in"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {referralCode && (
                        <div className="bg-blue-50 p-3 rounded-md">
                          <p className="text-sm text-blue-700">
                            You were invited by a friend! You'll both receive benefits.
                          </p>
                        </div>
                      )}
                      
                      <FormField
                        control={registerForm.control}
                        name="acceptTerms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                        {registerMutation.isPending ? "Creating account..." : "Create account"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-sm text-neutral-500">
                {activeTab === "login" ? (
                  <span>
                    Don't have an account?{" "}
                    <button 
                      className="text-primary hover:underline font-medium" 
                      onClick={() => setActiveTab("register")}
                    >
                      Register
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{" "}
                    <button 
                      className="text-primary hover:underline font-medium" 
                      onClick={() => setActiveTab("login")}
                    >
                      Log in
                    </button>
                  </span>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="hidden lg:flex lg:order-1 flex-col justify-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">
              Automated Crypto Trading
              <span className="ml-2 bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">Made Simple</span>
            </h1>
            <p className="text-lg text-gray-600">
              Join thousands of traders using our automated bots to maximize profits while minimizing risk. Our platform offers:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="mr-3 h-6 w-6 mt-0.5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-700">
                  <span className="font-medium">8 powerful trading bots</span> with different strategies
                </span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 h-6 w-6 mt-0.5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-700">
                  <span className="font-medium">Multi-currency support</span> with 20+ cryptocurrencies
                </span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 h-6 w-6 mt-0.5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-700">
                  <span className="font-medium">Secure KYC verification</span> for enhanced security
                </span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 h-6 w-6 mt-0.5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-700">
                  <span className="font-medium">Lucrative referral program</span> with up to 5% commission
                </span>
              </li>
            </ul>
            <div className="pt-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Trusted by over 10,000 traders worldwide</span>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center border-2 border-white">JD</div>
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center border-2 border-white">MS</div>
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center border-2 border-white">RK</div>
                  <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center border-2 border-white">AL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
