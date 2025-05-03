import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useBots } from "@/hooks/use-bots";
import { T } from "@/lib/i18n";
import { Info, Sparkles, Zap, ShieldAlert, Clock, TrendingUp, ChevronRight, Loader2 } from "lucide-react";
import { Link } from "wouter";

interface BotCardProps {
  bot: any;
}

export function BotCard({ bot }: BotCardProps) {
  const { launchBot, isLoading } = useBots();
  const [showModal, setShowModal] = useState(false);
  const [investment, setInvestment] = useState(100);
  const [useAdvancedSettings, setUseAdvancedSettings] = useState(false);
  const [stopLoss, setStopLoss] = useState(10);
  const [takeProfit, setTakeProfit] = useState(30);
  const [maxDuration, setMaxDuration] = useState(7);
  const [strategy, setStrategy] = useState("auto");
  
  const handleLaunchBot = () => {
    if (useAdvancedSettings) {
      launchBot(bot.id, investment, {
        strategy,
        stopLossPercentage: stopLoss,
        takeProfitPercentage: takeProfit,
        maxDurationDays: maxDuration
      });
    } else {
      launchBot(bot.id, investment);
    }
    setShowModal(false);
  };
  
  // Get color variants based on risk level
  const getRiskColor = () => {
    if (bot.riskLevel === "High" || bot.riskLevel === "Very High") {
      return "text-red-600 bg-red-50";
    } else if (bot.riskLevel === "Medium" || bot.riskLevel === "Medium-High") {
      return "text-amber-600 bg-amber-50";
    } else {
      return "text-green-600 bg-green-50";
    }
  };
  
  const getRiskProgress = () => {
    if (bot.riskLevel === "Very Low") return 10;
    if (bot.riskLevel === "Low") return 25;
    if (bot.riskLevel === "Medium-Low") return 40;
    if (bot.riskLevel === "Medium") return 55;
    if (bot.riskLevel === "Medium-High") return 70;
    if (bot.riskLevel === "High") return 85;
    if (bot.riskLevel === "Very High") return 100;
    return 50;
  };
  
  const getProgressColor = () => {
    const risk = getRiskProgress();
    if (risk < 30) return "bg-green-600";
    if (risk < 70) return "bg-amber-500";
    return "bg-red-500";
  };
  
  return (
    <>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <div className={`w-8 h-8 rounded-md bg-${bot.iconBg} flex items-center justify-center text-${bot.iconColor} mr-3`}>
                <i className={bot.icon}></i>
              </div>
              <T keyName="bots.launch.modal.title" />: {bot.name}
            </DialogTitle>
            <DialogDescription>
              <T keyName="bots.launch.modal.description" />
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Investment amount */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="investment">
                  <T keyName="bots.launch.modal.investment" />
                </Label>
                <span className="text-sm text-primary font-semibold">${investment} USDT</span>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setInvestment(Math.max(50, investment - 50))}
                >
                  -
                </Button>
                <Slider
                  id="investment"
                  min={50}
                  max={10000}
                  step={50}
                  value={[investment]}
                  onValueChange={(value) => setInvestment(value[0])}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setInvestment(Math.min(10000, investment + 50))}
                >
                  +
                </Button>
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Min: $50</span>
                <span>Max: $10,000</span>
              </div>
            </div>
            
            {/* Advanced settings toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="advanced-settings">
                  <T keyName="bots.launch.modal.advancedSettings" />
                </Label>
                <p className="text-xs text-muted-foreground">
                  <T keyName="bots.launch.modal.advancedSettingsDescription" />
                </p>
              </div>
              <Switch
                id="advanced-settings"
                checked={useAdvancedSettings}
                onCheckedChange={setUseAdvancedSettings}
              />
            </div>
            
            {useAdvancedSettings && (
              <div className="space-y-4 bg-muted/30 p-4 rounded-lg border">
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-primary" />
                  <T keyName="bots.launch.modal.protectionSettings" />
                </h4>
                
                {/* Stop Loss */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="stop-loss" className="flex items-center">
                      <ShieldAlert className="h-4 w-4 mr-2 text-red-500" />
                      <T keyName="bots.stopLoss" />
                    </Label>
                    <span className="text-sm font-medium text-red-500">-{stopLoss}%</span>
                  </div>
                  <Slider
                    id="stop-loss"
                    min={5}
                    max={50}
                    step={1}
                    value={[stopLoss]}
                    onValueChange={(value) => setStopLoss(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5%</span>
                    <span>50%</span>
                  </div>
                </div>
                
                {/* Take Profit */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="take-profit" className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                      <T keyName="bots.takeProfit" />
                    </Label>
                    <span className="text-sm font-medium text-green-500">+{takeProfit}%</span>
                  </div>
                  <Slider
                    id="take-profit"
                    min={5}
                    max={100}
                    step={1}
                    value={[takeProfit]}
                    onValueChange={(value) => setTakeProfit(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                {/* Max Duration */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="max-duration" className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-blue-500" />
                      <T keyName="bots.maxDuration" />
                    </Label>
                    <span className="text-sm font-medium text-blue-500">{maxDuration} <T keyName="bots.days" /></span>
                  </div>
                  <Slider
                    id="max-duration"
                    min={1}
                    max={90}
                    step={1}
                    value={[maxDuration]}
                    onValueChange={(value) => setMaxDuration(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 <T keyName="bots.day" /></span>
                    <span>90 <T keyName="bots.days" /></span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Bot Info Summary */}
            <div className="bg-muted/30 p-4 rounded-lg space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground"><T keyName="bots.profitPotential" /></span>
                <span className="font-medium text-green-500">{bot.profitRange}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground"><T keyName="bots.riskLevel" /></span>
                <span className={`font-medium ${getRiskColor().split(' ')[0]}`}>{bot.riskLevel}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground"><T keyName="bots.recommendedTimeframe" /></span>
                <span className="font-medium">1-3 <T keyName="bots.months" /></span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              <T keyName="bots.launch.modal.cancel" />
            </Button>
            <Button onClick={handleLaunchBot} disabled={isLoading} className="sm:flex-1">
              {isLoading ? (
                <>
                  <span className="mr-2"><T keyName="bots.launch.modal.launching" /></span>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <T keyName="bots.launch.modal.launch" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 group relative">
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>
        
        <div className="p-4 flex items-start justify-between mb-2">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-md bg-${bot.iconBg} flex items-center justify-center text-${bot.iconColor} mr-3 shadow-sm`}>
              <i className={bot.icon}></i>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{bot.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{bot.description}</p>
            </div>
          </div>
          <Badge className={getRiskColor()}>{bot.riskLevel}</Badge>
        </div>
        
        <CardContent className="pb-3 pt-0">
          <div 
            className="w-full h-24 mb-4 bg-cover bg-center rounded-md overflow-hidden" 
            style={{
              backgroundImage: `url(data:image/svg+xml;base64,${bot.chartBase64})`,
            }}
          ></div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                <T keyName="bots.profit" />
              </span>
              <span className="font-medium text-green-600">{bot.profitRange}</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center">
                  <ShieldAlert className="h-4 w-4 mr-1" />
                  <T keyName="bots.risk" />
                </span>
                <span className="text-xs">{getRiskProgress()}%</span>
              </div>
              <Progress value={getRiskProgress()} className={getProgressColor()} />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-muted rounded-md p-2 text-center">
                <div className="text-xs text-muted-foreground"><T keyName="bots.minInvestment" /></div>
                <div className="font-medium">$50 USDT</div>
              </div>
              <div className="bg-muted rounded-md p-2 text-center">
                <div className="text-xs text-muted-foreground"><T keyName="bots.avgCycle" /></div>
                <div className="font-medium">7-14 <T keyName="bots.days" /></div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-2 pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            asChild
          >
            <Link href={`/bots/${bot.id}`}>
              <Info className="h-4 w-4 mr-2" />
              <T keyName="bots.details" />
            </Link>
          </Button>
          <Button
            className="flex-1"
            size="sm"
            onClick={() => setShowModal(true)}
          >
            <Zap className="h-4 w-4 mr-2" />
            <T keyName="bots.launch" />
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}