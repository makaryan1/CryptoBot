import { Express, Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { Bot, InsertBot, insertBotSchema } from "@shared/schema";

// Admin middleware
function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  
  next();
}

export function setupAdminRoutes(app: Express) {
  // Get platform settings
  app.get('/api/admin/settings', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      next(error);
    }
  });

  // Update maintenance mode
  app.post('/api/admin/settings/maintenance', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { value } = req.body;
      
      if (typeof value !== 'boolean') {
        return res.status(400).json({ message: "Value must be a boolean" });
      }
      
      const settings = await storage.updateSettings({ maintenanceMode: value });
      res.json(settings);
    } catch (error) {
      next(error);
    }
  });

  // Update bots enabled setting
  app.post('/api/admin/settings/bots-enabled', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { value } = req.body;
      
      if (typeof value !== 'boolean') {
        return res.status(400).json({ message: "Value must be a boolean" });
      }
      
      const settings = await storage.updateSettings({ botsEnabled: value });
      res.json(settings);
    } catch (error) {
      next(error);
    }
  });

  // Update commission settings
  app.post('/api/admin/settings/commissions', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { withdrawalFee, bronzeFee, silverFee, goldFee } = req.body;
      
      const updates: Record<string, number> = {};
      
      if (typeof withdrawalFee === 'number' && withdrawalFee >= 0 && withdrawalFee <= 1) {
        updates.withdrawalFee = withdrawalFee;
      }
      
      if (typeof bronzeFee === 'number' && bronzeFee >= 0 && bronzeFee <= 1) {
        updates.bronzeFee = bronzeFee;
      }
      
      if (typeof silverFee === 'number' && silverFee >= 0 && silverFee <= 1) {
        updates.silverFee = silverFee;
      }
      
      if (typeof goldFee === 'number' && goldFee >= 0 && goldFee <= 1) {
        updates.goldFee = goldFee;
      }
      
      const settings = await storage.updateSettings(updates);
      res.json(settings);
    } catch (error) {
      next(error);
    }
  });

  // Get platform stats
  app.get('/api/admin/stats', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = Array.from(storage['usersData'].values());
      const userBots = Array.from(storage['userBotsData'].values());
      const transactions = Array.from(storage['transactionsData'].values());
      
      const totalUsers = users.length;
      
      // Consider a user active if they have logged in within the last 24 hours
      const activeUsers = users.filter(user => {
        // This is a placeholder - in a real app, you'd have a lastLogin field
        return true;
      }).length;
      
      const activeBots = userBots.filter(bot => bot.status === 'active').length;
      const totalBots = userBots.length;
      
      // Calculate total balance across all wallets
      let totalBalance = 0;
      const wallets = Array.from(storage['walletsData'].values());
      wallets.forEach(wallet => {
        // In a real app, you'd convert all currencies to a common unit like USD
        totalBalance += wallet.balance;
      });
      
      // Calculate total profit (platform fees, withdrawal fees)
      let totalProfit = 0;
      transactions.forEach(tx => {
        if (tx.type === 'withdrawal' && tx.status === 'completed') {
          // Assume 20% withdrawal fee
          totalProfit += tx.amount * 0.2;
        }
      });
      
      res.json({
        totalUsers,
        activeUsers,
        totalBots,
        activeBots,
        totalBalance,
        totalProfit
      });
    } catch (error) {
      next(error);
    }
  });

  // Get profit breakdown
  app.get('/api/admin/profits', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transactions = Array.from(storage['transactionsData'].values());
      
      let withdrawalFees = 0;
      let botFees = 0;
      let referralFees = 0;
      
      transactions.forEach(tx => {
        if (tx.type === 'withdrawal' && tx.status === 'completed') {
          withdrawalFees += tx.amount * 0.2; // Assuming 20% withdrawal fee
        } else if (tx.type === 'bot_profit' && tx.status === 'completed') {
          botFees += tx.amount * 0.1; // Assuming 10% platform fee on bot profits
        } else if (tx.type === 'referral_commission' && tx.status === 'completed') {
          referralFees += tx.amount;
        }
      });
      
      const totalFees = withdrawalFees + botFees + referralFees;
      
      res.json({
        totalFees,
        withdrawalFees,
        botFees,
        referralFees
      });
    } catch (error) {
      next(error);
    }
  });

  // Get system logs
  app.get('/api/admin/logs', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      // This is a placeholder - in a real app, you'd fetch actual system logs
      const logs = [
        {
          timestamp: new Date(Date.now() - 60000).toISOString(),
          level: 'info',
          message: 'User login successful',
        },
        {
          timestamp: new Date(Date.now() - 120000).toISOString(),
          level: 'warn',
          message: 'Failed login attempt',
        },
        {
          timestamp: new Date(Date.now() - 180000).toISOString(),
          level: 'error',
          message: 'Database connection error',
        },
      ];
      
      res.json(logs);
    } catch (error) {
      next(error);
    }
  });

  // Get all bots (for admin)
  app.get('/api/admin/bots', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bots = await storage.getAllBots();
      res.json(bots);
    } catch (error) {
      next(error);
    }
  });

  // Create a new bot
  app.post('/api/admin/bots', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      const botData = insertBotSchema.parse(req.body);
      
      const bot = await storage.createBot({
        ...botData,
        enabled: req.body.enabled !== undefined ? req.body.enabled : true
      });
      
      res.status(201).json(bot);
    } catch (error) {
      next(error);
    }
  });

  // Update a bot
  app.patch('/api/admin/bots/:id', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const botId = parseInt(req.params.id);
      
      const bot = await storage.getBot(botId);
      if (!bot) {
        return res.status(404).json({ message: "Bot not found" });
      }
      
      const updatedBot = await storage.updateBot(botId, req.body);
      res.json(updatedBot);
    } catch (error) {
      next(error);
    }
  });

  // Toggle bot enabled status
  app.patch('/api/admin/bots/:id/toggle', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const botId = parseInt(req.params.id);
      const { enabled } = req.body;
      
      if (typeof enabled !== 'boolean') {
        return res.status(400).json({ message: "Enabled must be a boolean" });
      }
      
      const bot = await storage.getBot(botId);
      if (!bot) {
        return res.status(404).json({ message: "Bot not found" });
      }
      
      const updatedBot = await storage.updateBot(botId, { enabled });
      res.json(updatedBot);
    } catch (error) {
      next(error);
    }
  });

  // Delete a bot
  app.delete('/api/admin/bots/:id', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const botId = parseInt(req.params.id);
      
      const bot = await storage.getBot(botId);
      if (!bot) {
        return res.status(404).json({ message: "Bot not found" });
      }
      
      // Check if any user is using this bot
      const userBots = Array.from(storage['userBotsData'].values());
      const botInUse = userBots.some(ub => ub.botId === botId && ub.status === 'active');
      
      if (botInUse) {
        return res.status(400).json({ message: "Cannot delete a bot that is currently in use" });
      }
      
      await storage.deleteBot(botId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Get all users (for admin)
  app.get('/api/admin/users', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = Array.from(storage['usersData'].values());
      
      // Enrich user data with additional information
      const enrichedUsers = users.map(user => {
        // Get user's bots
        const userBots = Array.from(storage['userBotsData'].values())
          .filter(ub => ub.userId === user.id && ub.status === 'active');
        
        // Get user's wallets
        const wallets = Array.from(storage['walletsData'].values())
          .filter(w => w.userId === user.id);
        
        // Calculate total balance
        const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
        
        return {
          ...user,
          activeBotsCount: userBots.length,
          totalBalance,
          lastLogin: new Date().toISOString(), // Placeholder
          ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` // Placeholder
        };
      });
      
      res.json(enrichedUsers);
    } catch (error) {
      next(error);
    }
  });

  // Block/unblock user
  app.post('/api/admin/users/:id/block', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id);
      const { blocked } = req.body;
      
      if (typeof blocked !== 'boolean') {
        return res.status(400).json({ message: "Blocked must be a boolean" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // In this example, we're using isAdmin field to represent blocked status
      // In a real app, you'd have a separate field for this
      const updatedUser = await storage.updateUser(userId, { isAdmin: blocked });
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  });

  // Send personal notification to a user
  app.post('/api/admin/users/:id/notification', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id);
      const { message } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const notification = await storage.createNotification({
        userId,
        message,
        type: 'personal',
      });
      
      res.status(201).json(notification);
    } catch (error) {
      next(error);
    }
  });

  // Send global notification to all users
  app.post('/api/admin/notifications', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }
      
      const notification = await storage.createNotification({
        userId: null, // null userId means global notification
        message,
        type: 'global',
      });
      
      res.status(201).json(notification);
    } catch (error) {
      next(error);
    }
  });

  // Get all KYC documents
  app.get('/api/admin/kyc', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const kyc = Array.from(storage['kycData'].values());
      
      // Enrich KYC data with user information
      const enrichedKyc = await Promise.all(kyc.map(async (kycDoc) => {
        const user = await storage.getUser(kycDoc.userId);
        return {
          ...kycDoc,
          user: user ? { 
            id: user.id, 
            email: user.email, 
            fullName: user.fullName 
          } : { id: 0, email: 'unknown', fullName: null },
          documentUrl: `/api/admin/kyc/${kycDoc.id}/document` // Placeholder URL
        };
      }));
      
      res.json(enrichedKyc);
    } catch (error) {
      next(error);
    }
  });

  // Approve KYC
  app.post('/api/admin/kyc/:id/approve', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const kycId = parseInt(req.params.id);
      
      const kyc = await storage.getKyc(kycId);
      if (!kyc) {
        return res.status(404).json({ message: "KYC document not found" });
      }
      
      const updatedKyc = await storage.updateKyc(kycId, { 
        status: 'approved'
      });
      
      // Update user's KYC level if this approval increases it
      const user = await storage.getUser(kyc.userId);
      if (user && kyc.level > user.kycLevel) {
        await storage.updateUser(user.id, { kycLevel: kyc.level });
      }
      
      // Create a notification for the user
      await storage.createNotification({
        userId: kyc.userId,
        message: `Your KYC level ${kyc.level} verification has been approved!`,
        type: 'kyc',
      });
      
      res.json(updatedKyc);
    } catch (error) {
      next(error);
    }
  });

  // Reject KYC
  app.post('/api/admin/kyc/:id/reject', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const kycId = parseInt(req.params.id);
      const { reason } = req.body;
      
      if (!reason || typeof reason !== 'string') {
        return res.status(400).json({ message: "Rejection reason is required" });
      }
      
      const kyc = await storage.getKyc(kycId);
      if (!kyc) {
        return res.status(404).json({ message: "KYC document not found" });
      }
      
      const updatedKyc = await storage.updateKyc(kycId, { 
        status: 'rejected',
        rejectionReason: reason
      });
      
      // Create a notification for the user
      await storage.createNotification({
        userId: kyc.userId,
        message: `Your KYC level ${kyc.level} verification was rejected: ${reason}`,
        type: 'kyc',
      });
      
      res.json(updatedKyc);
    } catch (error) {
      next(error);
    }
  });
}