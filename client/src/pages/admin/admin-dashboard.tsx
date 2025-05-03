import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Settings } from "@shared/schema";

const notificationSchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      message: "",
    },
  });
  
  // Fetch platform settings
  const { data: settings, isLoading: isSettingsLoading } = useQuery<Settings>({
    queryKey: ["/api/admin/settings"],
  });
  
  // Fetch system stats
  const { data: stats, isLoading: isStatsLoading } = useQuery<{
    totalUsers: number;
    activeUsers: number;
    totalBots: number;
    activeBots: number;
    totalBalance: number;
    totalProfit: number;
  }>({
    queryKey: ["/api/admin/stats"],
  });
  
  // Fetch system logs
  const { data: logs, isLoading: isLogsLoading } = useQuery<{
    timestamp: string;
    level: string;
    message: string;
  }[]>({
    queryKey: ["/api/admin/logs"],
  });
  
  // Send global notification
  const sendNotificationMutation = useMutation({
    mutationFn: async (data: NotificationFormValues) => {
      const res = await apiRequest("POST", "/api/admin/notifications", data);
      return res.json();
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "Notification sent",
        description: "Your notification has been sent to all users.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send notification",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Toggle maintenance mode
  const toggleMaintenanceMutation = useMutation({
    mutationFn: async (value: boolean) => {
      const res = await apiRequest("POST", "/api/admin/settings/maintenance", { value });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "Settings updated",
        description: "Maintenance mode setting has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update setting",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Toggle bots enabled
  const toggleBotsEnabledMutation = useMutation({
    mutationFn: async (value: boolean) => {
      const res = await apiRequest("POST", "/api/admin/settings/bots-enabled", { value });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "Settings updated",
        description: "Bots enabled setting has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update setting",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const onSubmit = (data: NotificationFormValues) => {
    sendNotificationMutation.mutate(data);
  };
  
  const isLoading = isSettingsLoading || isStatsLoading || isLogsLoading;
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <Header 
          toggleSidebar={toggleSidebar} 
          title="Admin Dashboard" 
          subtitle="Manage your platform" 
        />
        
        <div className="mb-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <p>Loading dashboard data...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-neutral-500">Total Users</h3>
                      <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center text-primary">
                        <i className="ri-user-line"></i>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                    <div className="text-sm text-neutral-500">
                      {stats?.activeUsers || 0} active in last 24h
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-neutral-500">Active Bots</h3>
                      <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center text-green-600">
                        <i className="ri-robot-line"></i>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{stats?.activeBots || 0}</div>
                    <div className="text-sm text-neutral-500">
                      of {stats?.totalBots || 0} total bots
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-neutral-500">Total Balance</h3>
                      <div className="w-8 h-8 rounded-md bg-purple-100 flex items-center justify-center text-purple-600">
                        <i className="ri-wallet-3-line"></i>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">${stats?.totalBalance.toFixed(2) || '0.00'}</div>
                    <div className="text-sm text-neutral-500">
                      across all users
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-neutral-500">Platform Profit</h3>
                      <div className="w-8 h-8 rounded-md bg-yellow-100 flex items-center justify-center text-yellow-600">
                        <i className="ri-money-dollar-circle-line"></i>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">${stats?.totalProfit.toFixed(2) || '0.00'}</div>
                    <div className="text-sm text-neutral-500">
                      from fees and commissions
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Settings</CardTitle>
                    <CardDescription>Control global platform functionality</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2 border-b">
                        <div>
                          <Label htmlFor="maintenance" className="font-medium">Maintenance Mode</Label>
                          <p className="text-sm text-neutral-500">
                            Temporarily disable access to the platform
                          </p>
                        </div>
                        <Switch 
                          id="maintenance" 
                          checked={settings?.maintenanceMode}
                          onCheckedChange={(checked) => toggleMaintenanceMutation.mutate(checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b">
                        <div>
                          <Label htmlFor="bots" className="font-medium">Enable Trading Bots</Label>
                          <p className="text-sm text-neutral-500">
                            Allow users to launch and run bots
                          </p>
                        </div>
                        <Switch 
                          id="bots" 
                          checked={settings?.botsEnabled}
                          onCheckedChange={(checked) => toggleBotsEnabledMutation.mutate(checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Global Notification</CardTitle>
                    <CardDescription>Send a message to all users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notification Message</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter message to send to all users..." 
                                  className="min-h-24" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                This message will be displayed as a popup to all users
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={sendNotificationMutation.isPending}
                        >
                          {sendNotificationMutation.isPending ? "Sending..." : "Send Notification"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Logs</CardTitle>
                  <CardDescription>Recent activity and errors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left py-3 px-4 font-medium text-neutral-400">Timestamp</th>
                          <th className="text-left py-3 px-4 font-medium text-neutral-400">Level</th>
                          <th className="text-left py-3 px-4 font-medium text-neutral-400">Message</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs && logs.length > 0 ? (
                          logs.map((log, index) => (
                            <tr key={index} className="border-t border-neutral-200">
                              <td className="py-3 px-4 text-neutral-500">
                                {new Date(log.timestamp).toLocaleString()}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  log.level === 'error'
                                    ? 'bg-red-100 text-red-800'
                                    : log.level === 'warn'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {log.level.toUpperCase()}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono text-xs max-w-0 truncate" title={log.message}>
                                {log.message}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="py-6 text-center text-neutral-500">
                              No system logs available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
