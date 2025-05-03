import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { setupKycRoutes } from "./api/kyc";
import { setupWalletRoutes } from "./api/wallet";
import { setupBotRoutes } from "./api/bots";
import { setupAdminRoutes } from "./api/admin";
import { setupReferralRoutes } from "./api/referrals";
import { setupSupportRoutes } from "./api/support";
import exchangeRoutes from "./api/exchange";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes (/api/register, /api/login, /api/logout, /api/user)
  setupAuth(app);

  // Setup feature-specific routes
  setupKycRoutes(app);
  setupWalletRoutes(app);
  setupBotRoutes(app);
  setupAdminRoutes(app);
  setupReferralRoutes(app);
  setupSupportRoutes(app);
  
  // Setup exchange routes for API key management and trading
  app.use("/api/exchange", exchangeRoutes);

  const httpServer = createServer(app);

  return httpServer;
}
