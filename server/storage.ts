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
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  
  // KYC operations
  getKyc(id: number): Promise<Kyc | undefined>;
  getKycByUserId(userId: number): Promise<Kyc[]>;
  createKyc(kyc: InsertKyc): Promise<Kyc>;
  updateKyc(id: number, data: Partial<Kyc>): Promise<Kyc>;
  
  // Wallet operations
  getWallet(id: number): Promise<Wallet | undefined>;
  getWalletByUserAndCurrency(userId: number, currency: string): Promise<Wallet | undefined>;
  getWalletsByUserId(userId: number): Promise<Wallet[]>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWallet(id: number, data: Partial<Wallet>): Promise<Wallet>;
  
  // Transaction operations
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, data: Partial<Transaction>): Promise<Transaction>;
  
  // Bot operations
  getBot(id: number): Promise<Bot | undefined>;
  getAllBots(): Promise<Bot[]>;
  createBot(bot: InsertBot): Promise<Bot>;
  updateBot(id: number, data: Partial<Bot>): Promise<Bot>;
  deleteBot(id: number): Promise<void>;
  
  // User Bot operations
  getUserBot(id: number): Promise<UserBot | undefined>;
  getUserBotsByUserId(userId: number): Promise<UserBot[]>;
  createUserBot(userBot: InsertUserBot): Promise<UserBot>;
  updateUserBot(id: number, data: Partial<UserBot>): Promise<UserBot>;
  deleteUserBot(id: number): Promise<void>;
  
  // Support Ticket operations
  getSupportTicket(id: number): Promise<SupportTicket | undefined>;
  getSupportTicketsByUserId(userId: number): Promise<SupportTicket[]>;
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  updateSupportTicket(id: number, data: Partial<SupportTicket>): Promise<SupportTicket>;
  
  // Support Message operations
  getSupportMessages(ticketId: number): Promise<SupportMessage[]>;
  createSupportMessage(message: InsertSupportMessage): Promise<SupportMessage>;
  
  // Notification operations
  getNotification(id: number): Promise<Notification | undefined>;
  getNotificationsByUserId(userId: number): Promise<Notification[]>;
  getGlobalNotifications(): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  updateNotification(id: number, data: Partial<Notification>): Promise<Notification>;
  
  // Settings operations
  getSettings(): Promise<Settings | undefined>;
  updateSettings(data: Partial<Settings>): Promise<Settings>;
  
  // Referrals
  getReferrals(referrerId: number): Promise<User[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private kycData: Map<number, Kyc>;
  private walletsData: Map<number, Wallet>;
  private transactionsData: Map<number, Transaction>;
  private botsData: Map<number, Bot>;
  private userBotsData: Map<number, UserBot>;
  private supportTicketsData: Map<number, SupportTicket>;
  private supportMessagesData: Map<number, SupportMessage>;
  private notificationsData: Map<number, Notification>;
  private settingsData: Settings | undefined;
  
  sessionStore: session.SessionStore;
  
  private userIdCounter: number = 1;
  private kycIdCounter: number = 1;
  private walletIdCounter: number = 1;
  private transactionIdCounter: number = 1;
  private botIdCounter: number = 1;
  private userBotIdCounter: number = 1;
  private ticketIdCounter: number = 1;
  private messageIdCounter: number = 1;
  private notificationIdCounter: number = 1;

  constructor() {
    this.usersData = new Map();
    this.kycData = new Map();
    this.walletsData = new Map();
    this.transactionsData = new Map();
    this.botsData = new Map();
    this.userBotsData = new Map();
    this.supportTicketsData = new Map();
    this.supportMessagesData = new Map();
    this.notificationsData = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // Initialize default settings
    this.settingsData = {
      id: 1,
      withdrawalFee: 0.2,
      bronzeFee: 0.01,
      silverFee: 0.02,
      goldFee: 0.05,
      maintenanceMode: false,
      botsEnabled: true,
      updatedAt: new Date().toISOString()
    };
    
    // Initialize sample bots
    this.initializeBots();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date().toISOString();
    const user: User = {
      ...userData,
      id,
      isEmailVerified: userData.isEmailVerified || false,
      isAdmin: userData.isAdmin || false,
      kycLevel: userData.kycLevel || 0,
      referralLevel: userData.referralLevel || "bronze",
      referralCode: userData.referralCode || "",
      createdAt: now,
      updatedAt: now
    };
    this.usersData.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    const updatedUser: User = {
      ...user,
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.usersData.set(id, updatedUser);
    return updatedUser;
  }
  
  // KYC operations
  async getKyc(id: number): Promise<Kyc | undefined> {
    return this.kycData.get(id);
  }
  
  async getKycByUserId(userId: number): Promise<Kyc[]> {
    return Array.from(this.kycData.values()).filter(
      (kyc) => kyc.userId === userId
    );
  }
  
  async createKyc(kycData: InsertKyc): Promise<Kyc> {
    const id = this.kycIdCounter++;
    const now = new Date().toISOString();
    const kyc: Kyc = {
      ...kycData,
      id,
      status: kycData.status || "pending",
      rejectionReason: kycData.rejectionReason || null,
      createdAt: now,
      updatedAt: now
    };
    this.kycData.set(id, kyc);
    return kyc;
  }
  
  async updateKyc(id: number, data: Partial<Kyc>): Promise<Kyc> {
    const kyc = await this.getKyc(id);
    if (!kyc) {
      throw new Error(`KYC with ID ${id} not found`);
    }
    
    const updatedKyc: Kyc = {
      ...kyc,
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.kycData.set(id, updatedKyc);
    
    // If KYC is approved, update user's KYC level
    if (data.status === "approved") {
      const user = await this.getUser(kyc.userId);
      if (user && kyc.level > user.kycLevel) {
        await this.updateUser(user.id, { kycLevel: kyc.level });
      }
    }
    
    return updatedKyc;
  }
  
  // Wallet operations
  async getWallet(id: number): Promise<Wallet | undefined> {
    return this.walletsData.get(id);
  }
  
  async getWalletByUserAndCurrency(userId: number, currency: string): Promise<Wallet | undefined> {
    return Array.from(this.walletsData.values()).find(
      (wallet) => wallet.userId === userId && wallet.currency === currency
    );
  }
  
  async getWalletsByUserId(userId: number): Promise<Wallet[]> {
    return Array.from(this.walletsData.values()).filter(
      (wallet) => wallet.userId === userId
    );
  }
  
  async createWallet(walletData: InsertWallet): Promise<Wallet> {
    const id = this.walletIdCounter++;
    const now = new Date().toISOString();
    const wallet: Wallet = {
      ...walletData,
      id,
      balance: walletData.balance || 0,
      createdAt: now,
      updatedAt: now
    };
    this.walletsData.set(id, wallet);
    return wallet;
  }
  
  async updateWallet(id: number, data: Partial<Wallet>): Promise<Wallet> {
    const wallet = await this.getWallet(id);
    if (!wallet) {
      throw new Error(`Wallet with ID ${id} not found`);
    }
    
    const updatedWallet: Wallet = {
      ...wallet,
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.walletsData.set(id, updatedWallet);
    return updatedWallet;
  }
  
  // Transaction operations
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactionsData.get(id);
  }
  
  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactionsData.values())
      .filter((tx) => tx.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async createTransaction(txData: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const now = new Date().toISOString();
    const transaction: Transaction = {
      ...txData,
      id,
      status: txData.status || "pending",
      createdAt: now,
      updatedAt: now
    };
    this.transactionsData.set(id, transaction);
    return transaction;
  }
  
  async updateTransaction(id: number, data: Partial<Transaction>): Promise<Transaction> {
    const transaction = await this.getTransaction(id);
    if (!transaction) {
      throw new Error(`Transaction with ID ${id} not found`);
    }
    
    const updatedTransaction: Transaction = {
      ...transaction,
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.transactionsData.set(id, updatedTransaction);
    return updatedTransaction;
  }
  
  // Bot operations
  async getBot(id: number): Promise<Bot | undefined> {
    return this.botsData.get(id);
  }
  
  async getAllBots(): Promise<Bot[]> {
    return Array.from(this.botsData.values());
  }
  
  async createBot(botData: InsertBot): Promise<Bot> {
    const id = this.botIdCounter++;
    const now = new Date().toISOString();
    const bot: Bot = {
      ...botData,
      id,
      enabled: true,
      createdAt: now,
      updatedAt: now
    };
    this.botsData.set(id, bot);
    return bot;
  }
  
  async updateBot(id: number, data: Partial<Bot>): Promise<Bot> {
    const bot = await this.getBot(id);
    if (!bot) {
      throw new Error(`Bot with ID ${id} not found`);
    }
    
    const updatedBot: Bot = {
      ...bot,
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.botsData.set(id, updatedBot);
    return updatedBot;
  }
  
  async deleteBot(id: number): Promise<void> {
    if (!this.botsData.has(id)) {
      throw new Error(`Bot with ID ${id} not found`);
    }
    this.botsData.delete(id);
  }
  
  // User Bot operations
  async getUserBot(id: number): Promise<UserBot | undefined> {
    return this.userBotsData.get(id);
  }
  
  async getUserBotsByUserId(userId: number): Promise<UserBot[]> {
    return Array.from(this.userBotsData.values()).filter(
      (userBot) => userBot.userId === userId
    );
  }
  
  async createUserBot(userBotData: InsertUserBot): Promise<UserBot> {
    const id = this.userBotIdCounter++;
    const now = new Date().toISOString();
    const userBot: UserBot = {
      ...userBotData,
      id,
      status: userBotData.status || "active",
      startedAt: now,
      createdAt: now,
      updatedAt: now
    };
    this.userBotsData.set(id, userBot);
    return userBot;
  }
  
  async updateUserBot(id: number, data: Partial<UserBot>): Promise<UserBot> {
    const userBot = await this.getUserBot(id);
    if (!userBot) {
      throw new Error(`User Bot with ID ${id} not found`);
    }
    
    const updatedUserBot: UserBot = {
      ...userBot,
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.userBotsData.set(id, updatedUserBot);
    return updatedUserBot;
  }
  
  async deleteUserBot(id: number): Promise<void> {
    if (!this.userBotsData.has(id)) {
      throw new Error(`User Bot with ID ${id} not found`);
    }
    this.userBotsData.delete(id);
  }
  
  // Support Ticket operations
  async getSupportTicket(id: number): Promise<SupportTicket | undefined> {
    return this.supportTicketsData.get(id);
  }
  
  async getSupportTicketsByUserId(userId: number): Promise<SupportTicket[]> {
    return Array.from(this.supportTicketsData.values())
      .filter((ticket) => ticket.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async createSupportTicket(ticketData: InsertSupportTicket): Promise<SupportTicket> {
    const id = this.ticketIdCounter++;
    const now = new Date().toISOString();
    const ticket: SupportTicket = {
      ...ticketData,
      id,
      status: ticketData.status || "open",
      createdAt: now,
      updatedAt: now
    };
    this.supportTicketsData.set(id, ticket);
    return ticket;
  }
  
  async updateSupportTicket(id: number, data: Partial<SupportTicket>): Promise<SupportTicket> {
    const ticket = await this.getSupportTicket(id);
    if (!ticket) {
      throw new Error(`Support Ticket with ID ${id} not found`);
    }
    
    const updatedTicket: SupportTicket = {
      ...ticket,
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.supportTicketsData.set(id, updatedTicket);
    return updatedTicket;
  }
  
  // Support Message operations
  async getSupportMessages(ticketId: number): Promise<SupportMessage[]> {
    return Array.from(this.supportMessagesData.values())
      .filter((message) => message.ticketId === ticketId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
  
  async createSupportMessage(messageData: InsertSupportMessage): Promise<SupportMessage> {
    const id = this.messageIdCounter++;
    const now = new Date().toISOString();
    const message: SupportMessage = {
      ...messageData,
      id,
      createdAt: now
    };
    this.supportMessagesData.set(id, message);
    
    // Update ticket's updatedAt timestamp
    const ticket = await this.getSupportTicket(messageData.ticketId);
    if (ticket) {
      await this.updateSupportTicket(ticket.id, { updatedAt: now });
    }
    
    return message;
  }
  
  // Notification operations
  async getNotification(id: number): Promise<Notification | undefined> {
    return this.notificationsData.get(id);
  }
  
  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return Array.from(this.notificationsData.values())
      .filter((notification) => notification.userId === userId && notification.active)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getGlobalNotifications(): Promise<Notification[]> {
    return Array.from(this.notificationsData.values())
      .filter((notification) => notification.userId === null && notification.active)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const id = this.notificationIdCounter++;
    const now = new Date().toISOString();
    const notification: Notification = {
      ...notificationData,
      id,
      active: true,
      createdAt: now,
      updatedAt: now
    };
    this.notificationsData.set(id, notification);
    return notification;
  }
  
  async updateNotification(id: number, data: Partial<Notification>): Promise<Notification> {
    const notification = await this.getNotification(id);
    if (!notification) {
      throw new Error(`Notification with ID ${id} not found`);
    }
    
    const updatedNotification: Notification = {
      ...notification,
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.notificationsData.set(id, updatedNotification);
    return updatedNotification;
  }
  
  // Settings operations
  async getSettings(): Promise<Settings | undefined> {
    return this.settingsData;
  }
  
  async updateSettings(data: Partial<Settings>): Promise<Settings> {
    if (!this.settingsData) {
      throw new Error("Settings not initialized");
    }
    
    this.settingsData = {
      ...this.settingsData,
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    return this.settingsData;
  }
  
  // Referrals
  async getReferrals(referrerId: number): Promise<User[]> {
    return Array.from(this.usersData.values()).filter(
      (user) => user.referrerId === referrerId
    );
  }
  
  // Initialize sample bots
  private initializeBots() {
    const botData: InsertBot[] = [
      {
        name: "DCA Bot",
        description: "Dollar Cost Averaging",
        profitRange: "8-15% monthly",
        riskLevel: "Medium",
        icon: "ri-currency-line"
      },
      {
        name: "Grid Trading",
        description: "Range-bound markets",
        profitRange: "10-20% monthly",
        riskLevel: "Medium-High",
        icon: "ri-compass-3-line"
      },
      {
        name: "MACD Scalper",
        description: "Technical indicator based",
        profitRange: "15-25% monthly",
        riskLevel: "High",
        icon: "ri-rocket-line"
      },
      {
        name: "Rebalancing",
        description: "Portfolio management",
        profitRange: "5-10% monthly",
        riskLevel: "Low",
        icon: "ri-recycle-line"
      },
      {
        name: "Futures Bot",
        description: "Leveraged trading",
        profitRange: "20-40% monthly",
        riskLevel: "Very High",
        icon: "ri-broadcast-line"
      },
      {
        name: "BTC/USDT Scalper",
        description: "Short-term Bitcoin trading",
        profitRange: "12-18% monthly",
        riskLevel: "Medium-High",
        icon: "ri-bitcoin-line"
      },
      {
        name: "ETH Long-Term",
        description: "Hold Ethereum for growth",
        profitRange: "10-25% monthly",
        riskLevel: "Medium",
        icon: "ri-ethereum-line"
      },
      {
        name: "USDT/BUSD Arbitrage",
        description: "Stablecoin price differences",
        profitRange: "3-8% monthly",
        riskLevel: "Low",
        icon: "ri-coin-line"
      }
    ];
    
    botData.forEach(bot => {
      this.createBot(bot);
    });
  }
}

import { DatabaseStorage } from "./database-storage";

export const storage = new DatabaseStorage();
