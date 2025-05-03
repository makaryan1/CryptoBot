import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  phoneNumber: text("phone_number"),
  country: text("country"),
  dateOfBirth: text("date_of_birth"),
  isEmailVerified: boolean("is_email_verified").default(false),
  isAdmin: boolean("is_admin").default(false),
  kycLevel: integer("kyc_level").default(0),
  referralCode: text("referral_code").unique(),
  referrerId: integer("referrer_id").references(() => users.id),
  referralLevel: text("referral_level").default("bronze"),
  telegram: text("telegram"),
  language: text("language").default("en"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// KYC schema
export const kyc = pgTable("kyc", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  documentType: text("document_type").notNull(),
  documentPath: text("document_path").notNull(),
  status: text("status").default("pending"),
  level: integer("level").notNull(),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wallet schema
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  currency: text("currency").notNull(),
  address: text("address"),
  balance: doublePrecision("balance").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transaction schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // deposit, withdrawal, bot_profit, referral
  currency: text("currency").notNull(),
  amount: doublePrecision("amount").notNull(),
  status: text("status").default("pending"),
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bot schema
export const bots = pgTable("bots", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  profitRange: text("profit_range").notNull(),
  riskLevel: text("risk_level").notNull(),
  enabled: boolean("enabled").default(true),
  icon: text("icon").notNull(),
  iconBg: text("icon_bg").default("slate-100"),
  iconColor: text("icon_color").default("slate-900"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Bots schema
export const userBots = pgTable("user_bots", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  botId: integer("bot_id").references(() => bots.id).notNull(),
  initialInvestment: doublePrecision("initial_investment").notNull(),
  currentValue: doublePrecision("current_value").notNull(),
  currency: text("currency").notNull(),
  status: text("status").default("active"),
  startedAt: timestamp("started_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Support tickets schema
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("open"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Support ticket messages schema
export const supportMessages = pgTable("support_messages", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").references(() => supportTickets.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Global notification schema
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  active: boolean("active").default(true),
  userId: integer("user_id").references(() => users.id), // null for global notifications
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Platform settings schema
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  withdrawalFee: doublePrecision("withdrawal_fee").default(0.2),
  bronzeFee: doublePrecision("bronze_fee").default(0.01),
  silverFee: doublePrecision("silver_fee").default(0.02),
  goldFee: doublePrecision("gold_fee").default(0.05),
  maintenanceMode: boolean("maintenance_mode").default(false),
  botsEnabled: boolean("bots_enabled").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  wallets: many(wallets),
  transactions: many(transactions),
  userBots: many(userBots),
  supportTickets: many(supportTickets),
  referrer: one(users, {
    fields: [users.referrerId],
    references: [users.id],
  }),
  referrals: many(users, {
    relationName: "referrer",
  }),
  kyc: many(kyc),
  notifications: many(notifications),
}));

export const walletsRelations = relations(wallets, ({ one }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const botsRelations = relations(bots, ({ many }) => ({
  userBots: many(userBots),
}));

export const userBotsRelations = relations(userBots, ({ one }) => ({
  user: one(users, {
    fields: [userBots.userId],
    references: [users.id],
  }),
  bot: one(bots, {
    fields: [userBots.botId],
    references: [bots.id],
  }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one, many }) => ({
  user: one(users, {
    fields: [supportTickets.userId],
    references: [users.id],
  }),
  messages: many(supportMessages),
}));

export const supportMessagesRelations = relations(supportMessages, ({ one }) => ({
  ticket: one(supportTickets, {
    fields: [supportMessages.ticketId],
    references: [supportTickets.id],
  }),
  user: one(users, {
    fields: [supportMessages.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const kycRelations = relations(kyc, ({ one }) => ({
  user: one(users, {
    fields: [kyc.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  fullName: true,
  phoneNumber: true,
  country: true,
  dateOfBirth: true,
  referrerId: true,
  telegram: true,
  language: true,
});

export const insertKycSchema = createInsertSchema(kyc).pick({
  userId: true,
  documentType: true,
  documentPath: true,
  level: true,
});

export const insertWalletSchema = createInsertSchema(wallets).pick({
  userId: true,
  currency: true,
  address: true,
  balance: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  type: true,
  currency: true,
  amount: true,
  status: true,
  txHash: true,
});

export const insertBotSchema = createInsertSchema(bots).pick({
  name: true,
  description: true,
  profitRange: true,
  riskLevel: true,
  icon: true,
  iconBg: true,
  iconColor: true,
});

export const insertUserBotSchema = createInsertSchema(userBots).pick({
  userId: true,
  botId: true,
  initialInvestment: true,
  currentValue: true,
  currency: true,
  status: true,
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).pick({
  userId: true,
  subject: true,
  message: true,
});

export const insertSupportMessageSchema = createInsertSchema(supportMessages).pick({
  ticketId: true,
  userId: true,
  message: true,
  isAdmin: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  message: true,
  userId: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Kyc = typeof kyc.$inferSelect;
export type InsertKyc = z.infer<typeof insertKycSchema>;

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Bot = typeof bots.$inferSelect;
export type InsertBot = z.infer<typeof insertBotSchema>;

export type UserBot = typeof userBots.$inferSelect;
export type InsertUserBot = z.infer<typeof insertUserBotSchema>;

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;

export type SupportMessage = typeof supportMessages.$inferSelect;
export type InsertSupportMessage = z.infer<typeof insertSupportMessageSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type Settings = typeof settings.$inferSelect;

// Extended schemas for frontend validation
export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const registerSchema = insertUserSchema.extend({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
