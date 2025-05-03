import { Express, Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { Bot, UserBot, insertUserBotSchema } from "@shared/schema";

// Auth middleware
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}

export function setupBotRoutes(app: Express) {
  // Get available bots
  app.get('/api/bots', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Only return enabled bots
      const allBots = await storage.getAllBots();
      const enabledBots = allBots.filter(bot => bot.enabled);
      
      // Check platform settings
      const settings = await storage.getSettings();
      if (settings?.botsEnabled === false) {
        return res.status(403).json({ 
          message: "Trading bots are currently disabled",
          maintenanceMode: true 
        });
      }
      
      res.json(enabledBots);
    } catch (error) {
      next(error);
    }
  });

  // Get a specific bot
  app.get('/api/bots/:id', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bot = await storage.getBot(parseInt(req.params.id));
      if (!bot) {
        return res.status(404).json({ message: "Bot not found" });
      }
      
      if (!bot.enabled) {
        return res.status(403).json({ message: "This bot is currently disabled" });
      }
      
      res.json(bot);
    } catch (error) {
      next(error);
    }
  });

  // Get user's active bots
  app.get('/api/user/bots', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userBots = await storage.getUserBotsByUserId(req.user!.id);
      
      // Enrich with bot details
      const enrichedBots = await Promise.all(userBots.map(async (userBot) => {
        const bot = await storage.getBot(userBot.botId);
        return {
          ...userBot,
          name: bot?.name || "Unknown Bot",
          description: bot?.description || "",
          icon: bot?.icon || "ri-robot-line",
          riskLevel: bot?.riskLevel || "Unknown",
          profitRange: bot?.profitRange || "0%"
        };
      }));
      
      res.json(enrichedBots);
    } catch (error) {
      next(error);
    }
  });

  // Launch a bot
  app.post('/api/bots/launch', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { botId, investment, currency } = req.body;
      
      if (!botId || !investment || !currency) {
        return res.status(400).json({ message: "Bot ID, investment amount, and currency are required" });
      }
      
      // Check if bot exists and is enabled
      const bot = await storage.getBot(parseInt(botId));
      if (!bot) {
        return res.status(404).json({ message: "Bot not found" });
      }
      
      if (!bot.enabled) {
        return res.status(403).json({ message: "This bot is currently disabled" });
      }
      
      // Check platform settings
      const settings = await storage.getSettings();
      if (settings?.botsEnabled === false) {
        return res.status(403).json({ message: "Trading bots are currently disabled" });
      }
      
      // Check if user has completed KYC level 1
      if (req.user!.kycLevel < 1) {
        return res.status(403).json({ message: "KYC verification required to use trading bots" });
      }
      
      // Check if user has enough balance
      const wallet = await storage.getWalletByUserAndCurrency(req.user!.id, currency);
      if (!wallet || wallet.balance < investment) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      
      // Deduct investment from wallet
      await storage.updateWallet(wallet.id, { 
        balance: wallet.balance - investment 
      });
      
      // Create user bot instance
      const userBot = await storage.createUserBot({
        userId: req.user!.id,
        botId: parseInt(botId),
        status: "active",
        investment,
        currency,
        profit: 0,
      });
      
      // Create transaction record
      await storage.createTransaction({
        userId: req.user!.id,
        type: "bot_investment",
        currency,
        amount: investment,
        status: "completed",
        txHash: `bot_${userBot.id}_${Date.now()}`,
      });
      
      res.status(201).json({
        id: userBot.id,
        botId: userBot.botId,
        status: userBot.status,
        investment: userBot.investment,
        currency: userBot.currency,
        startedAt: userBot.startedAt
      });
    } catch (error) {
      next(error);
    }
  });

  // Stop a bot
  app.post('/api/bots/:id/stop', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const botId = parseInt(req.params.id);
      
      // Find the user bot
      const userBots = await storage.getUserBotsByUserId(req.user!.id);
      const userBot = userBots.find(bot => bot.id === botId);
      
      if (!userBot) {
        return res.status(404).json({ message: "Bot instance not found" });
      }
      
      if (userBot.status !== "active") {
        return res.status(400).json({ message: "Bot is not active" });
      }
      
      // Calculate profits (in a real app, this would be based on actual trading results)
      const bot = await storage.getBot(userBot.botId);
      if (!bot) {
        return res.status(404).json({ message: "Bot configuration not found" });
      }
      
      // Generate a random profit within the bot's range
      // This is just for demonstration - in a real app, profit would be calculated based on actual trades
      const profitRange = bot.profitRange.split("-");
      const minProfit = parseFloat(profitRange[0]) / 100;
      const maxProfit = parseFloat(profitRange[1] || profitRange[0]) / 100;
      
      // Get time difference in days
      const startDate = new Date(userBot.startedAt);
      const endDate = new Date();
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Adjust profit based on time running (minimum 1 day)
      const timeAdjustment = Math.max(diffDays, 1) / 30; // Normalize to monthly rate
      
      // Calculate profit
      const profitRate = minProfit + Math.random() * (maxProfit - minProfit);
      const profit = userBot.investment * profitRate * timeAdjustment;
      
      // Update user bot status and profit
      await storage.updateUserBot(userBot.id, {
        status: "completed",
        profit
      });
      
      // Return investment + profit to wallet
      const wallet = await storage.getWalletByUserAndCurrency(req.user!.id, userBot.currency);
      if (wallet) {
        await storage.updateWallet(wallet.id, { 
          balance: wallet.balance + userBot.investment + profit 
        });
        
        // Create transaction record for returned investment
        await storage.createTransaction({
          userId: req.user!.id,
          type: "bot_return",
          currency: userBot.currency,
          amount: userBot.investment,
          status: "completed",
          txHash: `bot_return_${userBot.id}_${Date.now()}`,
        });
        
        // Create transaction record for profit
        if (profit > 0) {
          await storage.createTransaction({
            userId: req.user!.id,
            type: "bot_profit",
            currency: userBot.currency,
            amount: profit,
            status: "completed",
            txHash: `bot_profit_${userBot.id}_${Date.now()}`,
          });
          
          // If user has a referrer, give them a commission
          if (req.user!.referrerId) {
            const referrer = await storage.getUser(req.user!.referrerId);
            if (referrer) {
              // Get commission rate based on referrer's level
              const settings = await storage.getSettings();
              let commissionRate = 0.01; // Default 1%
              
              if (referrer.referralLevel === "gold") {
                commissionRate = settings?.goldFee || 0.05;
              } else if (referrer.referralLevel === "silver") {
                commissionRate = settings?.silverFee || 0.02;
              } else {
                commissionRate = settings?.bronzeFee || 0.01;
              }
              
              const commission = profit * commissionRate;
              
              // Find or create referrer's wallet in this currency
              let referrerWallet = await storage.getWalletByUserAndCurrency(referrer.id, userBot.currency);
              if (!referrerWallet) {
                referrerWallet = await storage.createWallet({
                  userId: referrer.id,
                  currency: userBot.currency,
                  address: "",
                  balance: 0
                });
              }
              
              // Add commission to referrer's wallet
              await storage.updateWallet(referrerWallet.id, { 
                balance: referrerWallet.balance + commission 
              });
              
              // Create transaction record for referral commission
              await storage.createTransaction({
                userId: referrer.id,
                type: "referral_commission",
                currency: userBot.currency,
                amount: commission,
                status: "completed",
                txHash: `ref_comm_${userBot.id}_${Date.now()}`,
              });
            }
          }
        }
      }
      
      res.json({
        id: userBot.id,
        status: "completed",
        investment: userBot.investment,
        profit,
        total: userBot.investment + profit
      });
    } catch (error) {
      next(error);
    }
  });
}