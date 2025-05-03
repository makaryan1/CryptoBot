import { Express, Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { insertSupportTicketSchema, insertSupportMessageSchema } from "@shared/schema";

// Auth middleware
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}

export function setupSupportRoutes(app: Express) {
  // Get user's support tickets
  app.get('/api/support/tickets', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tickets = await storage.getSupportTicketsByUserId(req.user!.id);
      res.json(tickets);
    } catch (error) {
      next(error);
    }
  });

  // Create a new support ticket
  app.post('/api/support/tickets', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { subject, category, message } = req.body;
      
      if (!subject || !category || !message) {
        return res.status(400).json({ message: "Subject, category, and message are required" });
      }
      
      // Create ticket
      const ticket = await storage.createSupportTicket({
        userId: req.user!.id,
        subject,
        category,
        status: 'open',
      });
      
      // Create initial message
      await storage.createSupportMessage({
        ticketId: ticket.id,
        userId: req.user!.id,
        message,
        isAdmin: false,
      });
      
      res.status(201).json(ticket);
    } catch (error) {
      next(error);
    }
  });

  // Get messages for a ticket
  app.get('/api/support/tickets/:id/messages', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticketId = parseInt(req.params.id);
      
      // Check if ticket exists and belongs to the user
      const ticket = await storage.getSupportTicket(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      if (ticket.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const messages = await storage.getSupportMessages(ticketId);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  });

  // Reply to a ticket
  app.post('/api/support/tickets/:id/reply', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticketId = parseInt(req.params.id);
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      // Check if ticket exists and belongs to the user
      const ticket = await storage.getSupportTicket(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      if (ticket.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Check if ticket is closed
      if (ticket.status === 'closed') {
        return res.status(400).json({ message: "Cannot reply to a closed ticket" });
      }
      
      // Create message
      const messageObj = await storage.createSupportMessage({
        ticketId,
        userId: req.user!.id,
        message,
        isAdmin: false,
      });
      
      // Update ticket status to pending if it was open
      if (ticket.status === 'open') {
        await storage.updateSupportTicket(ticketId, { status: 'pending' });
      }
      
      res.status(201).json(messageObj);
    } catch (error) {
      next(error);
    }
  });

  // Close a ticket
  app.post('/api/support/tickets/:id/close', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticketId = parseInt(req.params.id);
      
      // Check if ticket exists and belongs to the user
      const ticket = await storage.getSupportTicket(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      if (ticket.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Update ticket status
      const updatedTicket = await storage.updateSupportTicket(ticketId, { status: 'closed' });
      
      res.json(updatedTicket);
    } catch (error) {
      next(error);
    }
  });

  // Get FAQ
  app.get('/api/support/faq', async (req: Request, res: Response, next: NextFunction) => {
    try {
      // This would typically come from a database, but for this example we'll hardcode it
      const faq = [
        {
          question: "How do I start using a trading bot?",
          answer: "To start using a trading bot, go to the 'Trading Bots' page, select a bot that matches your strategy, click 'Launch Bot', enter the investment amount, and confirm. The bot will automatically start trading based on its algorithm."
        },
        {
          question: "What fees are charged for withdrawals?",
          answer: "There is a 20% fee on all withdrawals. This fee helps maintain the platform and its services. The fee is automatically calculated and deducted when you process a withdrawal."
        },
        {
          question: "How long does the KYC verification process take?",
          answer: "Level 1 KYC verification usually takes 1-2 business days. Level 2 verification can take 2-3 business days due to the additional checks required. You'll receive an email notification once your verification is complete."
        },
        {
          question: "How does the referral program work?",
          answer: "When you refer someone to our platform using your unique referral link, you earn a percentage of their trading profits. Bronze level earns 1%, Silver 2%, and Gold 5%. Your level increases based on the number of active referrals you have."
        },
        {
          question: "What cryptocurrencies are supported for deposits?",
          answer: "We support over 20 cryptocurrencies including USDT (TRC20, BEP20, ERC20), BTC, ETH, TRX, SOL, APT, BNB, ADA, XRP, and more. To make a deposit, go to the Wallet page and select your preferred currency."
        },
        {
          question: "How are bot profits calculated and distributed?",
          answer: "Bot profits are calculated based on the trading strategy and market conditions. The profits are automatically added to your wallet as they are realized. You can view your profit history in the Transactions page."
        },
      ];
      
      res.json(faq);
    } catch (error) {
      next(error);
    }
  });
}