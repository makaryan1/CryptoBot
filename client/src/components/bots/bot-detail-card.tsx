import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Bot } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { T } from "@/lib/i18n";

// Примерные данные графика производительности
const demoData = [
  { date: "1 May", value: 100 },
  { date: "2 May", value: 102 },
  { date: "3 May", value: 103.5 },
  { date: "4 May", value: 101.8 },
  { date: "5 May", value: 104.2 },
  { date: "6 May", value: 106.1 },
  { date: "7 May", value: 105.3 },
  { date: "8 May", value: 107.8 },
  { date: "9 May", value: 109.4 },
  { date: "10 May", value: 110.6 },
];

const strategies = [
  {
    id: "trend_following",
    name: "Trend Following",
    description: "Follows the momentum of the market, buying assets that are trending upward and selling those trending downward.",
  },
  {
    id: "mean_reversion",
    name: "Mean Reversion",
    description: "Assumes that prices will revert to their mean after reaching extreme levels, buying when prices fall below and selling when they rise above.",
  },
  {
    id: "breakout",
    name: "Breakout Strategy",
    description: "Identifies and capitalizes on price movements beyond support and resistance levels.",
  },
  {
    id: "rsi_divergence",
    name: "RSI Divergence",
    description: "Identifies divergences between price and RSI indicator to predict potential market reversals.",
  },
];

interface BotDetailCardProps {
  bot: Bot;
  onLaunch: (
    botId: number, 
    investment: number, 
    options?: {
      strategy?: string;
      stopLossPercentage?: number | null;
      takeProfitPercentage?: number | null;
      maxDurationDays?: number | null;
    }
  ) => void;
}

