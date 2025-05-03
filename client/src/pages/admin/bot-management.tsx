import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Bot, insertBotSchema } from "@shared/schema";

const botSchema = insertBotSchema.extend({
  enabled: z.boolean().default(true)
});

type BotFormValues = z.infer<typeof botSchema>;

export default function BotManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddBotOpen, setIsAddBotOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<Bot | null>(null);
  const { toast } = useToast();
  
  const form = useForm<BotFormValues>({
    resolver: zodResolver(botSchema),
    defaultValues: {
      name: "",
      description: "",
      profitRange: "",
      riskLevel: "",
      icon: "",
      enabled: true
    },
  });
  
  // Fetch all bots
  const { data: bots, isLoading: isBotsLoading } = useQuery<Bot[]>({
    queryKey: ["/api/admin/bots"],
  });
  
  // Add new bot
  const addBotMutation = useMutation({
    mutationFn: async (data: BotFormValues) => {
      const res = await apiRequest("POST", "/api/admin/bots", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bots"] });
      setIsAddBotOpen(false);
      form.reset();
      toast({
        title: "Bot added",
        description: "The trading bot has been successfully added.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add bot",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Update bot
  const updateBotMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: BotFormValues }) => {
      const res = await apiRequest("PATCH", `/api/admin/bots/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bots"] });
      setIsAddBotOpen(false);
      setEditingBot(null);
      form.reset();
      toast({
        title: "Bot updated",
        description: "The trading bot has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update bot",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Delete bot
  const deleteBotMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/bots/${id}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bots"] });
      toast({
        title: "Bot deleted",
        description: "The trading bot has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete bot",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Toggle bot enabled status
  const toggleBotMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: number; enabled: boolean }) => {
      const res = await apiRequest("PATCH", `/api/admin/bots/${id}/toggle`, { enabled });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bots"] });
      toast({
        title: "Bot status updated",
        description: "The bot status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update bot status",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const onSubmit = (data: BotFormValues) => {
    if (editingBot) {
      updateBotMutation.mutate({ id: editingBot.id, data });
    } else {
      addBotMutation.mutate(data);
    }
  };
  
  const handleEditBot = (bot: Bot) => {
    setEditingBot(bot);
    form.reset({
      name: bot.name,
      description: bot.description,
      profitRange: bot.profitRange,
      riskLevel: bot.riskLevel,
      icon: bot.icon,
      enabled: bot.enabled
    });
    setIsAddBotOpen(true);
  };
  
  const handleDeleteBot = (id: number) => {
    if (confirm("Are you sure you want to delete this bot? This action cannot be undone.")) {
      deleteBotMutation.mutate(id);
    }
  };
  
  const handleToggleBot = (id: number, enabled: boolean) => {
    toggleBotMutation.mutate({ id, enabled: !enabled });
  };
  
  const iconOptions = [
    { value: "ri-bitcoin-line", label: "Bitcoin" },
    { value: "ri-ethereum-line", label: "Ethereum" },
    { value: "ri-coin-line", label: "Coin" },
    { value: "ri-currency-line", label: "Currency" },
    { value: "ri-compass-3-line", label: "Compass" },
    { value: "ri-rocket-line", label: "Rocket" },
    { value: "ri-recycle-line", label: "Recycle" },
    { value: "ri-broadcast-line", label: "Broadcast" }
  ];
  
  const riskLevelOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "Medium-High", label: "Medium-High" },
    { value: "High", label: "High" },
    { value: "Very High", label: "Very High" }
  ];
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <Header 
          toggleSidebar={toggleSidebar} 
          title="Bot Management" 
          subtitle="Manage trading bots on the platform" 
        />
        
        <div className="mb-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Trading Bots</CardTitle>
                <CardDescription>Manage all available trading bots on the platform</CardDescription>
              </div>
              <Button onClick={() => {
                setEditingBot(null);
                form.reset({
                  name: "",
                  description: "",
                  profitRange: "",
                  riskLevel: "",
                  icon: "",
                  enabled: true
                });
                setIsAddBotOpen(true);
              }}>
                <i className="ri-add-line mr-2"></i>
                Add New Bot
              </Button>
            </CardHeader>
            <CardContent>
              {isBotsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <p>Loading bots...</p>
                </div>
              ) : !bots || bots.length === 0 ? (
                <div className="text-center py-10">
                  <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary mb-3">
                    <i className="ri-robot-line text-xl"></i>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Bots Found</h3>
                  <p className="text-neutral-400 mb-4">Start by adding your first trading bot</p>
                  <Button onClick={() => {
                    setEditingBot(null);
                    form.reset({
                      name: "",
                      description: "",
                      profitRange: "",
                      riskLevel: "",
                      icon: "",
                      enabled: true
                    });
                    setIsAddBotOpen(true);
                  }}>
                    <i className="ri-add-line mr-2"></i>
                    Add New Bot
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Profit Range</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bots.map((bot) => (
                        <TableRow key={bot.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center text-primary mr-2`}>
                                <i className={bot.icon}></i>
                              </div>
                              {bot.name}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{bot.description}</TableCell>
                          <TableCell>{bot.profitRange}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              bot.riskLevel === 'High' || bot.riskLevel === 'Very High' 
                                ? 'bg-red-100 text-red-800' 
                                : bot.riskLevel === 'Medium-High' || bot.riskLevel === 'Medium' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-green-100 text-green-800'
                            }`}>
                              {bot.riskLevel}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Switch 
                              checked={bot.enabled} 
                              onCheckedChange={() => handleToggleBot(bot.id, bot.enabled)}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleEditBot(bot)}>
                              <i className="ri-edit-line mr-1"></i>
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteBot(bot.id)}>
                              <i className="ri-delete-bin-line mr-1"></i>
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Dialog open={isAddBotOpen} onOpenChange={setIsAddBotOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{editingBot ? "Edit Trading Bot" : "Add New Trading Bot"}</DialogTitle>
              <DialogDescription>
                {editingBot 
                  ? "Update the details of the selected trading bot" 
                  : "Create a new trading bot for users to utilize"
                }
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bot Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. BTC/USDT Scalper" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description of the bot's trading strategy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="profitRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profit Range</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 8-15% monthly" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="riskLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risk Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select risk level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {riskLevelOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an icon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {iconOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center">
                                <i className={`${option.value} mr-2`}></i>
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Enabled</FormLabel>
                        <FormDescription>
                          Whether this bot is available for users
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddBotOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={addBotMutation.isPending || updateBotMutation.isPending}
                  >
                    {(addBotMutation.isPending || updateBotMutation.isPending) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingBot ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      <>{editingBot ? "Update Bot" : "Add Bot"}</>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
