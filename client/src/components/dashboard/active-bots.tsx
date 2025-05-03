import { Link } from "wouter";
import { useBots } from "@/hooks/use-bots";
import { useI18n } from "@/hooks/use-i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ActiveBots() {
  const { t } = useI18n();
  const { activeBots, stopBot, isLoading } = useBots();
  
  const handleStopBot = (botId: number) => {
    stopBot(botId);
  };
  
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{t('bots.activeBots')}</h2>
        <Link href="/bots" className="text-primary text-sm font-medium flex items-center hover:underline">
          {t('common.viewAll')}
          <i className="ri-arrow-right-line ml-1 text-xs"></i>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Skeleton className="w-10 h-10 rounded-md mr-3" />
                      <div>
                        <Skeleton className="h-5 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-neutral-400 mb-1">
                      <span>Initial Investment</span>
                      <span>Current Value</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  
                  <Skeleton className="h-24 w-full mb-3 rounded" />
                  
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : activeBots.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary mb-3">
                <i className="ri-robot-line text-xl"></i>
              </div>
              <h3 className="text-lg font-medium mb-2">No Active Bots</h3>
              <p className="text-neutral-400 mb-4">You haven't started any trading bots yet.</p>
              <Button>
                <i className="ri-robot-line mr-2"></i>
                Launch Your First Bot
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeBots.map((bot) => (
            <div key={bot.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-md bg-${bot.iconBg} flex items-center justify-center text-${bot.iconColor} mr-3`}>
                      <i className={bot.icon}></i>
                    </div>
                    <div>
                      <h3 className="font-medium">{bot.name}</h3>
                      <p className="text-xs text-neutral-400">
                        Running for {bot.runningTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
                      Active
                    </span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-neutral-400 mb-1">
                    <span>Initial Investment</span>
                    <span>Current Value</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>${bot.initialInvestment.toFixed(2)}</span>
                    <span className="text-secondary font-medium">${bot.currentValue.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="h-24 w-full bg-gray-50 mb-3 rounded overflow-hidden">
                  <div 
                    className="h-full w-full" 
                    style={{ 
                      backgroundImage: `url('data:image/svg+xml;base64,${bot.chartBase64}')`,
                      backgroundSize: '100% 100%'
                    }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium">
                    <span className="text-secondary">+{bot.profitPercentage.toFixed(2)}%</span> profit
                  </div>
                  <button 
                    className="text-neutral-400 hover:text-error text-sm font-medium"
                    onClick={() => handleStopBot(bot.id)}
                  >
                    Stop Bot
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
