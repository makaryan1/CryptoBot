import { useReferrals } from "@/hooks/use-referrals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function ReferralProgram() {
  const { 
    referralLevel, 
    referralCount, 
    activeReferrals, 
    totalEarnings, 
    referralLink,
    isLoading 
  } = useReferrals();
  const { toast } = useToast();
  
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Referral link copied",
      description: "Your referral link has been copied to clipboard",
    });
  };
  
  const getReferralLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'gold': return 'yellow';
      case 'silver': return 'gray';
      case 'bronze': return 'yellow';
      default: return 'blue';
    }
  };
  
  return (
    <section className="mb-8">
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <h2 className="font-bold">Referral Program</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Your Level */}
            <div className="bg-blue-50 rounded-md p-3">
              <h3 className="text-sm font-medium mb-2">Your Level</h3>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <div className="flex items-center space-x-2">
                  <div className={`w-10 h-10 rounded-md bg-${getReferralLevelColor(referralLevel)}-100 flex items-center justify-center text-${getReferralLevelColor(referralLevel)}-600`}>
                    <i className="ri-medal-line text-xl"></i>
                  </div>
                  <div>
                    <p className="font-medium">{referralLevel.charAt(0).toUpperCase() + referralLevel.slice(1)}</p>
                    <p className="text-xs text-neutral-400">
                      {referralLevel === 'bronze' 
                        ? '1% commission' 
                        : referralLevel === 'silver' 
                          ? '2% commission' 
                          : '5% commission'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Total Referrals */}
            <div className="bg-blue-50 rounded-md p-3">
              <h3 className="text-sm font-medium mb-2">Total Referrals</h3>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
                    <i className="ri-user-add-line text-xl"></i>
                  </div>
                  <div>
                    <p className="font-medium">{referralCount} users</p>
                    <p className="text-xs text-neutral-400">{activeReferrals} active</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Total Earnings */}
            <div className="bg-blue-50 rounded-md p-3">
              <h3 className="text-sm font-medium mb-2">Total Earnings</h3>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-md bg-green-100 flex items-center justify-center text-green-600">
                    <i className="ri-money-dollar-circle-line text-xl"></i>
                  </div>
                  <div>
                    <p className="font-medium">${totalEarnings.toFixed(2)}</p>
                    <p className="text-xs text-neutral-400">Lifetime earnings</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Your Referral Link</label>
            <div className="flex">
              <div className="flex-grow relative">
                <Input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="w-full p-2.5 border border-neutral-200 rounded-l-md bg-gray-50 text-neutral-400"
                />
              </div>
              <Button
                className="flex items-center justify-center p-2.5 bg-primary text-white rounded-r-md"
                onClick={copyReferralLink}
              >
                <i className="ri-file-copy-line"></i>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            {/* Bronze Level */}
            <div className="border border-neutral-200 rounded-md p-3">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-2">
                  <i className="ri-medal-line"></i>
                </div>
                <h3 className="font-medium">Bronze</h3>
              </div>
              <p className="text-sm mb-2">1% commission on referral's trading profits</p>
              <div className="flex items-center text-xs text-neutral-400">
                <i className="ri-information-line mr-1"></i>
                <span>0-5 active referrals</span>
              </div>
            </div>
            
            {/* Silver Level */}
            <div className="border border-neutral-200 rounded-md p-3">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-2">
                  <i className="ri-medal-line"></i>
                </div>
                <h3 className="font-medium">Silver</h3>
              </div>
              <p className="text-sm mb-2">2% commission on referral's trading profits</p>
              <div className="flex items-center text-xs text-neutral-400">
                <i className="ri-information-line mr-1"></i>
                <span>5-15 active referrals</span>
              </div>
            </div>
            
            {/* Gold Level */}
            <div className="border border-neutral-200 rounded-md p-3">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-2">
                  <i className="ri-medal-line"></i>
                </div>
                <h3 className="font-medium">Gold</h3>
              </div>
              <p className="text-sm mb-2">5% commission on referral's trading profits</p>
              <div className="flex items-center text-xs text-neutral-400">
                <i className="ri-information-line mr-1"></i>
                <span>15+ active referrals</span>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-neutral-400 italic">
            * Commissions are paid automatically when your referrals earn profit from trading bots
          </div>
        </div>
      </div>
    </section>
  );
}
