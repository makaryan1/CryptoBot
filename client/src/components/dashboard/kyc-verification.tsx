import { Link } from "wouter";
import { useKyc } from "@/hooks/use-kyc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function KycVerification() {
  const { kycLevel, kycStatus, isLoading } = useKyc();
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-4 border-b border-neutral-200">
        <h2 className="font-bold">KYC Verification</h2>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Level 1 Verification</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              kycLevel >= 1 ? "bg-green-100 text-green-800" : 
              kycStatus.level1 === "pending" ? "bg-yellow-100 text-yellow-800" : 
              "bg-gray-100 text-gray-800"
            }`}>
              {kycLevel >= 1 ? "Completed" : 
               kycStatus.level1 === "pending" ? "Pending" : 
               "Not Started"}
            </span>
          </div>
          <p className="text-sm text-neutral-400 mt-1">Deposit limit: $10,000 / Withdrawal limit: $5,000</p>
        </div>
        
        <div className="mb-4 border-t border-neutral-200 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Level 2 Verification</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              kycLevel >= 2 ? "bg-green-100 text-green-800" : 
              kycStatus.level2 === "pending" ? "bg-yellow-100 text-yellow-800" : 
              "bg-gray-100 text-gray-800"
            }`}>
              {kycLevel >= 2 ? "Completed" : 
               kycStatus.level2 === "pending" ? "Pending" : 
               "Not Started"}
            </span>
          </div>
          <p className="text-sm text-neutral-400 mt-1">Deposit limit: $100,000 / Withdrawal limit: $50,000</p>
          
          {kycLevel < 2 && kycStatus.level2 !== "pending" && (
            <div className="mt-3">
              <div className="flex mb-2">
                <div className={`w-5 h-5 rounded-full ${kycStatus.addressVerified ? "bg-secondary text-white" : "bg-neutral-200 text-neutral-400"} flex items-center justify-center text-xs mr-2`}>
                  {kycStatus.addressVerified ? <i className="ri-check-line"></i> : 1}
                </div>
                <div className="text-sm">
                  <p>Submit proof of address</p>
                </div>
              </div>
              <div className="flex mb-2">
                <div className={`w-5 h-5 rounded-full ${kycStatus.videoVerified ? "bg-secondary text-white" : "bg-neutral-200 text-neutral-400"} flex items-center justify-center text-xs mr-2`}>
                  {kycStatus.videoVerified ? <i className="ri-check-line"></i> : 2}
                </div>
                <div className="text-sm">
                  <p>Record video verification</p>
                </div>
              </div>
            </div>
          )}
          
          {kycLevel < 2 && kycStatus.level2 !== "pending" && (
            <Link href="/kyc">
              <Button className="mt-4 w-full">
                Continue Verification
              </Button>
            </Link>
          )}
        </div>
        
        <div className="border-t border-neutral-200 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Level 3 Verification</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              kycLevel >= 3 ? "bg-green-100 text-green-800" : 
              kycStatus.level3 === "pending" ? "bg-yellow-100 text-yellow-800" : 
              "bg-gray-100 text-gray-800"
            }`}>
              {kycLevel >= 3 ? "Completed" : 
               kycStatus.level3 === "pending" ? "Pending" : 
               kycLevel < 2 ? "Locked" : "Not Started"}
            </span>
          </div>
          <p className="text-sm text-neutral-400 mt-1">Unlimited deposit and withdrawal</p>
        </div>
      </div>
    </div>
  );
}
