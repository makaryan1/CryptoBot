import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Kyc, User } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface KycWithUser extends Kyc {
  user: User;
  documentUrl: string;
}

const rejectSchema = z.object({
  reason: z.string().min(5, "Reason must be at least 5 characters"),
});

type RejectFormValues = z.infer<typeof rejectSchema>;

export default function KycManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKyc, setSelectedKyc] = useState<KycWithUser | null>(null);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<RejectFormValues>({
    resolver: zodResolver(rejectSchema),
    defaultValues: {
      reason: "",
    },
  });
  
  // Fetch KYC documents
  const { data: kycDocuments, isLoading: isKycLoading } = useQuery<KycWithUser[]>({
    queryKey: ["/api/admin/kyc"],
  });
  
  // Approve KYC
  const approveKycMutation = useMutation({
    mutationFn: async (kycId: number) => {
      const res = await apiRequest("POST", `/api/admin/kyc/${kycId}/approve`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/kyc"] });
      setIsViewOpen(false);
      toast({
        title: "KYC approved",
        description: "The KYC document has been approved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to approve KYC",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Reject KYC
  const rejectKycMutation = useMutation({
    mutationFn: async ({ kycId, reason }: { kycId: number; reason: string }) => {
      const res = await apiRequest("POST", `/api/admin/kyc/${kycId}/reject`, { reason });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/kyc"] });
      setIsRejectOpen(false);
      form.reset();
      toast({
        title: "KYC rejected",
        description: "The KYC document has been rejected.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to reject KYC",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredKyc = kycDocuments?.filter((kyc) => {
    // Filter by status first
    if (activeTab === "pending" && kyc.status !== "pending") return false;
    if (activeTab === "approved" && kyc.status !== "approved") return false;
    if (activeTab === "rejected" && kyc.status !== "rejected") return false;
    
    // Then filter by search query
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      kyc.user.email.toLowerCase().includes(query) ||
      (kyc.user.fullName && kyc.user.fullName.toLowerCase().includes(query)) ||
      kyc.documentType.toLowerCase().includes(query)
    );
  });
  
  const handleViewDocument = (kyc: KycWithUser) => {
    setSelectedKyc(kyc);
    setIsViewOpen(true);
  };
  
  const handleApproveKyc = () => {
    if (selectedKyc) {
      approveKycMutation.mutate(selectedKyc.id);
    }
  };
  
  const handleOpenReject = (kyc: KycWithUser) => {
    setSelectedKyc(kyc);
    setIsRejectOpen(true);
  };
  
  const onSubmitReject = (data: RejectFormValues) => {
    if (selectedKyc) {
      rejectKycMutation.mutate({ kycId: selectedKyc.id, reason: data.reason });
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
  
  const getDocumentTypeName = (type: string): string => {
    switch (type) {
      case 'id_document': return 'ID Document';
      case 'selfie': return 'Selfie with ID';
      case 'address_proof': return 'Proof of Address';
      case 'video_verification': return 'Video Verification';
      default: return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <Header 
          toggleSidebar={toggleSidebar} 
          title="KYC Management" 
          subtitle="Review and approve identity verifications" 
        />
        
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>KYC Verifications</CardTitle>
              <CardDescription>
                Manage user identity verification documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
                <div className="flex justify-between items-center mb-6">
                  <TabsList>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>
                  
                  <div className="relative w-64">
                    <Input
                      placeholder="Search users or documents..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="pr-10"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <i className="ri-search-line text-gray-400"></i>
                    </div>
                  </div>
                </div>
                
                <TabsContent value="pending">
                  {isKycLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                      <p>Loading KYC documents...</p>
                    </div>
                  ) : !filteredKyc || filteredKyc.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary mb-3">
                        <i className="ri-shield-check-line text-xl"></i>
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Pending Verifications</h3>
                      <p className="text-neutral-400 mb-4">
                        There are no pending KYC verifications to review
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Document Type</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredKyc.map((kyc) => (
                            <TableRow key={kyc.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{kyc.user.fullName || 'N/A'}</div>
                                  <div className="text-sm text-neutral-500">{kyc.user.email}</div>
                                </div>
                              </TableCell>
                              <TableCell>{getDocumentTypeName(kyc.documentType)}</TableCell>
                              <TableCell>Level {kyc.level}</TableCell>
                              <TableCell>{formatDate(kyc.createdAt)}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleViewDocument(kyc)}
                                  >
                                    <i className="ri-eye-line mr-1"></i>
                                    View
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleOpenReject(kyc)}
                                  >
                                    <i className="ri-close-line mr-1"></i>
                                    Reject
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="approved">
                  {isKycLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                      <p>Loading KYC documents...</p>
                    </div>
                  ) : !filteredKyc || filteredKyc.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-3">
                        <i className="ri-check-line text-xl"></i>
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Approved Verifications</h3>
                      <p className="text-neutral-400 mb-4">
                        There are no approved KYC verifications
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Document Type</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Approved Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredKyc.map((kyc) => (
                            <TableRow key={kyc.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{kyc.user.fullName || 'N/A'}</div>
                                  <div className="text-sm text-neutral-500">{kyc.user.email}</div>
                                </div>
                              </TableCell>
                              <TableCell>{getDocumentTypeName(kyc.documentType)}</TableCell>
                              <TableCell>Level {kyc.level}</TableCell>
                              <TableCell>{formatDate(kyc.updatedAt)}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleViewDocument(kyc)}
                                >
                                  <i className="ri-eye-line mr-1"></i>
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="rejected">
                  {isKycLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                      <p>Loading KYC documents...</p>
                    </div>
                  ) : !filteredKyc || filteredKyc.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-3">
                        <i className="ri-close-line text-xl"></i>
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Rejected Verifications</h3>
                      <p className="text-neutral-400 mb-4">
                        There are no rejected KYC verifications
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Document Type</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Rejected Date</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredKyc.map((kyc) => (
                            <TableRow key={kyc.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{kyc.user.fullName || 'N/A'}</div>
                                  <div className="text-sm text-neutral-500">{kyc.user.email}</div>
                                </div>
                              </TableCell>
                              <TableCell>{getDocumentTypeName(kyc.documentType)}</TableCell>
                              <TableCell>Level {kyc.level}</TableCell>
                              <TableCell>{formatDate(kyc.updatedAt)}</TableCell>
                              <TableCell className="max-w-xs truncate" title={kyc.rejectionReason}>
                                {kyc.rejectionReason}
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleViewDocument(kyc)}
                                >
                                  <i className="ri-eye-line mr-1"></i>
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* View Document Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>
                {selectedKyc && getDocumentTypeName(selectedKyc.documentType)}
              </DialogTitle>
              <DialogDescription>
                {selectedKyc && `Submitted by ${selectedKyc.user.email} for Level ${selectedKyc.level} verification`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="bg-gray-50 p-4 rounded-md">
              {selectedKyc?.documentType === 'video_verification' ? (
                <video 
                  src={selectedKyc.documentUrl} 
                  className="w-full" 
                  controls
                />
              ) : (
                <img 
                  src={selectedKyc?.documentUrl} 
                  alt={selectedKyc?.documentType} 
                  className="max-w-full max-h-96 mx-auto"
                />
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="text-sm font-medium mb-1">User Details</h4>
                <div className="text-sm">
                  <p><span className="text-neutral-500">Name:</span> {selectedKyc?.user.fullName || 'N/A'}</p>
                  <p><span className="text-neutral-500">Email:</span> {selectedKyc?.user.email}</p>
                  <p><span className="text-neutral-500">Country:</span> {selectedKyc?.user.country || 'N/A'}</p>
                  <p><span className="text-neutral-500">Date of Birth:</span> {selectedKyc?.user.dateOfBirth || 'N/A'}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Document Details</h4>
                <div className="text-sm">
                  <p><span className="text-neutral-500">Type:</span> {selectedKyc && getDocumentTypeName(selectedKyc.documentType)}</p>
                  <p><span className="text-neutral-500">Level:</span> {selectedKyc?.level}</p>
                  <p><span className="text-neutral-500">Status:</span> {selectedKyc?.status}</p>
                  <p><span className="text-neutral-500">Submitted:</span> {selectedKyc && formatDate(selectedKyc.createdAt)}</p>
                </div>
              </div>
            </div>
            
            {selectedKyc?.status === 'pending' && (
              <DialogFooter className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleOpenReject(selectedKyc)}
                >
                  <i className="ri-close-line mr-1"></i>
                  Reject
                </Button>
                <Button 
                  onClick={handleApproveKyc}
                  disabled={approveKycMutation.isPending}
                >
                  {approveKycMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <i className="ri-check-line mr-1"></i>
                      Approve
                    </>
                  )}
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Reject Document Dialog */}
        <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Reject Document</DialogTitle>
              <DialogDescription>
                Provide a reason for rejecting this document
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitReject)}>
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rejection Reason</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter reason for rejection..." 
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This reason will be shown to the user
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="mt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsRejectOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    variant="destructive"
                    disabled={rejectKycMutation.isPending}
                  >
                    {rejectKycMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Rejecting...
                      </>
                    ) : "Reject Document"}
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
