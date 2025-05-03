import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { User } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface UserWithDetails extends User {
  activeBotsCount: number;
  totalBalance: number;
  lastLogin: string;
  ipAddress: string;
}

const notificationSchema = z.object({
  message: z.string().min(5, "Message must be at least 5 characters"),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

export default function UserManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      message: "",
    },
  });
  
  // Fetch all users
  const { data: users, isLoading: isUsersLoading } = useQuery<UserWithDetails[]>({
    queryKey: ["/api/admin/users"],
  });
  
  // Send personal notification
  const sendNotificationMutation = useMutation({
    mutationFn: async ({ userId, message }: { userId: number; message: string }) => {
      const res = await apiRequest("POST", `/api/admin/users/${userId}/notification`, { message });
      return res.json();
    },
    onSuccess: () => {
      setIsNotificationOpen(false);
      form.reset();
      toast({
        title: "Notification sent",
        description: "Your notification has been sent to the user.",
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
  
  // Toggle user block status
  const toggleBlockMutation = useMutation({
    mutationFn: async ({ userId, blocked }: { userId: number; blocked: boolean }) => {
      const res = await apiRequest("POST", `/api/admin/users/${userId}/block`, { blocked });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User status updated",
        description: `User has been ${selectedUser?.isAdmin ? "unblocked" : "blocked"}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update user status",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredUsers = users?.filter((user) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(query) ||
      (user.fullName && user.fullName.toLowerCase().includes(query)) ||
      user.id.toString().includes(query) ||
      (user.ipAddress && user.ipAddress.includes(query))
    );
  });
  
  const handleOpenNotification = (user: UserWithDetails) => {
    setSelectedUser(user);
    setIsNotificationOpen(true);
  };
  
  const handleBlockUser = (user: UserWithDetails) => {
    if (confirm(`Are you sure you want to ${user.isAdmin ? "unblock" : "block"} this user?`)) {
      setSelectedUser(user);
      toggleBlockMutation.mutate({ userId: user.id, blocked: !user.isAdmin });
    }
  };
  
  const onSubmitNotification = (data: NotificationFormValues) => {
    if (selectedUser) {
      sendNotificationMutation.mutate({ userId: selectedUser.id, message: data.message });
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <Header 
          toggleSidebar={toggleSidebar} 
          title="User Management" 
          subtitle="Manage platform users" 
        />
        
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                View and manage all users on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="search">Search Users</Label>
                <div className="relative">
                  <Input
                    id="search"
                    placeholder="Search by email, name, ID, or IP address..."
                    value={searchQuery}
                    onChange={handleUserSearch}
                    className="pr-10"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <i className="ri-search-line text-gray-400"></i>
                  </div>
                </div>
              </div>
              
              {isUsersLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <p>Loading users...</p>
                </div>
              ) : !filteredUsers || filteredUsers.length === 0 ? (
                <div className="text-center py-10">
                  <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary mb-3">
                    <i className="ri-user-search-line text-xl"></i>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Users Found</h3>
                  <p className="text-neutral-400 mb-4">
                    {searchQuery ? "Try a different search term" : "There are no users registered yet"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>KYC Level</TableHead>
                        <TableHead>Active Bots</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.fullName || 'N/A'}</div>
                              <div className="text-sm text-neutral-500">{user.email}</div>
                              <div className="text-xs text-neutral-400">ID: {user.id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.isAdmin ? "destructive" : "success"}>
                              {user.isAdmin ? "Blocked" : "Active"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              user.kycLevel === 0 ? "outline" : 
                              user.kycLevel === 1 ? "secondary" : 
                              user.kycLevel === 2 ? "default" : "success"
                            }>
                              Level {user.kycLevel}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.activeBotsCount}</TableCell>
                          <TableCell>${user.totalBalance.toFixed(2)}</TableCell>
                          <TableCell>{formatDate(user.lastLogin)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleOpenNotification(user)}
                              >
                                <i className="ri-notification-3-line mr-1"></i>
                                Notify
                              </Button>
                              <Button 
                                variant={user.isAdmin ? "default" : "destructive"}
                                size="sm"
                                onClick={() => handleBlockUser(user)}
                              >
                                <i className={`${user.isAdmin ? 'ri-lock-unlock-line' : 'ri-lock-line'} mr-1`}></i>
                                {user.isAdmin ? "Unblock" : "Block"}
                              </Button>
                            </div>
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
        
        <Dialog open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Send Notification</DialogTitle>
              <DialogDescription>
                Send a personal notification to {selectedUser?.email}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitNotification)}>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter notification message..." 
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This message will be displayed as a popup to the user
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="mt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsNotificationOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={sendNotificationMutation.isPending}
                  >
                    {sendNotificationMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : "Send Notification"}
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
