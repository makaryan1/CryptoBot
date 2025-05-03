import { useState } from "react";
import { useBots } from "@/hooks/use-bots";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AvailableBots() {
  const { availableBots, launchBot, isLoading } = useBots();
  
  const [selectedBot, setSelectedBot] = useState<number | null>(null);
  const [investment, setInvestment] = useState(100);
  const [showModal, setShowModal] = useState(false);
  
  const handleOpenModal = (botId: number) => {
    setSelectedBot(botId);
    setShowModal(true);
  };
  
  const handleLaunchBot = () => {
    if (selectedBot !== null) {
      launchBot(selectedBot, investment);
      setShowModal(false);
    }
  };
  
  return (
    <section className="mb-8">
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Launch Bot</DialogTitle>
            <DialogDescription>
              Enter the amount you want to invest in this bot
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="investment" className="text-right">
                Investment
              </Label>
              <Input
                id="investment"
                type="number"
                min="10"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currency" className="text-right">
                Currency
              </Label>
              <Input
                id="currency"
                value="USDT"
                disabled
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleLaunchBot}>Launch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Available Bots</h2>
        <div className="flex items-center">
          <div className="text-sm text-neutral-400">
            <span className="font-medium text-dark">{availableBots.length}</span> of 8 available
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <Skeleton className="w-10 h-10 rounded-md mr-3" />
                  <div>
                    <Skeleton className="h-5 w-20 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                
                <div className="text-sm mb-3">
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full" />
                </div>
                
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {availableBots.map((bot) => (
            <div key={bot.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden hover:border-primary transition-colors">
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div className={`w-10 h-10 rounded-md bg-${bot.iconBg} flex items-center justify-center text-${bot.iconColor} mr-3`}>
                    <i className={bot.icon}></i>
                  </div>
                  <div>
                    <h3 className="font-medium">{bot.name}</h3>
                    <p className="text-xs text-neutral-400">{bot.description}</p>
                  </div>
                </div>
                
                <div className="text-sm mb-3">
                  <div className="flex items-center mb-1">
                    <i className="ri-line-chart-line text-secondary mr-2"></i>
                    <span>Avg. profit: {bot.profitRange} monthly</span>
                  </div>
                  <div className="flex items-center">
                    <i className={`ri-funds-box-line text-${bot.riskLevel === 'High' || bot.riskLevel === 'Very High' ? 'error' : bot.riskLevel === 'Medium-High' || bot.riskLevel === 'Medium' ? 'primary' : 'accent'} mr-2`}></i>
                    <span>Risk level: {bot.riskLevel}</span>
                  </div>
                </div>
                
                <button 
                  className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 font-medium"
                  onClick={() => handleOpenModal(bot.id)}
                >
                  Launch Bot
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