export function BotDetailCard({ bot, onLaunch }: BotDetailCardProps) {
  const [investment, setInvestment] = useState(100);
  const [showModal, setShowModal] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState("trend_following");
  const [stopLossPercentage, setStopLossPercentage] = useState<number | null>(null);
  const [takeProfitPercentage, setTakeProfitPercentage] = useState<number | null>(null);
  const [maxDurationDays, setMaxDurationDays] = useState<number | null>(null);
  const [useAdvancedSettings, setUseAdvancedSettings] = useState(false);
  
  // Рассчитать прибыльность (демо)
  const calculateProfitSummary = () => {
    const firstValue = demoData[0].value;
    const lastValue = demoData[demoData.length - 1].value;
    const totalGain = ((lastValue - firstValue) / firstValue) * 100;
    const dailyAvg = totalGain / demoData.length;
    
    return {
      total: totalGain.toFixed(2),
      daily: dailyAvg.toFixed(2),
      weekly: (dailyAvg * 7).toFixed(2),
      monthly: (dailyAvg * 30).toFixed(2),
    };
  };
  
  const profitSummary = calculateProfitSummary();
  
  const handleLaunchBot = () => {
    onLaunch(bot.id, investment, {
      strategy: selectedStrategy,
      stopLossPercentage: stopLossPercentage,
      takeProfitPercentage: takeProfitPercentage,
      maxDurationDays: maxDurationDays
    });
    setShowModal(false);
  };
  
  // Расчет примерного уровня риска в числах от 0 до 100
  const getRiskLevel = (level: string) => {
    switch (level) {
      case 'Very Low': return 10;
      case 'Low': return 25;
      case 'Medium-Low': return 40;
      case 'Medium': return 55;
      case 'Medium-High': return 70;
      case 'High': return 85;
      case 'Very High': return 95;
      default: return 50;
    }
  };
  
  const riskValue = getRiskLevel(bot.riskLevel);
  
  // Класс цвета для индикатора риска
  const getRiskColorClass = () => {
    if (riskValue < 30) return "text-green-500";
    if (riskValue < 60) return "text-amber-500";
    return "text-red-500";
  };
  
  return (
    <>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle><T keyName="bots.launch.modal.title" /></DialogTitle>
            <DialogDescription>
              <T keyName="bots.launch.modal.description" />
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-md bg-${bot.iconBg || 'slate-100'} flex items-center justify-center text-${bot.iconColor || 'slate-900'}`}>
                  <i className={bot.icon}></i>
                </div>
                <div>
                  <h3 className="font-medium">{bot.name}</h3>
                  <p className="text-xs text-neutral-500">{bot.description}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="strategy"><T keyName="bots.strategy" /></Label>
              <select
                id="strategy"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
              >
                {strategies.map((strategy) => (
                  <option key={strategy.id} value={strategy.id}>
                    {strategy.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                {strategies.find(s => s.id === selectedStrategy)?.description}
              </p>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="investment" className="text-right">
                <T keyName="bots.launch.modal.investment" />
              </Label>
              <div className="col-span-3">
                <Input
                  id="investment"
                  type="number"
                  min="10"
                  value={investment}
                  onChange={(e) => setInvestment(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  <T keyName="bots.minInvestment" values={{ min: 10 }} />
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currency" className="text-right">
                <T keyName="bots.launch.modal.currency" />
              </Label>
              <Input
                id="currency"
                value="USDT"
                disabled
                className="col-span-3"
              />
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2"><T keyName="bots.expectedReturns" /></h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-xs text-muted-foreground"><T keyName="bots.daily" /></div>
                  <div className="text-sm font-medium text-green-600">+{profitSummary.daily}%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground"><T keyName="bots.weekly" /></div>
                  <div className="text-sm font-medium text-green-600">+{profitSummary.weekly}%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground"><T keyName="bots.monthly" /></div>
                  <div className="text-sm font-medium text-green-600">+{profitSummary.monthly}%</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium"><T keyName="bots.advancedSettings" /></h4>
                <div className="flex items-center gap-2">
                  <Label htmlFor="useAdvancedSettings" className="text-sm text-neutral-600 cursor-pointer">
                    <T keyName="bots.useAdvancedSettings" />
                  </Label>
                  <input 
                    type="checkbox" 
                    id="useAdvancedSettings" 
                    checked={useAdvancedSettings}
                    onChange={(e) => setUseAdvancedSettings(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                  />
                </div>
              </div>
              
              {useAdvancedSettings ? (
                <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stopLoss" className="text-sm">
                      <T keyName="bots.stopLoss" />
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="stopLoss"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="5"
                        value={stopLossPercentage || ""}
                        onChange={(e) => setStopLossPercentage(e.target.value ? Number(e.target.value) : null)}
                        className="w-full"
                      />
                      <span className="text-sm">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <T keyName="bots.stopLossDescription" />
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="takeProfit" className="text-sm">
                      <T keyName="bots.takeProfit" />
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="takeProfit"
                        type="number"
                        min="0"
                        max="1000"
                        placeholder="20"
                        value={takeProfitPercentage || ""}
                        onChange={(e) => setTakeProfitPercentage(e.target.value ? Number(e.target.value) : null)}
                        className="w-full"
                      />
                      <span className="text-sm">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <T keyName="bots.takeProfitDescription" />
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxDuration" className="text-sm">
                      <T keyName="bots.maxDuration" />
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="maxDuration"
                        type="number"
                        min="1"
                        max="365"
                        placeholder="30"
                        value={maxDurationDays || ""}
                        onChange={(e) => setMaxDurationDays(e.target.value ? Number(e.target.value) : null)}
                        className="w-full"
                      />
                      <span className="text-sm"><T keyName="bots.days" /></span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <T keyName="bots.maxDurationDescription" />
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600"><T keyName="bots.stopLoss" /></span>
                      <span className="text-sm font-medium text-primary"><T keyName="bots.availableOption" /></span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600"><T keyName="bots.takeProfit" /></span>
                      <span className="text-sm font-medium text-primary"><T keyName="bots.availableOption" /></span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600"><T keyName="bots.maxDuration" /></span>
                      <span className="text-sm font-medium text-primary"><T keyName="bots.availableOption" /></span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">
                      <T keyName="bots.availableAfterLaunch" />
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              <T keyName="bots.launch.modal.cancel" />
            </Button>
            <Button onClick={handleLaunchBot}>
              <T keyName="bots.launch.modal.launch" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 rounded-md bg-${bot.iconBg || 'slate-100'} flex items-center justify-center text-${bot.iconColor || 'slate-900'} mr-4`}>
                <i className={`${bot.icon} text-xl`}></i>
              </div>
              <div>
                <h2 className="text-xl font-bold">{bot.name}</h2>
                <p className="text-neutral-500">{bot.description}</p>
              </div>
            </div>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="overview"><T keyName="bots.overview" /></TabsTrigger>
                <TabsTrigger value="performance"><T keyName="bots.performance" /></TabsTrigger>
                <TabsTrigger value="settings"><T keyName="bots.settings" /></TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-2"><T keyName="bots.profitPotential" /></h4>
                      <div className="flex items-center">
                        <div className="text-xl font-bold text-green-600 mr-2">{bot.profitRange}</div>
                        <div className="text-sm text-neutral-500"><T keyName="bots.monthly" /></div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-2"><T keyName="bots.riskAssessment" /></h4>
                      <div className="flex items-center mb-2">
                        <div className={`text-lg font-medium ${getRiskColorClass()} mr-2`}>
                          {bot.riskLevel}
                        </div>
                      </div>
                      <Progress value={riskValue} className="h-2" />
                    </div>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="strategies">
                      <AccordionTrigger><T keyName="bots.strategies" /></AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          {strategies.map((strategy) => (
                            <div key={strategy.id} className="bg-muted/20 p-3 rounded-md">
                              <div className="font-medium">{strategy.name}</div>
                              <div className="text-sm text-neutral-500">{strategy.description}</div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="features">
                      <AccordionTrigger><T keyName="bots.features" /></AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li><T keyName="bots.feature1" /></li>
                          <li><T keyName="bots.feature2" /></li>
                          <li><T keyName="bots.feature3" /></li>
                          <li><T keyName="bots.feature4" /></li>
                          <li><T keyName="bots.feature5" /></li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="suitability">
                      <AccordionTrigger><T keyName="bots.suitability" /></AccordionTrigger>
                      <AccordionContent>
                        <div className="text-sm space-y-2">
                          <p><T keyName="bots.suitabilityDescription" /></p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                              <T keyName="bots.suitabilityTag1" />
                            </span>
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                              <T keyName="bots.suitabilityTag2" />
                            </span>
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                              <T keyName="bots.suitabilityTag3" />
                            </span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="mt-4">
                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-3"><T keyName="bots.historicalPerformance" /></h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={demoData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="text-xs text-neutral-500 mb-1"><T keyName="bots.totalGain" /></div>
                      <div className="text-lg font-bold text-green-600">+{profitSummary.total}%</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="text-xs text-neutral-500 mb-1"><T keyName="bots.dailyAvg" /></div>
                      <div className="text-lg font-bold text-green-600">+{profitSummary.daily}%</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="text-xs text-neutral-500 mb-1"><T keyName="bots.weeklyProj" /></div>
                      <div className="text-lg font-bold text-green-600">+{profitSummary.weekly}%</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="text-xs text-neutral-500 mb-1"><T keyName="bots.monthlyProj" /></div>
                      <div className="text-lg font-bold text-green-600">+{profitSummary.monthly}%</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-4">
                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-3"><T keyName="bots.defaultSettings" /></h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600"><T keyName="bots.strategy" /></span>
                        <span className="text-sm font-medium">Trend Following</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600"><T keyName="bots.timeframe" /></span>
                        <span className="text-sm font-medium">1h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600"><T keyName="bots.leverageUsed" /></span>
                        <span className="text-sm font-medium">1x (Spot)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600"><T keyName="bots.maxDrawdown" /></span>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600"><T keyName="bots.rebalancing" /></span>
                        <span className="text-sm font-medium"><T keyName="bots.automatic" /></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-3"><T keyName="bots.advancedSettings" /></h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600"><T keyName="bots.stopLoss" /></span>
                        <span className="text-sm font-medium"><T keyName="bots.availableOption" /></span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600"><T keyName="bots.takeProfit" /></span>
                        <span className="text-sm font-medium"><T keyName="bots.availableOption" /></span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600"><T keyName="bots.maxDuration" /></span>
                        <span className="text-sm font-medium"><T keyName="bots.availableOption" /></span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-2">
                        <T keyName="bots.availableAfterLaunch" />
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        
        <CardFooter className="bg-muted/20 p-6">
          <Button 
            className="w-full"
            onClick={() => setShowModal(true)}
          >
            <i className="ri-robot-line mr-2"></i>
            <T keyName="bots.launch" />
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}