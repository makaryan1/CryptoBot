import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Tab } from "@headlessui/react";
import { useBots } from "@/hooks/use-bots";
import { Card, CardContent } from "@/components/ui/card";
import { T } from "@/lib/i18n";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot } from "@shared/schema";
import { BotCard } from "@/components/bots/bot-card";
import { ActiveBotCard } from "@/components/bots/active-bot-card";
import { Loader2 } from "lucide-react";

export default function BotsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { availableBots, activeBots, isLoading } = useBots();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Group bots by risk level for better organization
  const lowRiskBots = availableBots.filter(bot => 
    bot.riskLevel === "Very Low" || bot.riskLevel === "Low" || bot.riskLevel === "Medium-Low"
  );
  
  const mediumRiskBots = availableBots.filter(bot => 
    bot.riskLevel === "Medium" || bot.riskLevel === "Medium-High"
  );
  
  const highRiskBots = availableBots.filter(bot => 
    bot.riskLevel === "High" || bot.riskLevel === "Very High"
  );
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <Header 
          toggleSidebar={toggleSidebar} 
          title="Trading Bots" 
          subtitle="Manage your automated trading bots" 
        />
        
        <div className="mb-8 mt-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <TabsList className="mb-4 sm:mb-0">
                <TabsTrigger value="all"><T keyName="bots.allBots" /></TabsTrigger>
                <TabsTrigger value="active"><T keyName="bots.activeBots" /></TabsTrigger>
                <TabsTrigger value="risk"><T keyName="bots.byRiskLevel" /></TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <div className="text-sm text-neutral-500 mr-2">
                  <span className="font-medium text-foreground">{availableBots.length}</span> <T keyName="bots.botsAvailable" />
                </div>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                <p><T keyName="common.loading" /></p>
              </div>
            ) : (
              <>
                <TabsContent value="all" className="space-y-6">
                  {activeBots.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        <T keyName="bots.yourActiveBots" />
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeBots.map((bot) => (
                          <ActiveBotCard key={bot.id} bot={bot} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      <T keyName="bots.availableBots" />
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableBots.map((bot) => (
                        <BotCard key={bot.id} bot={bot} />
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="active">
                  {activeBots.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeBots.map((bot) => (
                        <ActiveBotCard key={bot.id} bot={bot} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                          <i className="ri-robot-line text-4xl text-muted-foreground"></i>
                        </div>
                        <h3 className="text-xl font-medium mb-2"><T keyName="bots.noActiveBots" /></h3>
                        <p className="text-muted-foreground text-center max-w-md mb-6">
                          <T keyName="bots.noActiveBotsDescription" />
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="risk" className="space-y-8">
                  {lowRiskBots.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-green-600">
                        <T keyName="bots.lowRisk" />
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {lowRiskBots.map((bot) => (
                          <BotCard key={bot.id} bot={bot} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {mediumRiskBots.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-amber-600">
                        <T keyName="bots.mediumRisk" />
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mediumRiskBots.map((bot) => (
                          <BotCard key={bot.id} bot={bot} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {highRiskBots.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-red-600">
                        <T keyName="bots.highRisk" />
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {highRiskBots.map((bot) => (
                          <BotCard key={bot.id} bot={bot} />
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
