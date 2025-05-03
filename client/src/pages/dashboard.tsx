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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, TrendingUp, Clock, BarChart3, Wallet, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";

// Создадим компонент для быстрых действий
const QuickActions = ({ t }: { t: (key: string, params?: Record<string, string | number>) => string }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
      <Button variant="outline" className="flex items-center justify-start h-16 gap-3 hover:bg-primary/5 border-2 border-dashed">
        <PlusCircle className="h-5 w-5 text-primary" />
        <div className="text-left">
          <div className="text-sm font-medium">{t('dashboard.depositFunds')}</div>
          <div className="text-xs text-muted-foreground">{t('dashboard.addToWallet')}</div>
        </div>
      </Button>
      <Button variant="outline" className="flex items-center justify-start h-16 gap-3 hover:bg-blue-500/5 border-2 border-dashed">
        <TrendingUp className="h-5 w-5 text-blue-500" />
        <div className="text-left">
          <div className="text-sm font-medium">{t('dashboard.startTrading')}</div>
          <div className="text-xs text-muted-foreground">{t('dashboard.launchBot')}</div>
        </div>
      </Button>
      <Button variant="outline" className="flex items-center justify-start h-16 gap-3 hover:bg-orange-500/5 border-2 border-dashed">
        <Shield className="h-5 w-5 text-orange-500" />
        <div className="text-left">
          <div className="text-sm font-medium">{t('dashboard.completeVerification')}</div>
          <div className="text-xs text-muted-foreground">{t('dashboard.unlockFeatures')}</div>
        </div>
      </Button>
    </div>
  );
};

// Компонент для отображения статистики производительности ботов
const BotPerformance = ({ t }: { t: (key: string, params?: Record<string, string | number>) => string }) => {
  return (
    <Card className="mb-6 overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-5">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t('dashboard.botPerformance')}
          </CardTitle>
          <Tabs defaultValue="daily" className="w-fit">
            <TabsList className="bg-white/20 border-0">
              <TabsTrigger value="daily" className="data-[state=active]:bg-white/30 text-white text-xs">
                {t('bots.daily')}
              </TabsTrigger>
              <TabsTrigger value="weekly" className="data-[state=active]:bg-white/30 text-white text-xs">
                {t('bots.weekly')}
              </TabsTrigger>
              <TabsTrigger value="monthly" className="data-[state=active]:bg-white/30 text-white text-xs">
                {t('bots.monthly')}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <span className="text-xs text-blue-500 dark:text-blue-400 mb-1">{t('bots.totalGain')}</span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">+6.8%</span>
          </div>
          <div className="flex flex-col p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <span className="text-xs text-green-500 dark:text-green-400 mb-1">{t('bots.profit')}</span>
            <span className="text-2xl font-bold text-green-600 dark:text-green-300">$1,240.50</span>
          </div>
          <div className="flex flex-col p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <span className="text-xs text-purple-500 dark:text-purple-400 mb-1">{t('bots.activeBots')}</span>
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-300">3</span>
          </div>
        </div>
        <div className="h-52 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="h-10 w-10 mx-auto opacity-20 mb-2" />
            <p>{t('dashboard.chartsComingSoon')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Компонент для добавления ключей API биржи
const ExchangeApiSetup = ({ t }: { t: (key: string, params?: Record<string, string | number>) => string }) => {
  return (
    <Card className="mb-6 border-2 border-dashed border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          {t('dashboard.connectExchange')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">{t('dashboard.connectExchangeDescription')}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          <Button variant="outline" size="sm" className="gap-1 border border-yellow-200">
            <img src="https://cryptologos.cc/logos/binance-coin-bnb-logo.svg?v=026" className="h-4 w-4" alt="Binance" />
            Binance
          </Button>
          <Button variant="outline" size="sm" className="gap-1 border border-yellow-200">
            <img src="https://cryptologos.cc/logos/huobi-token-ht-logo.svg?v=026" className="h-4 w-4" alt="Huobi" />
            Huobi
          </Button>
          <Button variant="outline" size="sm" className="gap-1 border border-yellow-200">
            <img src="https://cryptologos.cc/logos/kucoin-kcs-logo.svg?v=026" className="h-4 w-4" alt="KuCoin" />
            KuCoin
          </Button>
          <Button variant="outline" size="sm" className="gap-1 border border-yellow-200">
            Bybit
          </Button>
          <Button variant="outline" size="sm" className="gap-1 border border-yellow-200">
            OKX
          </Button>
        </div>
        <Button className="w-full bg-yellow-500 hover:bg-yellow-600">{t('dashboard.connectApi')}</Button>
      </CardContent>
    </Card>
  );
};

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
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <Header 
          toggleSidebar={toggleSidebar} 
          title={t('sidebar.dashboard')} 
          subtitle={welcomeMessage} 
        />
        
        <div className="space-y-4 pb-10">
          {/* Верхние карточки */}
          <AccountSummary />
          
          {/* Быстрые действия */}
          <QuickActions t={t} />
          
          {/* Соединение с биржей */}
          <ExchangeApiSetup t={t} />
          
          {/* График производительности ботов */}
          <BotPerformance t={t} />
          
          {/* Активные боты и доступные боты */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <ActiveBots />
              <section className="mt-6">
                <QuickDeposit />
              </section>
            </div>
            <div>
              <AvailableBots />
              <section className="mt-6">
                <KycVerification />
              </section>
            </div>
          </div>
          
          {/* Транзакции и реферальная программа */}
          <RecentTransactions />
          <ReferralProgram />
        </div>
      </main>
    </div>
  );
}
