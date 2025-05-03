import { 
  users, type User, type InsertUser,
  kyc, type Kyc, type InsertKyc,
  wallets, type Wallet, type InsertWallet,
  transactions, type Transaction, type InsertTransaction,
  bots, type Bot, type InsertBot,
  userBots, type UserBot, type InsertUserBot,
  supportTickets, type SupportTicket, type InsertSupportTicket,
  supportMessages, type SupportMessage, type InsertSupportMessage,
  notifications, type Notification, type InsertNotification,
  settings, type Settings
} from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db, pool } from "./db";
import { eq, and, asc, desc, isNull } from "drizzle-orm";
import { IStorage } from "./storage";

const PostgresStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresStore({
      pool, 
      createTableIfMissing: true,
      tableName: 'session'
    });
    
    // Initialize database with bots if needed
    this.initializeBots();
    
    // Initialize settings if needed
    this.initializeSettings();
  }
  
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const [updatedUser] = await db.update(users)
      .set({...data, updatedAt: new Date().toISOString()})
      .where(eq(users.id, id))
      .returning();
      
    if (!updatedUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    return updatedUser;
  }
  
  async getKyc(id: number): Promise<Kyc | undefined> {
    const [kycDoc] = await db.select().from(kyc).where(eq(kyc.id, id));
    return kycDoc;
  }
  
  async getKycByUserId(userId: number): Promise<Kyc[]> {
    return await db.select().from(kyc).where(eq(kyc.userId, userId));
  }
  
  async createKyc(kycData: InsertKyc): Promise<Kyc> {
    const [newKyc] = await db.insert(kyc).values(kycData).returning();
    return newKyc;
  }
  
  async updateKyc(id: number, data: Partial<Kyc>): Promise<Kyc> {
    const [updatedKyc] = await db.update(kyc)
      .set({...data, updatedAt: new Date().toISOString()})
      .where(eq(kyc.id, id))
      .returning();
      
    if (!updatedKyc) {
      throw new Error(`KYC document with ID ${id} not found`);
    }
    
    return updatedKyc;
  }
  
  async getWallet(id: number): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.id, id));
    return wallet;
  }
  
  async getWalletByUserAndCurrency(userId: number, currency: string): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(
      and(
        eq(wallets.userId, userId),
        eq(wallets.currency, currency)
      )
    );
    return wallet;
  }
  
  async getWalletsByUserId(userId: number): Promise<Wallet[]> {
    return await db.select().from(wallets).where(eq(wallets.userId, userId));
  }
  
  async createWallet(walletData: InsertWallet): Promise<Wallet> {
    const [newWallet] = await db.insert(wallets).values({
      ...walletData,
      balance: 0 // Always start with zero balance
    }).returning();
    return newWallet;
  }
  
  async updateWallet(id: number, data: Partial<Wallet>): Promise<Wallet> {
    const [updatedWallet] = await db.update(wallets)
      .set({...data, updatedAt: new Date().toISOString()})
      .where(eq(wallets.id, id))
      .returning();
      
    if (!updatedWallet) {
      throw new Error(`Wallet with ID ${id} not found`);
    }
    
    return updatedWallet;
  }
  
  async getTransaction(id: number): Promise<Transaction | undefined> {
    const [tx] = await db.select().from(transactions).where(eq(transactions.id, id));
    return tx;
  }
  
  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return await db.select().from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  }
  
  async createTransaction(txData: InsertTransaction): Promise<Transaction> {
    const [newTx] = await db.insert(transactions).values({
      ...txData,
      status: "pending" // Default status
    }).returning();
    return newTx;
  }
  
  async updateTransaction(id: number, data: Partial<Transaction>): Promise<Transaction> {
    const [updatedTx] = await db.update(transactions)
      .set({...data, updatedAt: new Date().toISOString()})
      .where(eq(transactions.id, id))
      .returning();
      
    if (!updatedTx) {
      throw new Error(`Transaction with ID ${id} not found`);
    }
    
    return updatedTx;
  }
  
  async getBot(id: number): Promise<Bot | undefined> {
    const [bot] = await db.select().from(bots).where(eq(bots.id, id));
    return bot;
  }
  
  async getAllBots(): Promise<Bot[]> {
    return await db.select().from(bots);
  }
  
  async createBot(botData: InsertBot): Promise<Bot> {
    const [newBot] = await db.insert(bots).values({
      ...botData,
      enabled: true // Default to enabled
    }).returning();
    return newBot;
  }
  
  async updateBot(id: number, data: Partial<Bot>): Promise<Bot> {
    const [updatedBot] = await db.update(bots)
      .set({...data, updatedAt: new Date().toISOString()})
      .where(eq(bots.id, id))
      .returning();
      
    if (!updatedBot) {
      throw new Error(`Bot with ID ${id} not found`);
    }
    
    return updatedBot;
  }
  
  async deleteBot(id: number): Promise<void> {
    const result = await db.delete(bots).where(eq(bots.id, id)).returning({id: bots.id});
    
    if (result.length === 0) {
      throw new Error(`Bot with ID ${id} not found`);
    }
  }
  
  async getUserBot(id: number): Promise<UserBot | undefined> {
    const [userBot] = await db.select().from(userBots).where(eq(userBots.id, id));
    return userBot;
  }
  
  async getUserBotsByUserId(userId: number): Promise<UserBot[]> {
    return await db.select().from(userBots)
      .where(eq(userBots.userId, userId))
      .orderBy(desc(userBots.createdAt));
  }
  
  async createUserBot(userBotData: InsertUserBot): Promise<UserBot> {
    const [newUserBot] = await db.insert(userBots).values({
      ...userBotData,
      status: "active", // Default status
      startedAt: new Date().toISOString()
    }).returning();
    return newUserBot;
  }
  
  async updateUserBot(id: number, data: Partial<UserBot>): Promise<UserBot> {
    const [updatedUserBot] = await db.update(userBots)
      .set({...data, updatedAt: new Date().toISOString()})
      .where(eq(userBots.id, id))
      .returning();
      
    if (!updatedUserBot) {
      throw new Error(`UserBot with ID ${id} not found`);
    }
    
    return updatedUserBot;
  }
  
  async deleteUserBot(id: number): Promise<void> {
    const result = await db.delete(userBots).where(eq(userBots.id, id)).returning({id: userBots.id});
    
    if (result.length === 0) {
      throw new Error(`UserBot with ID ${id} not found`);
    }
  }
  
  async getSupportTicket(id: number): Promise<SupportTicket | undefined> {
    const [ticket] = await db.select().from(supportTickets).where(eq(supportTickets.id, id));
    return ticket;
  }
  
  async getSupportTicketsByUserId(userId: number): Promise<SupportTicket[]> {
    return await db.select().from(supportTickets)
      .where(eq(supportTickets.userId, userId))
      .orderBy(desc(supportTickets.createdAt));
  }
  
  async createSupportTicket(ticketData: InsertSupportTicket): Promise<SupportTicket> {
    const [newTicket] = await db.insert(supportTickets).values({
      ...ticketData,
      status: "open" // Default status
    }).returning();
    return newTicket;
  }
  
  async updateSupportTicket(id: number, data: Partial<SupportTicket>): Promise<SupportTicket> {
    const [updatedTicket] = await db.update(supportTickets)
      .set({...data, updatedAt: new Date().toISOString()})
      .where(eq(supportTickets.id, id))
      .returning();
      
    if (!updatedTicket) {
      throw new Error(`Support ticket with ID ${id} not found`);
    }
    
    return updatedTicket;
  }
  
  async getSupportMessages(ticketId: number): Promise<SupportMessage[]> {
    return await db.select().from(supportMessages)
      .where(eq(supportMessages.ticketId, ticketId))
      .orderBy(asc(supportMessages.createdAt));
  }
  
  async createSupportMessage(messageData: InsertSupportMessage): Promise<SupportMessage> {
    const [newMessage] = await db.insert(supportMessages).values(messageData).returning();
    return newMessage;
  }
  
  async getNotification(id: number): Promise<Notification | undefined> {
    const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
    return notification;
  }
  
  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }
  
  async getGlobalNotifications(): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(
        and(
          isNull(notifications.userId),
          eq(notifications.active, true)
        )
      )
      .orderBy(desc(notifications.createdAt));
  }
  
  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values({
      ...notificationData,
      active: true // Default to active
    }).returning();
    return newNotification;
  }
  
  async updateNotification(id: number, data: Partial<Notification>): Promise<Notification> {
    const [updatedNotification] = await db.update(notifications)
      .set({...data, updatedAt: new Date().toISOString()})
      .where(eq(notifications.id, id))
      .returning();
      
    if (!updatedNotification) {
      throw new Error(`Notification with ID ${id} not found`);
    }
    
    return updatedNotification;
  }
  
  async getSettings(): Promise<Settings | undefined> {
    const [setting] = await db.select().from(settings);
    return setting;
  }
  
  async updateSettings(data: Partial<Settings>): Promise<Settings> {
    // Check if settings exist first
    const existingSettings = await this.getSettings();
    
    if (!existingSettings) {
      // Create settings if they don't exist
      const [newSettings] = await db.insert(settings).values({
        ...data,
        id: 1 // Force ID to be 1 for settings
      }).returning();
      return newSettings;
    }
    
    // Update existing settings
    const [updatedSettings] = await db.update(settings)
      .set({...data, updatedAt: new Date().toISOString()})
      .where(eq(settings.id, 1))
      .returning();
      
    return updatedSettings;
  }
  
  async getReferrals(referrerId: number): Promise<User[]> {
    return await db.select().from(users).where(eq(users.referrerId, referrerId));
  }
  
  private async initializeBots() {
    // Check if we already have bots
    const existingBots = await this.getAllBots();
    if (existingBots.length > 0) {
      return; // Bots already exist, don't create them again
    }
    
    // Create initial bot data
    const initialBots: InsertBot[] = [
      {
        name: "DCA Master",
        description: "Dollar-cost averaging strategy that buys small amounts at regular intervals to reduce the impact of volatility.",
        profitRange: "5-15%",
        riskLevel: "low",
        icon: "chart-line",
      },
      {
        name: "Trend Rider",
        description: "Follows market trends and makes trades based on momentum indicators for medium-term gains.",
        profitRange: "10-25%",
        riskLevel: "medium",
        icon: "trending-up",
      },
      {
        name: "Flash Trader",
        description: "High-frequency trading bot that capitalizes on small price movements with rapid trades.",
        profitRange: "15-40%",
        riskLevel: "high",
        icon: "zap",
      },
      {
        name: "Arbitrage Hunter",
        description: "Exploits price differences between exchanges to generate consistent profits with minimal risk.",
        profitRange: "3-10%",
        riskLevel: "very-low",
        icon: "shuffle",
      },
      {
        name: "Grid Maestro",
        description: "Places a grid of buy and sell orders to profit from price oscillations in sideways markets.",
        profitRange: "8-20%",
        riskLevel: "medium",
        icon: "grid",
      },
      {
        name: "HODL Enhancer",
        description: "Long-term strategy that holds core positions while enhancing returns through strategic rebalancing.",
        profitRange: "7-18%",
        riskLevel: "low",
        icon: "inbox",
      },
      {
        name: "Volatility Harvester",
        description: "Thrives during market turbulence by capitalizing on extreme price movements in either direction.",
        profitRange: "20-50%",
        riskLevel: "very-high",
        icon: "activity",
      },
      {
        name: "AI Predictor",
        description: "Uses machine learning algorithms to predict market movements based on historical data patterns.",
        profitRange: "12-35%",
        riskLevel: "high",
        icon: "cpu",
      }
    ];
    
    // Add bots to database
    await db.insert(bots).values(
      initialBots.map(bot => ({
        ...bot,
        enabled: true
      }))
    );
  }
  
  private async initializeSettings() {
    // Check if settings exist
    const existingSettings = await this.getSettings();
    
    if (!existingSettings) {
      // Create default settings
      await db.insert(settings).values({
        id: 1,
        withdrawalFee: 0.2,
        bronzeFee: 0.01,
        silverFee: 0.02,
        goldFee: 0.05,
        maintenanceMode: false,
        botsEnabled: true
      });
    }
  }
}