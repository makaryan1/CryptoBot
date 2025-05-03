import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

export function useReferrals() {
  const { user } = useAuth();
  
  // Fetch referral statistics
  const { data: referralStats, isLoading } = useQuery<{
    count: number;
    active: number;
    earnings: number;
  }>({
    queryKey: ["/api/referrals/stats"],
    enabled: !!user,
  });
  
  // Generate referral link
  const getReferralLink = (): string => {
    if (!user?.referralCode) return '';
    
    const baseUrl = window.location.origin;
    return `${baseUrl}/auth?ref=${user.referralCode}`;
  };
  
  return {
    referralLevel: user?.referralLevel || 'bronze',
    referralCount: referralStats?.count || 0,
    activeReferrals: referralStats?.active || 0,
    totalEarnings: referralStats?.earnings || 0,
    referralLink: getReferralLink(),
    isLoading
  };
}
