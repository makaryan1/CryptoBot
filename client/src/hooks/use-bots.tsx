import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "./use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Bot, UserBot } from "@shared/schema";

interface BotWithDetails extends Bot {
  iconBg: string;
  iconColor: string;
  chartBase64: string;
}

interface UserBotWithDetails extends UserBot {
  name: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  chartBase64: string;
  runningTime: string;
  profitPercentage: number;
}

export function useBots() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch all bots
  const { data: bots, isLoading: botsLoading } = useQuery<Bot[]>({
    queryKey: ["/api/bots"],
    enabled: !!user,
  });
  
  // Fetch user bots
  const { data: userBots, isLoading: userBotsLoading } = useQuery<UserBot[]>({
    queryKey: ["/api/bots/user"],
    enabled: !!user,
  });
  
  // Launch a bot
  const launchBotMutation = useMutation({
    mutationFn: async ({ 
      botId, 
      initialInvestment,
      currency = "USDT",
      stopLossPercentage = null,
      takeProfitPercentage = null,
      maxDurationDays = null,
      strategy = "trend_following"
    }: { 
      botId: number;
      initialInvestment: number; 
      currency?: string;
      stopLossPercentage?: number | null;
      takeProfitPercentage?: number | null;
      maxDurationDays?: number | null;
      strategy?: string;
    }) => {
      const res = await apiRequest("POST", "/api/bots/launch", {
        botId,
        initialInvestment,
        currency,
        stopLossPercentage,
        takeProfitPercentage,
        maxDurationDays,
        strategy
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bots/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallets"] });
      toast({
        title: "Bot launched",
        description: "Your trading bot has been successfully started.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to launch bot",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Stop a bot
  const stopBotMutation = useMutation({
    mutationFn: async (userBotId: number) => {
      const res = await apiRequest("POST", `/api/bots/${userBotId}/stop`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bots/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallets"] });
      toast({
        title: "Bot stopped",
        description: "Your trading bot has been successfully stopped.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to stop bot",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Helper to get icon background and color
  const getBotIconStyle = (bot: Bot): { bg: string, color: string } => {
    const iconMap: Record<string, { bg: string, color: string }> = {
      'ri-bitcoin-line': { bg: 'blue-100', color: 'blue-600' },
      'ri-ethereum-line': { bg: 'purple-100', color: 'purple-600' },
      'ri-coin-line': { bg: 'green-100', color: 'green-600' },
      'ri-currency-line': { bg: 'yellow-100', color: 'yellow-600' },
      'ri-compass-3-line': { bg: 'blue-100', color: 'blue-600' },
      'ri-rocket-line': { bg: 'red-100', color: 'red-600' },
      'ri-recycle-line': { bg: 'green-100', color: 'green-600' },
      'ri-broadcast-line': { bg: 'purple-100', color: 'purple-600' }
    };
    
    return iconMap[bot.icon] || { bg: 'blue-100', color: 'blue-600' };
  };
  
  // Get chart base64 based on the bot risk level
  const getChartBase64 = (bot: Bot): string => {
    // Simple chart SVGs based on risk level
    if (bot.riskLevel === 'High' || bot.riskLevel === 'Very High') {
      return 'PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDMwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMTAwaDMwMHYtMjVjLTIwLTE1LTQwIDEwLTYwLTEwcy0zMC0zNS01MC0zMC01MCAyNS03MCAxMFM0MCAyMCAyMCAxNSAwIDM1IDAgNTB6IiBmaWxsPSIjZGJlZWZkIi8+PHBhdGggZD0iTTAgMTAwaDMwMFY2MGMtMjAtMTUtNDAgMTAtNjAtMTBzLTMwLTI1LTUwLTIwLTUwIDE1LTcwIDBTNDAgMTUgMjAgMTAgMCAxNSAwIDMweiIgZmlsbD0iIzkzYzVmZCIvPjwvc3ZnPg==';
    } else if (bot.riskLevel === 'Medium' || bot.riskLevel === 'Medium-High') {
      return 'PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDMwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMTAwaDMwMHYtNjBjLTIwLTE1LTQwIDEwLTYwLTVzLTMwLTI1LTUwLTI1LTUwIDE1LTcwIDVTNDAgNSAyMCAwIDAgMTAgMCAyMHoiIGZpbGw9IiNlOWQ1ZmYiLz48cGF0aCBkPSJNMCAxMDBoMzAwVjUwYy0yMC0xNS00MCAxMC02MC01cy0zMC0xNS01MC0xNS01MCAxNS03MCA1UzQwIDUgMjAgMCAwIDEwIDAgMjB6IiBmaWxsPSIjYzRiNWZkIi8+PC9zdmc+';
    } else {
      return 'PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDMwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMTAwaDMwMFY4MGMtMjAtNS00MCAxMC02MC0xMHMtMzAtNS01MCAwLTUwIDUtNzAgMFM0MCA2MCAyMCA2NSAwIDcwIDAgODB6IiBmaWxsPSIjZGNmZGVhIi8+PHBhdGggZD0iTTAgMTAwaDMwMFY4NWMtMjAtNS00MCAxMC02MC0xMHMtMzAtNS01MCAwLTUwIDUtNzAgMFM0MCA2NSAyMCA3MCAwIDc1IDAgODV6IiBmaWxsPSIjODRlMWJjIi8+PC9zdmc+';
    }
  };
  
  // Calculate running time for user bots
  const calculateRunningTime = (startedAt: string): string => {
    const started = new Date(startedAt);
    const now = new Date();
    const diffMs = now.getTime() - started.getTime();
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h`;
  };
  
  // Calculate profit percentage for user bots
  const calculateProfitPercentage = (initialInvestment: number, currentValue: number): number => {
    if (initialInvestment <= 0) return 0;
    return ((currentValue - initialInvestment) / initialInvestment) * 100;
  };
  
  // Process available bots with styles
  const getAvailableBots = (): BotWithDetails[] => {
    if (!bots) return [];
    
    return bots.map(bot => {
      const { bg, color } = getBotIconStyle(bot);
      return {
        ...bot,
        iconBg: bg,
        iconColor: color,
        chartBase64: getChartBase64(bot)
      };
    });
  };
  
  // Process active bots with details
  const getActiveBots = (): UserBotWithDetails[] => {
    if (!userBots || !bots) return [];
    
    const activeBots = userBots.filter(ub => ub.status === 'active');
    
    return activeBots.map(userBot => {
      const bot = bots.find(b => b.id === userBot.botId);
      
      if (!bot) {
        return {} as UserBotWithDetails;
      }
      
      const { bg, color } = getBotIconStyle(bot);
      
      return {
        ...userBot,
        name: bot.name,
        description: bot.description,
        icon: bot.icon,
        iconBg: bg,
        iconColor: color,
        chartBase64: getChartBase64(bot),
        runningTime: calculateRunningTime(userBot.startedAt),
        profitPercentage: calculateProfitPercentage(userBot.initialInvestment, userBot.currentValue)
      };
    });
  };
  
  // Launch a bot with advanced settings
  const launchBot = (
    botId: number, 
    initialInvestment: number,
    options?: {
      strategy?: string;
      stopLossPercentage?: number;
      takeProfitPercentage?: number;
      maxDurationDays?: number;
    }
  ) => {
    launchBotMutation.mutate({ 
      botId, 
      initialInvestment,
      strategy: options?.strategy,
      stopLossPercentage: options?.stopLossPercentage,
      takeProfitPercentage: options?.takeProfitPercentage,
      maxDurationDays: options?.maxDurationDays
    });
  };
  
  // Stop a bot
  const stopBot = (userBotId: number) => {
    stopBotMutation.mutate(userBotId);
  };
  
  return {
    availableBots: getAvailableBots(),
    activeBots: getActiveBots(),
    launchBot,
    stopBot,
    isLoading: botsLoading || userBotsLoading || 
               launchBotMutation.isPending || stopBotMutation.isPending
  };
}
