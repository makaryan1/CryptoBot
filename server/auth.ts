import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, insertUserSchema } from "@shared/schema";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Email validation schema
const emailSchema = z.string().email();

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "crypto-bot-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    }, async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Invalid email or password" });
        }
        if (!user.isEmailVerified) {
          return done(null, false, { message: "Please verify your email before logging in" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Registration endpoint
  app.post("/api/register", async (req, res, next) => {
    try {
      // Validate email format
      try {
        emailSchema.parse(req.body.email);
      } catch (error) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(req.body.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Check if passwords match
      if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({ message: "Passwords don't match" });
      }

      // Generate referral code
      const referralCode = uuidv4().substring(0, 8);

      // Create user - extract only the fields we want from the request body to avoid extra fields
      const userData = {
        email: req.body.email,
        password: await hashPassword(req.body.password),
        fullName: req.body.fullName || null,
        phoneNumber: req.body.phoneNumber || null,
        country: req.body.country || null,
        dateOfBirth: req.body.dateOfBirth || null,
        telegram: req.body.telegram || null,
        language: req.body.language || "en",
        referrerId: req.body.referrerId || null,
        referralCode,
        isEmailVerified: process.env.NODE_ENV === "development", // Auto-verify in development
      };

      // Create user
      const user = await storage.createUser(userData);

      // Create initial wallets for the user
      const currencies = ["USDT", "BTC", "ETH"];
      for (const currency of currencies) {
        await storage.createWallet({
          userId: user.id,
          currency,
          address: "",
          balance: 0
        });
      }

      // In a real application, send a verification email here
      if (process.env.NODE_ENV !== "development") {
        // Send verification email (not implemented in this example)
        // This would generate a token, store it, and send an email with a verification link
        console.log(`Verification email would be sent to ${user.email}`);
      }

      req.login(user, (err) => {
        if (err) return next(err);
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });

    } catch (error) {
      next(error);
    }
  });

  // Login endpoint
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error, user: SelectUser, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Authentication failed" });
      
      req.login(user, (err) => {
        if (err) return next(err);
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Get current user endpoint
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    // Remove password from response
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });

  // Update user profile
  app.patch("/api/user/profile", (req, res, next) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });

    const allowedFields = ["fullName", "phoneNumber", "country", "telegram", "language"];
    const updateData: Record<string, any> = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    storage.updateUser(req.user.id, updateData)
      .then(updatedUser => {
        // Remove password from response
        const { password, ...userWithoutPassword } = updatedUser;
        res.json(userWithoutPassword);
      })
      .catch(next);
  });

  // Change password
  app.post("/api/user/change-password", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });

      const { currentPassword, newPassword, confirmPassword } = req.body;

      // Check if new password matches confirmation
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New passwords don't match" });
      }

      // Verify current password
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await comparePasswords(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Update password
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUser(user.id, { password: hashedPassword });

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      next(error);
    }
  });

  // Email verification endpoint (not fully implemented)
  app.get("/api/verify-email/:token", async (req, res, next) => {
    try {
      const { token } = req.params;
      
      // In a real application, you would:
      // 1. Find the user associated with this token
      // 2. Verify the token is valid and not expired
      // 3. Update the user's isEmailVerified status
      
      // For this example, we'll just show a message
      res.send(`<html><body>
        <h1>Email Verification</h1>
        <p>This endpoint would verify the email using token: ${token}</p>
        <p>In a real application, this would update the user's verification status in the database.</p>
      </body></html>`);
    } catch (error) {
      next(error);
    }
  });
}
