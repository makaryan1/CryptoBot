import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import AccountSummary from "@/components/dashboard/account-summary";
import ActiveBots from "@/components/dashboard/active-bots";
import AvailableBots from "@/components/dashboard/available-bots";
import QuickDeposit from "@/components/dashboard/quick-deposit";
import KycVerification from "@/components/dashboard/kyc-verification";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import ReferralProgram from "@/components/dashboard/referral-program";
import { useI18n } from "@/hooks/use-i18n";

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  if (!user) return null;

  const welcomeMessage = t('dashboard.welcomeBack', { 
    name: user.fullName || user.email.split('@')[0] 
  });
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <Header 
          toggleSidebar={toggleSidebar} 
          title={t('sidebar.dashboard')} 
          subtitle={welcomeMessage} 
        />
        
        <AccountSummary />
        <ActiveBots />
        <AvailableBots />
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <QuickDeposit />
          <KycVerification />
        </section>
        
        <RecentTransactions />
        <ReferralProgram />
      </main>
    </div>
  );
}
