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
import { Info, Sparkles, Zap, ShieldAlert, Clock, TrendingUp, ChevronRight, Loader2, Bot, Wallet } from "lucide-react";
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
        <DialogContent className="max-w-lg glass-effect border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-xl subtle-gradient flex items-center justify-center shadow-md mr-3 text-primary border border-primary/10">
                {bot.icon && bot.icon.includes('ri-') ? (
                  <i className={`${bot.icon} text-xl`}></i>
                ) : (
                  <Bot className="h-5 w-5" />
                )}
              </div>
              <span className="gradient-heading text-xl">
                <T keyName="bots.launch.modal.title" />: {bot.name}
              </span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              <T keyName="bots.launch.modal.description" />
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Investment amount */}
            <div className="glass-effect p-4 rounded-xl space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="investment" className="flex items-center text-base font-medium">
                  <Wallet className="h-4 w-4 mr-2 text-primary" />
                  <T keyName="bots.launch.modal.investment" />
                </Label>
                <span className="text-base bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold">${investment} USDT</span>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-lg hover:bg-primary/5"
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
                  className="rounded-lg hover:bg-primary/5"
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
            <div className="flex items-center justify-between bg-muted/30 p-4 rounded-xl">
              <div className="space-y-0.5">
                <Label htmlFor="advanced-settings" className="flex items-center font-medium">
                  <Sparkles className="h-4 w-4 mr-2 text-accent" />
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
              <div className="space-y-4 glass-effect p-5 rounded-xl border border-primary/10 shadow-sm">
                <h4 className="text-sm font-medium mb-3 flex items-center gradient-heading">
                  <Sparkles className="h-4 w-4 mr-2" />
                  <T keyName="bots.launch.modal.protectionSettings" />
                </h4>
                
                {/* Stop Loss */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="stop-loss" className="flex items-center">
                      <ShieldAlert className="h-4 w-4 mr-2 text-destructive" />
                      <T keyName="bots.stopLoss" />
                    </Label>
                    <span className="text-sm font-medium text-destructive">-{stopLoss}%</span>
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
                      <TrendingUp className="h-4 w-4 mr-2 text-success" />
                      <T keyName="bots.takeProfit" />
                    </Label>
                    <span className="text-sm font-medium text-success">+{takeProfit}%</span>
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
                      <Clock className="h-4 w-4 mr-2 text-accent" />
                      <T keyName="bots.maxDuration" />
                    </Label>
                    <span className="text-sm font-medium text-accent">{maxDuration} <T keyName="bots.days" /></span>
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
            <div className="glass-effect p-4 rounded-xl space-y-3 border border-border/30">
              <h4 className="text-sm font-medium flex items-center">
                <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                <T keyName="bots.summary" />
              </h4>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground"><T keyName="bots.profitPotential" /></span>
                <span className="font-medium text-success">{bot.profitRange}</span>
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
            <Button variant="outline" onClick={() => setShowModal(false)} className="glass-effect">
              <T keyName="bots.launch.modal.cancel" />
            </Button>
            <Button 
              onClick={handleLaunchBot} 
              disabled={isLoading} 
              className="sm:flex-1 button-gradient border-0 shadow-md"
            >
              {isLoading ? (
                <>
                  <span className="mr-2"><T keyName="bots.launch.modal.launching" /></span>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  <T keyName="bots.launch.modal.launch" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Card className="card-hover overflow-hidden group relative glass-effect border-opacity-50">
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>
        <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-all duration-500"></div>
        
        <div className="p-5 flex items-start justify-between mb-1">
          <div className="flex items-center">
            <div className="w-11 h-11 rounded-xl subtle-gradient flex items-center justify-center shadow-md mr-3 text-primary border border-primary/10 group-hover:shadow-lg group-hover:shadow-primary/5 transition-all duration-300">
              {bot.icon && bot.icon.includes('ri-') ? (
                <i className={`${bot.icon} text-xl`}></i>
              ) : (
                <Bot className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg gradient-heading">{bot.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{bot.description}</p>
            </div>
          </div>
          <Badge variant="outline" className={`${getRiskColor()} border-0 shadow-sm`}>
            {bot.riskLevel}
          </Badge>
        </div>
        
        <CardContent className="pb-3 pt-0">
          <div className="relative">
            <div 
              className="w-full h-32 mb-4 bg-cover bg-center rounded-lg overflow-hidden border border-border/30 shadow-sm" 
              style={{
                backgroundImage: `url(data:image/svg+xml;base64,${bot.chartBase64})`,
              }}
            />
            <div className="absolute top-2 right-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="bg-white/80 hover:bg-white text-primary border-0 shadow-sm backdrop-blur-sm">
                      {bot.type || "Trading Bot"}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{bot.typeDescription || "Automated trading strategy"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center">
                <TrendingUp className="h-4 w-4 mr-1.5 text-success" />
                <T keyName="bots.profit" />
              </span>
              <span className="font-semibold text-success">{bot.profitRange}</span>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center">
                  <ShieldAlert className="h-4 w-4 mr-1.5" />
                  <T keyName="bots.risk" />
                </span>
                <span className="text-xs font-medium">{bot.riskLevel}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getProgressColor()} transition-all duration-500 rounded-full`}
                  style={{width: `${getRiskProgress()}%`}}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="glass-effect rounded-lg p-2.5 text-center">
                <div className="text-xs text-muted-foreground mb-0.5"><T keyName="bots.minInvestment" /></div>
                <div className="font-medium text-sm">$50 USDT</div>
              </div>
              <div className="glass-effect rounded-lg p-2.5 text-center">
                <div className="text-xs text-muted-foreground mb-0.5"><T keyName="bots.avgCycle" /></div>
                <div className="font-medium text-sm">7-14 <T keyName="bots.days" /></div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-2 pt-1">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 glass-effect"
            asChild
          >
            <Link href={`/bots/${bot.id}`}>
              <Info className="h-4 w-4 mr-2" />
              <T keyName="bots.details" />
              <ChevronRight className="ml-1 h-3 w-3 opacity-70" />
            </Link>
          </Button>
          <Button
            className="flex-1 button-gradient border-0"
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