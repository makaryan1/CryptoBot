import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useReferrals } from "@/hooks/use-referrals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface Referral {
  id: number;
  email: string;
  fullName: string | null;
  isActive: boolean;
  totalEarnings: number;
  joinedDate: string;
}

export default function ReferralsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { referralLevel, referralCount, activeReferrals, totalEarnings, referralLink, isLoading } = useReferrals();
  const { toast } = useToast();
  
  // Fetch referrals list
  const { data: referrals, isLoading: isReferralsLoading } = useQuery<Referral[]>({
    queryKey: ["/api/referrals"],
  });
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Referral link copied",
      description: "Your referral link has been copied to clipboard",
    });
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <Header 
          toggleSidebar={toggleSidebar} 
          title="Referral Program" 
          subtitle="Invite friends and earn rewards" 
        />
        
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Your Level */}
            <Card>
              <CardContent className="pt-6">
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
              </CardContent>
            </Card>
            
            {/* Total Referrals */}
            <Card>
              <CardContent className="pt-6">
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
              </CardContent>
            </Card>
            
            {/* Total Earnings */}
            <Card>
              <CardContent className="pt-6">
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
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Referral Link</CardTitle>
              <CardDescription>
                Share this link with friends to earn commission when they trade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex">
                <Input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="rounded-r-none"
                />
                <Button 
                  className="rounded-l-none"
                  onClick={copyReferralLink}
                >
                  <i className="ri-file-copy-line mr-2"></i>
                  Copy
                </Button>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Share via</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => window.open(`https://twitter.com/intent/tweet?text=Join%20me%20on%20CryptoBot%20and%20start%20automated%20crypto%20trading&url=${encodeURIComponent(referralLink)}`, '_blank')}>
                    <i className="ri-twitter-x-line mr-2"></i>
                    Twitter
                  </Button>
                  <Button variant="outline" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank')}>
                    <i className="ri-facebook-box-line mr-2"></i>
                    Facebook
                  </Button>
                  <Button variant="outline" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=Join%20me%20on%20CryptoBot%20and%20start%20automated%20crypto%20trading`, '_blank')}>
                    <i className="ri-telegram-line mr-2"></i>
                    Telegram
                  </Button>
                  <Button variant="outline" onClick={() => window.open(`mailto:?subject=Join%20CryptoBot%20Trading%20Platform&body=I've%20been%20using%20CryptoBot%20for%20automated%20crypto%20trading.%20Join%20me%20using%20this%20link:%20${encodeURIComponent(referralLink)}`, '_blank')}>
                    <i className="ri-mail-line mr-2"></i>
                    Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Referral Levels</CardTitle>
              <CardDescription>
                Earn more by referring more active traders
              </CardDescription>
            </CardHeader>
            <CardContent>
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
              
              <div className="text-xs text-neutral-400 italic mt-2">
                * Commissions are paid automatically when your referrals earn profit from trading bots
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Referrals</CardTitle>
              <CardDescription>
                List of all users you've referred to the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isReferralsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : !referrals || referrals.length === 0 ? (
                <div className="text-center py-10">
                  <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary mb-3">
                    <i className="ri-user-add-line text-xl"></i>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Referrals Yet</h3>
                  <p className="text-neutral-400 mb-4">Share your referral link to start earning rewards</p>
                  <Button onClick={copyReferralLink}>
                    <i className="ri-file-copy-line mr-2"></i>
                    Copy Referral Link
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined Date</TableHead>
                        <TableHead className="text-right">Earnings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referrals.map((referral) => (
                        <TableRow key={referral.id}>
                          <TableCell className="font-medium">
                            {referral.fullName || referral.email}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              referral.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {referral.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(referral.joinedDate)}</TableCell>
                          <TableCell className="text-right">${referral.totalEarnings.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
