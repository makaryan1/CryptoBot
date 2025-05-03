import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useBots } from "@/hooks/use-bots";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { T } from "@/lib/i18n";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BotCard } from "@/components/bots/bot-card";
import { ActiveBotCard } from "@/components/bots/active-bot-card";
import { Loader2, Bot as RobotIcon, Shield, TrendingUp, Sparkles, Zap } from "lucide-react";

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
          title={<span className="gradient-heading">Trading Bots</span>} 
          subtitle={
            <div className="flex items-center">
              <RobotIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Manage your automated trading strategies</span>
            </div>
          }
        />
        
        <div className="mb-8 mt-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <TabsList className="mb-4 sm:mb-0 glass-effect">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary/20">
                  <Sparkles className="h-4 w-4 mr-2" />
                  <T keyName="bots.allBots" />
                </TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:bg-primary/20">
                  <Zap className="h-4 w-4 mr-2" />
                  <T keyName="bots.activeBots" />
                </TabsTrigger>
                <TabsTrigger value="risk" className="data-[state=active]:bg-primary/20">
                  <Shield className="h-4 w-4 mr-2" />
                  <T keyName="bots.byRiskLevel" />
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center">
                <Badge variant="outline" className="glass-effect">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span className="font-medium">{availableBots.length}</span>&nbsp;<T keyName="bots.botsAvailable" />
                </Badge>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="glass-effect p-8 rounded-xl flex flex-col items-center">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground"><T keyName="common.loading" /></p>
                </div>
              </div>
            ) : (
              <>
                <TabsContent value="all" className="space-y-8">
                  {activeBots.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center mb-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-accent to-primary rounded-r-md mr-2"></div>
                        <h2 className="text-xl font-bold flex items-center">
                          <Zap className="h-5 w-5 mr-2 text-accent" />
                          <T keyName="bots.yourActiveBots" />
                          <Badge className="ml-2 bg-accent/20 text-accent">{activeBots.length}</Badge>
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {activeBots.map((bot) => (
                          <ActiveBotCard key={bot.id} bot={bot} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div className="flex items-center mb-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-r-md mr-2"></div>
                      <h2 className="text-xl font-bold flex items-center">
                        <RobotIcon className="h-5 w-5 mr-2 text-primary" />
                        <T keyName="bots.availableBots" />
                        <Badge className="ml-2 bg-primary/20 text-primary">{availableBots.length}</Badge>
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {availableBots.map((bot) => (
                        <BotCard key={bot.id} bot={bot} />
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="active">
                  {activeBots.length > 0 ? (
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-1 h-6 bg-gradient-to-b from-accent to-primary rounded-r-md mr-2"></div>
                        <h2 className="text-xl font-bold flex items-center">
                          <Zap className="h-5 w-5 mr-2 text-accent" />
                          <T keyName="bots.yourActiveBots" />
                          <Badge className="ml-2 bg-accent/20 text-accent">{activeBots.length}</Badge>
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {activeBots.map((bot) => (
                          <ActiveBotCard key={bot.id} bot={bot} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Card className="glass-effect border-border/50 overflow-hidden">
                      <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
                      <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl"></div>
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="w-24 h-24 rounded-full subtle-gradient flex items-center justify-center mb-6 shadow-xl border border-border/50">
                          <RobotIcon className="h-12 w-12 text-primary/60" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 gradient-heading"><T keyName="bots.noActiveBots" /></h3>
                        <p className="text-muted-foreground text-center max-w-md mb-8">
                          <T keyName="bots.noActiveBotsDescription" />
                        </p>
                        <Badge variant="outline" className="text-sm py-1.5 px-3">
                          <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-primary" />
                          <T keyName="bots.launchBotNow" />
                        </Badge>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="risk" className="space-y-10">
                  {lowRiskBots.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center mb-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-r-md mr-2"></div>
                        <h2 className="text-xl font-bold flex items-center text-green-600">
                          <Shield className="h-5 w-5 mr-2" />
                          <T keyName="bots.lowRisk" />
                          <Badge className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">{lowRiskBots.length}</Badge>
                        </h2>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        <T keyName="bots.lowRiskDescription" />
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {lowRiskBots.map((bot) => (
                          <BotCard key={bot.id} bot={bot} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {mediumRiskBots.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center mb-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-r-md mr-2"></div>
                        <h2 className="text-xl font-bold flex items-center text-amber-600">
                          <Shield className="h-5 w-5 mr-2" />
                          <T keyName="bots.mediumRisk" />
                          <Badge className="ml-2 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">{mediumRiskBots.length}</Badge>
                        </h2>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        <T keyName="bots.mediumRiskDescription" />
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {mediumRiskBots.map((bot) => (
                          <BotCard key={bot.id} bot={bot} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {highRiskBots.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center mb-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-red-400 to-red-600 rounded-r-md mr-2"></div>
                        <h2 className="text-xl font-bold flex items-center text-red-600">
                          <Shield className="h-5 w-5 mr-2" />
                          <T keyName="bots.highRisk" />
                          <Badge className="ml-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">{highRiskBots.length}</Badge>
                        </h2>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        <T keyName="bots.highRiskDescription" />
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
