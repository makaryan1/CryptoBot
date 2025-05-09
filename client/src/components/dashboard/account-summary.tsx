import { useWallet } from "@/hooks/use-wallet";
import { useKyc } from "@/hooks/use-kyc";
import { useBots } from "@/hooks/use-bots";
import { useI18n } from "@/hooks/use-i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountSummary() {
  const { t } = useI18n();
  const { totalBalance, totalProfit, percentChange, isLoading: walletLoading } = useWallet();
  const { kycLevel, kycProgress, isLoading: kycLoading } = useKyc();
  const { activeBots, isLoading: botsLoading } = useBots();
  
  const isLoading = walletLoading || kycLoading || botsLoading;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Balance */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">{t('dashboard.totalBalance')}</h3>
          {isLoading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            percentChange > 0 ? (
              <div className="text-xs font-medium text-white bg-secondary rounded-full px-2 py-0.5">
                +{percentChange.toFixed(1)}%
              </div>
            ) : (
              <div className="text-xs font-medium text-white bg-error rounded-full px-2 py-0.5">
                {percentChange.toFixed(1)}%
              </div>
            )
          )}
        </div>
        <div className="flex items-baseline space-x-1">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-5 w-16" />
            </>
          ) : (
            <>
              <span className="text-2xl font-bold">${totalBalance.toFixed(2)}</span>
              <span className={totalProfit >= 0 ? "text-secondary text-sm" : "text-error text-sm"}>
                {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}
              </span>
            </>
          )}
        </div>
      </div>
      
      {/* Active Bots */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">{t('dashboard.activeBots')}</h3>
          <i className="ri-robot-line text-primary"></i>
        </div>
        <div className="flex items-baseline space-x-1">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-5 w-32" />
            </>
          ) : (
            <>
              <span className="text-2xl font-bold">{activeBots.length}</span>
              <span className="text-neutral-500 dark:text-neutral-400 text-sm">{t('bots.of')} 8 {t('bots.availableOption').toLowerCase()}</span>
            </>
          )}
        </div>
      </div>
      
      {/* KYC Status */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">{t('sidebar.verification')}</h3>
          <i className="ri-shield-check-line text-primary"></i>
        </div>
        {isLoading ? (
          <>
            <Skeleton className="h-2.5 w-full mb-2" />
            <Skeleton className="h-5 w-32" />
          </>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <div className="w-full bg-neutral-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${kycProgress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{t('kyc.level')} {kycLevel}</span>
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              {kycLevel < 2 
                ? t('kyc.completeLevel2') 
                : t('kyc.accountVerified')}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
