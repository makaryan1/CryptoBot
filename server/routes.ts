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

  const httpServer = createServer(app);

  return httpServer;
}
