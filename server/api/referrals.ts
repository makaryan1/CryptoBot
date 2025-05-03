import { Express, Request, Response, NextFunction } from "express";
import { storage } from "../storage";

// Auth middleware
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}

export function setupReferralRoutes(app: Express) {
  // Get user's referral info
  app.get('/api/referrals/info', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      
      // Get all users who have this user as their referrer
      const referrals = await storage.getReferrals(user.id);
      
      // Count active referrals (with active bots or recent transactions)
      const activeReferrals = referrals.filter(referral => {
        // Get user's bots
        const userBots = Array.from(storage['userBotsData'].values())
          .filter(ub => ub.userId === referral.id && ub.status === 'active');
          
        // Check if user has active bots
        return userBots.length > 0;
      }).length;
      
      // Calculate total earnings from referrals
      const transactions = Array.from(storage['transactionsData'].values())
        .filter(tx => tx.userId === user.id && tx.type === 'referral_commission' && tx.status === 'completed');
        
      const totalEarnings = transactions.reduce((sum, tx) => sum + tx.amount, 0);
      
      // Determine referral level based on active referrals
      let referralLevel = 'bronze'; // Default
      if (activeReferrals >= 15) {
        referralLevel = 'gold';
      } else if (activeReferrals >= 5) {
        referralLevel = 'silver';
      }
      
      // Update user's referral level if needed
      if (referralLevel !== user.referralLevel) {
        await storage.updateUser(user.id, { referralLevel });
      }
      
      // Generate frontend URL (in a real app, get from config)
      const frontendUrl = process.env.FRONTEND_URL || `http://localhost:${process.env.PORT || 3000}`;
      const referralLink = `${frontendUrl}?ref=${user.referralCode}`;
      
      res.json({
        referralCode: user.referralCode,
        referralLink,
        referralLevel,
        referralCount: referrals.length,
        activeReferrals,
        totalEarnings
      });
    } catch (error) {
      next(error);
    }
  });

  // Get user's referrals list
  app.get('/api/referrals', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get all users who have this user as their referrer
      const referrals = await storage.getReferrals(req.user!.id);
      
      // Enrich with additional information
      const enrichedReferrals = referrals.map(referral => {
        // Get user's bots
        const userBots = Array.from(storage['userBotsData'].values())
          .filter(ub => ub.userId === referral.id && ub.status === 'active');
        
        // Calculate total earnings from this referral
        const transactions = Array.from(storage['transactionsData'].values())
          .filter(tx => 
            tx.userId === req.user!.id && 
            tx.type === 'referral_commission' && 
            tx.status === 'completed'
          );
          
        const totalEarnings = transactions.reduce((sum, tx) => sum + tx.amount, 0);
        
        return {
          id: referral.id,
          email: referral.email,
          fullName: referral.fullName,
          isActive: userBots.length > 0,
          totalEarnings,
          joinedDate: referral.createdAt
        };
      });
      
      res.json(enrichedReferrals);
    } catch (error) {
      next(error);
    }
  });

  // Register with referral code
  app.post('/api/register/referral', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, confirmPassword, referralCode } = req.body;
      
      if (!email || !password || !confirmPassword) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords don't match" });
      }
      
      // Check if referral code is valid
      if (referralCode) {
        const referrer = Array.from(storage['usersData'].values())
          .find(user => user.referralCode === referralCode);
          
        if (!referrer) {
          return res.status(400).json({ message: "Invalid referral code" });
        }
        
        // Set referrer ID
        req.body.referrerId = referrer.id;
      }
      
      // Forward to regular registration
      res.redirect(307, '/api/register');
    } catch (error) {
      next(error);
    }
  });
}