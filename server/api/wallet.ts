import { Express, Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { insertWalletSchema, insertTransactionSchema } from "@shared/schema";
import { randomBytes } from "crypto";

// Auth middleware
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}

export function setupWalletRoutes(app: Express) {
  // Get user's wallets
  app.get('/api/wallets', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wallets = await storage.getWalletsByUserId(req.user!.id);
      res.json(wallets);
    } catch (error) {
      next(error);
    }
  });

  // Get user's transactions
  app.get('/api/transactions', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transactions = await storage.getTransactionsByUserId(req.user!.id);
      res.json(transactions);
    } catch (error) {
      next(error);
    }
  });

  // Generate deposit address for a currency
  app.post('/api/wallets/generate-address', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currency } = req.body;
      
      if (!currency) {
        return res.status(400).json({ message: "Currency is required" });
      }
      
      // Find or create wallet for this currency
      let wallet = await storage.getWalletByUserAndCurrency(req.user!.id, currency);
      
      if (!wallet) {
        wallet = await storage.createWallet({
          userId: req.user!.id,
          currency,
          address: "",
          balance: 0
        });
      }
      
      // If wallet doesn't have an address, generate one
      if (!wallet.address) {
        // In a real app, this would be replaced with actual crypto address generation
        // via integration with crypto payment providers
        const generatedAddress = generateMockAddress(currency);
        wallet = await storage.updateWallet(wallet.id, { address: generatedAddress });
      }
      
      res.json({ address: wallet.address });
    } catch (error) {
      next(error);
    }
  });

  // Get deposit address for a currency
  app.get('/api/wallets/address/:currency', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currency } = req.params;
      
      const wallet = await storage.getWalletByUserAndCurrency(req.user!.id, currency);
      
      if (!wallet || !wallet.address) {
        return res.json({ address: "" });
      }
      
      res.json({ address: wallet.address });
    } catch (error) {
      next(error);
    }
  });

  // Process withdrawal
  app.post('/api/wallets/withdraw', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currency, amount, address } = req.body;
      
      if (!currency || !amount || !address) {
        return res.status(400).json({ message: "Currency, amount, and address are required" });
      }
      
      if (amount <= 0) {
        return res.status(400).json({ message: "Amount must be greater than 0" });
      }
      
      // Check if user has KYC verification
      if (req.user!.kycLevel < 1) {
        return res.status(403).json({ message: "KYC verification required for withdrawals" });
      }
      
      // Check if user has sufficient balance
      const wallet = await storage.getWalletByUserAndCurrency(req.user!.id, currency);
      
      if (!wallet) {
        return res.status(404).json({ message: `${currency} wallet not found` });
      }
      
      // Get withdrawal fee
      const settings = await storage.getSettings();
      const withdrawalFee = settings?.withdrawalFee || 0.2; // Default 20%
      
      // Calculate fees and final amount
      const feeAmount = amount * withdrawalFee;
      const finalAmount = amount + feeAmount; // User pays amount + fee
      
      if (wallet.balance < finalAmount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      
      // Create withdrawal transaction
      const transaction = await storage.createTransaction({
        userId: req.user!.id,
        type: "withdrawal",
        currency,
        amount: amount,
        status: "pending",
        txHash: generateMockTxHash(),
      });
      
      // Update wallet balance
      await storage.updateWallet(wallet.id, { 
        balance: wallet.balance - finalAmount 
      });
      
      // In a real application:
      // 1. Submit withdrawal request to crypto payment processor
      // 2. Listen for webhooks to update transaction status
      
      // For this example, just mark it as completed after 5 seconds
      setTimeout(async () => {
        await storage.updateTransaction(transaction.id, { status: "completed" });
      }, 5000);
      
      res.json({
        id: transaction.id,
        amount,
        fee: feeAmount,
        total: finalAmount,
        status: transaction.status
      });
    } catch (error) {
      next(error);
    }
  });

  // Process deposit (in a real app, this would be triggered by a webhook)
  app.post('/api/wallets/deposit', async (req: Request, res: Response, next: NextFunction) => {
    try {
      // This is simplified for demonstration
      // In a real app, you would validate the webhook signature and check the transaction details
      
      const { userId, currency, amount, txHash } = req.body;
      
      if (!userId || !currency || !amount || !txHash) {
        return res.status(400).json({ message: "Required fields missing" });
      }
      
      // Find or create wallet
      let wallet = await storage.getWalletByUserAndCurrency(userId, currency);
      
      if (!wallet) {
        wallet = await storage.createWallet({
          userId,
          currency,
          address: "",
          balance: 0
        });
      }
      
      // Create deposit transaction
      const transaction = await storage.createTransaction({
        userId,
        type: "deposit",
        currency,
        amount,
        status: "completed",
        txHash,
      });
      
      // Update wallet balance
      await storage.updateWallet(wallet.id, { 
        balance: wallet.balance + amount 
      });
      
      res.json({ success: true, transaction });
    } catch (error) {
      next(error);
    }
  });

  // Simulate deposit (for testing only)
  app.post('/api/wallets/simulate-deposit', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currency, amount } = req.body;
      
      if (!currency || !amount || amount <= 0) {
        return res.status(400).json({ message: "Currency and a positive amount are required" });
      }
      
      // Find or create wallet
      let wallet = await storage.getWalletByUserAndCurrency(req.user!.id, currency);
      
      if (!wallet) {
        wallet = await storage.createWallet({
          userId: req.user!.id,
          currency,
          address: "",
          balance: 0
        });
      }
      
      // Create deposit transaction
      const transaction = await storage.createTransaction({
        userId: req.user!.id,
        type: "deposit",
        currency,
        amount,
        status: "completed",
        txHash: generateMockTxHash(),
      });
      
      // Update wallet balance
      await storage.updateWallet(wallet.id, { 
        balance: wallet.balance + amount 
      });
      
      res.json({ success: true, transaction });
    } catch (error) {
      next(error);
    }
  });
}

// Helper function to generate a mock address based on currency
function generateMockAddress(currency: string): string {
  const randomHex = randomBytes(20).toString('hex');
  
  if (currency.includes('BTC')) {
    return `bc1${randomHex.substring(0, 38)}`;
  } else if (currency.includes('ETH') || currency.includes('BEP20') || currency.includes('ERC20')) {
    return `0x${randomHex.substring(0, 40)}`;
  } else if (currency.includes('TRC20')) {
    return `T${randomHex.substring(0, 33)}`;
  } else if (currency.includes('SOL')) {
    return randomHex.substring(0, 44);
  } else {
    return randomHex.substring(0, 42);
  }
}

// Helper function to generate a mock transaction hash
function generateMockTxHash(): string {
  return `0x${randomBytes(32).toString('hex')}`;
}
