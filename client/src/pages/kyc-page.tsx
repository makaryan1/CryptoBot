import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useKyc } from "@/hooks/use-kyc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const basicKycSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  country: z.string().min(1, "Please select your country"),
  dateOfBirth: z.string().refine((val) => {
    const date = new Date(val);
    const now = new Date();
    const minAge = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
    return date <= minAge;
  }, "You must be at least 18 years old"),
  idDocument: z
    .any()
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "File size must be less than 5MB")
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
  selfieWithId: z
    .any()
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "File size must be less than 5MB")
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
});

const advancedKycSchema = z.object({
  addressProof: z
    .any()
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "File size must be less than 5MB")
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
  videoVerification: z
    .any()
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "File size must be less than 5MB")
    .refine(
      (files) => files?.[0]?.type === "video/mp4",
      "Only .mp4 format is supported"
    ),
});

type BasicKycFormValues = z.infer<typeof basicKycSchema>;
type AdvancedKycFormValues = z.infer<typeof advancedKycSchema>;

export default function KycPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { kycLevel, kycStatus, uploadDocument, isLoading } = useKyc();
  
  const basicForm = useForm<BasicKycFormValues>({
    resolver: zodResolver(basicKycSchema),
    defaultValues: {
      fullName: "",
      country: "",
      dateOfBirth: "",
    },
  });
  
  const advancedForm = useForm<AdvancedKycFormValues>({
    resolver: zodResolver(advancedKycSchema),
    defaultValues: {},
  });
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const onBasicSubmit = (data: BasicKycFormValues) => {
    // Upload ID document
    uploadDocument({
      documentType: "id_document",
      documentFile: data.idDocument[0],
      level: 1,
    });
    
    // Upload selfie with ID
    uploadDocument({
      documentType: "selfie",
      documentFile: data.selfieWithId[0],
      level: 1,
    });
  };
  
  const onAdvancedSubmit = (data: AdvancedKycFormValues) => {
    // Upload address proof
    uploadDocument({
      documentType: "address_proof",
      documentFile: data.addressProof[0],
      level: 2,
    });
    
    // Upload video verification
    uploadDocument({
      documentType: "video_verification",
      documentFile: data.videoVerification[0],
      level: 2,
    });
  };
  
  const countries = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany", 
    "France", "Japan", "Singapore", "South Korea", "Brazil", "Spain"
  ];
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <Header 
          toggleSidebar={toggleSidebar} 
          title="KYC Verification" 
          subtitle="Complete your verification to unlock full platform access" 
        />
        
        <div className="mb-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>
                Your current verification level: {kycLevel}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full ${
                        kycLevel >= 1 ? "bg-green-100 text-green-600" : "bg-neutral-200 text-neutral-400"
                      } flex items-center justify-center mr-2 text-sm font-medium`}>1</div>
                      <h3 className="font-medium">Basic Verification</h3>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      kycLevel >= 1 ? "bg-green-100 text-green-800" : 
                      kycStatus.level1 === "pending" ? "bg-yellow-100 text-yellow-800" : 
                      kycStatus.level1 === "rejected" ? "bg-red-100 text-red-800" : 
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {kycLevel >= 1 ? "Approved" : 
                       kycStatus.level1 === "pending" ? "Pending" : 
                       kycStatus.level1 === "rejected" ? "Rejected" : 
                       "Not Started"}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400">Limits: Deposit up to $10,000, withdraw up to $5,000</p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full ${
                        kycLevel >= 2 ? "bg-green-100 text-green-600" : "bg-neutral-200 text-neutral-400"
                      } flex items-center justify-center mr-2 text-sm font-medium`}>2</div>
                      <h3 className="font-medium">Advanced Verification</h3>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      kycLevel >= 2 ? "bg-green-100 text-green-800" : 
                      kycStatus.level2 === "pending" ? "bg-yellow-100 text-yellow-800" : 
                      kycStatus.level2 === "rejected" ? "bg-red-100 text-red-800" : 
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {kycLevel >= 2 ? "Approved" : 
                       kycStatus.level2 === "pending" ? "Pending" : 
                       kycStatus.level2 === "rejected" ? "Rejected" : 
                       "Not Started"}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400">Limits: Deposit up to $100,000, withdraw up to $50,000</p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full ${
                        kycLevel >= 3 ? "bg-green-100 text-green-600" : "bg-neutral-200 text-neutral-400"
                      } flex items-center justify-center mr-2 text-sm font-medium`}>3</div>
                      <h3 className="font-medium">Advanced+ Verification</h3>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      kycLevel >= 3 ? "bg-green-100 text-green-800" : 
                      kycStatus.level3 === "pending" ? "bg-yellow-100 text-yellow-800" : 
                      kycStatus.level3 === "rejected" ? "bg-red-100 text-red-800" : 
                      kycLevel < 2 ? "bg-gray-100 text-gray-800" : 
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {kycLevel >= 3 ? "Approved" : 
                       kycStatus.level3 === "pending" ? "Pending" : 
                       kycStatus.level3 === "rejected" ? "Rejected" : 
                       kycLevel < 2 ? "Locked" : 
                       "Not Started"}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400">Limits: Unlimited deposits and withdrawals</p>
                </div>
              </div>
              
              {kycStatus.rejectionReason && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Verification Rejected</AlertTitle>
                  <AlertDescription>
                    {kycStatus.rejectionReason}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          
          <Tabs defaultValue={kycLevel >= 1 ? "level2" : "level1"}>
            <TabsList className="mb-4">
              <TabsTrigger value="level1" disabled={kycLevel >= 1}>Level 1 Verification</TabsTrigger>
              <TabsTrigger value="level2" disabled={kycLevel < 1 || kycLevel >= 2}>Level 2 Verification</TabsTrigger>
            </TabsList>
            
            <TabsContent value="level1">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Verification (Level 1)</CardTitle>
                  <CardDescription>
                    Please provide your personal information and upload your identification documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {kycStatus.level1 === "pending" ? (
                    <Alert className="mb-4">
                      <AlertTitle>Verification in Progress</AlertTitle>
                      <AlertDescription>
                        Your Level 1 verification is currently being processed. This usually takes 1-2 business days.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Form {...basicForm}>
                      <form onSubmit={basicForm.handleSubmit(onBasicSubmit)} className="space-y-6">
                        <FormField
                          control={basicForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormDescription>
                                Enter your full name as it appears on your ID
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={basicForm.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country of Residence</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {countries.map((country) => (
                                    <SelectItem key={country} value={country}>
                                      {country}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={basicForm.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormDescription>
                                You must be at least 18 years old
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={basicForm.control}
                          name="idDocument"
                          render={({ field: { value, onChange, ...fieldProps } }) => (
                            <FormItem>
                              <FormLabel>ID Document</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => onChange(e.target.files)}
                                  {...fieldProps}
                                />
                              </FormControl>
                              <FormDescription>
                                Upload a photo of your passport, driver's license, or national ID card
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={basicForm.control}
                          name="selfieWithId"
                          render={({ field: { value, onChange, ...fieldProps } }) => (
                            <FormItem>
                              <FormLabel>Selfie with ID</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => onChange(e.target.files)}
                                  {...fieldProps}
                                />
                              </FormControl>
                              <FormDescription>
                                Upload a selfie of yourself holding your ID document
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? "Uploading..." : "Submit Level 1 Verification"}
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="level2">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Verification (Level 2)</CardTitle>
                  <CardDescription>
                    Upgrade your account to increase deposit and withdrawal limits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {kycLevel < 1 ? (
                    <Alert className="mb-4">
                      <AlertTitle>Level 1 Required</AlertTitle>
                      <AlertDescription>
                        You need to complete Level 1 verification before proceeding to Level 2.
                      </AlertDescription>
                    </Alert>
                  ) : kycStatus.level2 === "pending" ? (
                    <Alert className="mb-4">
                      <AlertTitle>Verification in Progress</AlertTitle>
                      <AlertDescription>
                        Your Level 2 verification is currently being processed. This usually takes 2-3 business days.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Form {...advancedForm}>
                      <form onSubmit={advancedForm.handleSubmit(onAdvancedSubmit)} className="space-y-6">
                        <FormField
                          control={advancedForm.control}
                          name="addressProof"
                          render={({ field: { value, onChange, ...fieldProps } }) => (
                            <FormItem>
                              <FormLabel>Proof of Address</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => onChange(e.target.files)}
                                  {...fieldProps}
                                />
                              </FormControl>
                              <FormDescription>
                                Upload a utility bill, bank statement, or official document showing your address (issued within the last 3 months)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={advancedForm.control}
                          name="videoVerification"
                          render={({ field: { value, onChange, ...fieldProps } }) => (
                            <FormItem>
                              <FormLabel>Video Verification</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="video/mp4"
                                  onChange={(e) => onChange(e.target.files)}
                                  {...fieldProps}
                                />
                              </FormControl>
                              <FormDescription>
                                Record a short video of yourself saying "I am [your full name] and I am verifying my CryptoBot account on [today's date]"
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? "Uploading..." : "Submit Level 2 Verification"}
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
