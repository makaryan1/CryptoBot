import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Settings } from "@shared/schema";

const commissionSchema = z.object({
  withdrawalFee: z.number().min(0).max(1),
  bronzeFee: z.number().min(0).max(1),
  silverFee: z.number().min(0).max(1),
  goldFee: z.number().min(0).max(1),
});

type CommissionFormValues = z.infer<typeof commissionSchema>;

export default function CommissionSettings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();
  
  // Fetch platform settings
  const { data: settings, isLoading: isSettingsLoading } = useQuery<Settings>({
    queryKey: ["/api/admin/settings"],
  });
  
  // Fetch platform profit stats
  const { data: profitStats, isLoading: isStatsLoading } = useQuery<{
    totalFees: number;
    withdrawalFees: number;
    botFees: number;
    referralFees: number;
  }>({
    queryKey: ["/api/admin/profits"],
  });
  
  const form = useForm<CommissionFormValues>({
    resolver: zodResolver(commissionSchema),
    defaultValues: {
      withdrawalFee: 0.2,
      bronzeFee: 0.01,
      silverFee: 0.02, 
      goldFee: 0.05,
    },
  });
  
  // Update form when settings are loaded
  React.useEffect(() => {
    if (settings) {
      form.reset({
        withdrawalFee: settings.withdrawalFee,
        bronzeFee: settings.bronzeFee,
        silverFee: settings.silverFee,
        goldFee: settings.goldFee,
      });
    }
  }, [settings, form]);
  
  // Update commission settings
  const updateCommissionMutation = useMutation({
    mutationFn: async (data: CommissionFormValues) => {
      const res = await apiRequest("POST", "/api/admin/settings/commissions", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "Settings updated",
        description: "Commission settings have been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update settings",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const onSubmit = (data: CommissionFormValues) => {
    updateCommissionMutation.mutate(data);
  };
  
  const isLoading = isSettingsLoading || isStatsLoading;
  
  // Helper to format percentages
  const formatPercent = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <Header 
          toggleSidebar={toggleSidebar} 
          title="Commission Settings" 
          subtitle="Manage fees and commissions" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-neutral-500">Total Platform Profit</h3>
                <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center text-green-600">
                  <i className="ri-money-dollar-circle-line"></i>
                </div>
              </div>
              {isLoading ? (
                <div className="h-8 flex items-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                  <p>Loading...</p>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">${profitStats?.totalFees.toFixed(2) || '0.00'}</div>
                  <div className="text-sm text-neutral-500">
                    Lifetime earnings from fees
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-neutral-500">Withdrawal Fees</h3>
                <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
                  <i className="ri-arrow-up-circle-line"></i>
                </div>
              </div>
              {isLoading ? (
                <div className="h-8 flex items-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                  <p>Loading...</p>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">${profitStats?.withdrawalFees.toFixed(2) || '0.00'}</div>
                  <div className="text-sm text-neutral-500">
                    From user withdrawals
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-neutral-500">Bot Profits</h3>
                <div className="w-8 h-8 rounded-md bg-purple-100 flex items-center justify-center text-purple-600">
                  <i className="ri-robot-line"></i>
                </div>
              </div>
              {isLoading ? (
                <div className="h-8 flex items-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                  <p>Loading...</p>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">${profitStats?.botFees.toFixed(2) || '0.00'}</div>
                  <div className="text-sm text-neutral-500">
                    From bot trading fees
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Commission Settings</CardTitle>
              <CardDescription>
                Configure platform fees and commission rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <p>Loading settings...</p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Withdrawal Fees</h3>
                      <FormField
                        control={form.control}
                        name="withdrawalFee"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between mb-2">
                              <FormLabel>Withdrawal Fee</FormLabel>
                              <span className="text-sm text-neutral-500">
                                Current: {formatPercent(settings?.withdrawalFee || 0.2)}
                              </span>
                            </div>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  min="0" 
                                  max="1" 
                                  className="pr-10" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <span className="text-neutral-500">%</span>
                                </div>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Fee applied to all user withdrawals (0-100%)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Referral Commission Rates</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="bronzeFee"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between mb-2">
                                <FormLabel>Bronze Level</FormLabel>
                                <span className="text-sm text-neutral-500">
                                  Current: {formatPercent(settings?.bronzeFee || 0.01)}
                                </span>
                              </div>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type="number" 
                                    step="0.01"
                                    min="0" 
                                    max="1" 
                                    className="pr-10" 
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-neutral-500">%</span>
                                  </div>
                                </div>
                              </FormControl>
                              <FormDescription>
                                0-5 active referrals
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="silverFee"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between mb-2">
                                <FormLabel>Silver Level</FormLabel>
                                <span className="text-sm text-neutral-500">
                                  Current: {formatPercent(settings?.silverFee || 0.02)}
                                </span>
                              </div>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type="number" 
                                    step="0.01"
                                    min="0" 
                                    max="1" 
                                    className="pr-10" 
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-neutral-500">%</span>
                                  </div>
                                </div>
                              </FormControl>
                              <FormDescription>
                                5-15 active referrals
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="goldFee"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between mb-2">
                                <FormLabel>Gold Level</FormLabel>
                                <span className="text-sm text-neutral-500">
                                  Current: {formatPercent(settings?.goldFee || 0.05)}
                                </span>
                              </div>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type="number" 
                                    step="0.01"
                                    min="0" 
                                    max="1" 
                                    className="pr-10" 
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-neutral-500">%</span>
                                  </div>
                                </div>
                              </FormControl>
                              <FormDescription>
                                15+ active referrals
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={updateCommissionMutation.isPending}
                    >
                      {updateCommissionMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : "Save Commission Settings"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
