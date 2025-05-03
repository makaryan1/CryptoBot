import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useBots } from "@/hooks/use-bots";
import { T } from "@/lib/i18n";
import { BarChart2, Clock, History, PieChart, StopCircle, TrendingUp } from "lucide-react";
import { Link } from "wouter";

interface ActiveBotCardProps {
  bot: any;
}

export function ActiveBotCard({ bot }: ActiveBotCardProps) {
  const { stopBot, isLoading } = useBots();
  const [showStopDialog, setShowStopDialog] = useState(false);
  
  const handleStopBot = () => {
    stopBot(bot.id);
    setShowStopDialog(false);
  };
  
  // Format profit with color
  const getProfitDisplay = () => {
    const profit = bot.profitPercentage;
    if (profit > 0) {
      return <span className="text-green-600">+{profit.toFixed(2)}%</span>;
    } else if (profit < 0) {
      return <span className="text-red-600">{profit.toFixed(2)}%</span>;
    } else {
      return <span className="text-neutral-600">0.00%</span>;
    }
  };
  
  return (
    <>
      <AlertDialog open={showStopDialog} onOpenChange={setShowStopDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle><T keyName="bots.stopBot.title" /></AlertDialogTitle>
            <AlertDialogDescription>
              <T keyName="bots.stopBot.description" />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel><T keyName="common.cancel" /></AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleStopBot}
              className="bg-red-600 hover:bg-red-700"
            >
              <T keyName="bots.stopBot.confirm" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Card className="overflow-hidden border-primary/20 hover:shadow-md transition-shadow duration-300">
        <div className="bg-primary/10 p-3 flex items-start justify-between">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-md bg-${bot.iconBg} flex items-center justify-center text-${bot.iconColor} mr-3 shadow-sm`}>
              <i className={bot.icon}></i>
            </div>
            <div>
              <h3 className="font-semibold">{bot.name}</h3>
              <div className="text-xs flex items-center text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {bot.runningTime}
              </div>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <T keyName="bots.active" />
          </Badge>
        </div>
        
        <CardContent className="py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/40 rounded-md p-2.5">
                <div className="text-xs text-muted-foreground mb-1"><T keyName="bots.initialInvestment" /></div>
                <div className="font-medium">${bot.initialInvestment} USDT</div>
              </div>
              <div className="bg-muted/40 rounded-md p-2.5">
                <div className="text-xs text-muted-foreground mb-1"><T keyName="bots.currentValue" /></div>
                <div className="font-medium">${bot.currentValue} USDT</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <T keyName="bots.currentProfit" />
                </span>
                <span className="font-medium">{getProfitDisplay()}</span>
              </div>
              
              <Progress 
                value={Math.min(100, Math.max(0, bot.profitPercentage + 50))} 
                className={bot.profitPercentage >= 0 ? "bg-green-500" : "bg-red-500"} 
              />
            </div>
            
            {bot.strategy && (
              <div className="flex items-center gap-2 text-xs">
                <Badge variant="outline" className="rounded-full">
                  <BarChart2 className="h-3 w-3 mr-1" />
                  {bot.strategy}
                </Badge>
                
                {bot.stopLossPercentage && (
                  <Badge variant="outline" className="rounded-full bg-red-50 text-red-700 border-red-200">
                    SL {bot.stopLossPercentage}%
                  </Badge>
                )}
                
                {bot.takeProfitPercentage && (
                  <Badge variant="outline" className="rounded-full bg-green-50 text-green-700 border-green-200">
                    TP {bot.takeProfitPercentage}%
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-2 border-t bg-muted/20 pt-3 pb-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            asChild
          >
            <Link href={`/bots/history/${bot.id}`}>
              <History className="h-4 w-4 mr-2" />
              <T keyName="bots.history" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setShowStopDialog(true)}
            disabled={isLoading}
          >
            <StopCircle className="h-4 w-4 mr-2" />
            <T keyName="bots.stop" />
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}