import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "./use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Kyc } from "@shared/schema";

interface KycStatus {
  level1: "not_started" | "pending" | "completed" | "rejected";
  level2: "not_started" | "pending" | "completed" | "rejected";
  level3: "not_started" | "pending" | "completed" | "rejected";
  addressVerified: boolean;
  videoVerified: boolean;
  rejectionReason?: string;
}

export function useKyc() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch KYC documents
  const { data: kycDocuments, isLoading: isKycLoading } = useQuery<Kyc[]>({
    queryKey: ["/api/kyc"],
    enabled: !!user,
  });
  
  // Calculate KYC progress percentage
  const calculateKycProgress = (): number => {
    if (!user) return 0;
    
    switch (user.kycLevel) {
      case 0: return 0;
      case 1: return 33;
      case 2: return 66;
      case 3: return 100;
      default: return 0;
    }
  };
  
  // Get current KYC status
  const getKycStatus = (): KycStatus => {
    if (!kycDocuments) {
      return {
        level1: "not_started",
        level2: "not_started",
        level3: "not_started",
        addressVerified: false,
        videoVerified: false
      };
    }
    
    // Find documents for each level
    const level1Docs = kycDocuments.filter(doc => doc.level === 1);
    const level2Docs = kycDocuments.filter(doc => doc.level === 2);
    const level3Docs = kycDocuments.filter(doc => doc.level === 3);
    
    // Check address verification
    const addressDoc = kycDocuments.find(doc => doc.documentType === 'address_proof');
    // Check video verification
    const videoDoc = kycDocuments.find(doc => doc.documentType === 'video_verification');
    
    // Get rejection reason if any
    const rejectedDoc = kycDocuments.find(doc => doc.status === 'rejected');
    
    return {
      level1: user?.kycLevel >= 1 
        ? "completed" 
        : level1Docs.length > 0 
          ? level1Docs.some(doc => doc.status === 'rejected') 
            ? "rejected" 
            : "pending" 
          : "not_started",
      
      level2: user?.kycLevel >= 2 
        ? "completed" 
        : level2Docs.length > 0 
          ? level2Docs.some(doc => doc.status === 'rejected') 
            ? "rejected" 
            : "pending" 
          : "not_started",
      
      level3: user?.kycLevel >= 3 
        ? "completed" 
        : level3Docs.length > 0 
          ? level3Docs.some(doc => doc.status === 'rejected') 
            ? "rejected" 
            : "pending" 
          : "not_started",
      
      addressVerified: !!addressDoc && addressDoc.status === 'approved',
      videoVerified: !!videoDoc && videoDoc.status === 'approved',
      rejectionReason: rejectedDoc?.rejectionReason
    };
  };
  
  // Upload KYC document
  const uploadDocumentMutation = useMutation({
    mutationFn: async ({ 
      documentType, 
      documentFile, 
      level 
    }: { 
      documentType: string; 
      documentFile: File; 
      level: number; 
    }) => {
      const formData = new FormData();
      formData.append('documentType', documentType);
      formData.append('documentFile', documentFile);
      formData.append('level', level.toString());
      
      const response = await fetch('/api/kyc/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/kyc'] });
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded and is pending verification.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  return {
    kycLevel: user?.kycLevel || 0,
    kycProgress: calculateKycProgress(),
    kycStatus: getKycStatus(),
    uploadDocument: uploadDocumentMutation.mutate,
    isLoading: isKycLoading || uploadDocumentMutation.isPending
  };
}
