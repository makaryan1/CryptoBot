import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useBots } from "@/hooks/use-bots";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BotDetailCard } from "@/components/bots/bot-detail-card";
import { T } from "@/lib/i18n";
import { Bot } from "@shared/schema";

export default function BotDetailsPage() {
  const [location, setLocation] = useLocation();
  const params = useParams();
  const [bot, setBot] = useState<Bot | null>(null);
  
  // Обеспечиваем безопасное преобразование ID
  const botId = params.id ? parseInt(params.id) : null;
  
  const { availableBots, launchBot, isLoading } = useBots();
  
  useEffect(() => {
    if (!isLoading && availableBots.length > 0 && botId) {
      console.log(`Looking for bot with ID: ${botId} among ${availableBots.length} bots`);
      const foundBot = availableBots.find(b => b.id === botId);
      setBot(foundBot || null);
    }
  }, [botId, availableBots, isLoading]);
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => setLocation("/bots")}
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span><T keyName="bots.backToBots" /></span>
          </Button>
        </div>
        
        <div className="mb-6">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-[600px] w-full rounded-lg" />
        </div>
      </div>
    );
  }
  
  if (!bot) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-2"><T keyName="bots.notFound" /></h2>
        <p className="text-neutral-500 mb-6"><T keyName="bots.notFoundDescription" /></p>
        <Button onClick={() => setLocation("/bots")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <T keyName="bots.backToBots" />
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={() => setLocation("/bots")}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span><T keyName="bots.backToBots" /></span>
        </Button>
      </div>
      
      <BotDetailCard 
        bot={bot} 
        onLaunch={launchBot}
      />
    </div>
  );
}