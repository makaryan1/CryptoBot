import { Router } from "express";
import { storage } from "../storage";
import { insertExchangeApiKeySchema } from "@shared/schema";
import * as crypto from "crypto";

const router = Router();

// Middleware to ensure user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// GET /api/exchange/api-keys - Get all API keys for current user
router.get("/api-keys", ensureAuthenticated, async (req, res) => {
  try {
    // Получение всех API ключей пользователя
    const keys = await storage.getExchangeApiKeysByUserId(req.user.id);
    
    // Маскируем секретные данные перед отправкой клиенту
    const safeKeys = keys.map(key => ({
      id: key.id,
      exchange: key.exchange,
      apiKey: maskApiKey(key.apiKey),
      description: key.description,
      permissions: key.permissions,
      testnetMode: key.testnetMode,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt,
      lastUsed: key.lastUsed,
    }));
    
    return res.status(200).json(safeKeys);
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return res.status(500).json({ error: "Failed to fetch API keys" });
  }
});

// POST /api/exchange/api-keys - Create a new API key
router.post("/api-keys", ensureAuthenticated, async (req, res) => {
  try {
    // Валидируем входные данные с использованием Zod схемы
    const validatedData = insertExchangeApiKeySchema.parse({
      ...req.body,
      userId: req.user.id,
    });
    
    // Проверяем количество уже существующих ключей для этой биржи
    const existingKeys = await storage.getExchangeApiKeysByUserId(req.user.id);
    const sameExchangeKeys = existingKeys.filter(key => key.exchange === validatedData.exchange);
    
    if (sameExchangeKeys.length >= 3) {
      return res.status(400).json({ error: "You can only have up to 3 API keys per exchange" });
    }
    
    // Создаем новый API ключ
    const apiKey = await storage.createExchangeApiKey(validatedData);
    
    // Маскируем секретные данные перед отправкой клиенту
    const safeKey = {
      ...apiKey,
      apiKey: maskApiKey(apiKey.apiKey),
      apiSecret: undefined, // Не отправляем секрет обратно клиенту
    };
    
    return res.status(201).json(safeKey);
  } catch (error) {
    console.error("Error creating API key:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid API key data", details: error.errors });
    }
    return res.status(500).json({ error: "Failed to create API key" });
  }
});

// DELETE /api/exchange/api-keys/:id - Delete an API key
router.delete("/api-keys/:id", ensureAuthenticated, async (req, res) => {
  try {
    const keyId = parseInt(req.params.id);
    if (isNaN(keyId)) {
      return res.status(400).json({ error: "Invalid API key ID" });
    }
    
    // Убедимся, что ключ принадлежит этому пользователю
    const key = await storage.getExchangeApiKey(keyId);
    if (!key) {
      return res.status(404).json({ error: "API key not found" });
    }
    
    if (key.userId !== req.user.id) {
      return res.status(403).json({ error: "You don't have permission to delete this API key" });
    }
    
    // Удаляем ключ
    await storage.deleteExchangeApiKey(keyId);
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting API key:", error);
    return res.status(500).json({ error: "Failed to delete API key" });
  }
});

// POST /api/exchange/test-api-key - Test API key connection
router.post("/test-api-key", ensureAuthenticated, async (req, res) => {
  try {
    const { exchange, apiKey, apiSecret, testnetMode } = req.body;
    
    if (!exchange || !apiKey || !apiSecret) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // В реальном приложении здесь будет код для проверки подключения к бирже
    // Сейчас просто симулируем проверку с задержкой
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Проверим правильность формата ключа (должен быть минимум 10 символов)
    if (apiKey.length < 10) {
      return res.status(400).json({ error: "Invalid API key format" });
    }
    
    // Проверим правильность формата секрета (должен быть минимум 20 символов)
    if (apiSecret.length < 20) {
      return res.status(400).json({ error: "Invalid API secret format" });
    }
    
    // Здесь можно было бы добавить специфичные проверки для разных бирж
    let permissions = [];
    
    switch (exchange) {
      case 'binance':
        permissions = ["READ_INFO", "SPOT_TRADING"];
        break;
      case 'bybit':
        permissions = ["API_WALLET", "API_POSITION", "API_ORDER"];
        break;
      case 'okx':
        permissions = ["read", "trade"];
        break;
      default:
        permissions = ["read_only"];
    }
    
    return res.status(200).json({ 
      success: true, 
      message: "API key successfully verified",
      permissions 
    });
  } catch (error) {
    console.error("Error testing API key:", error);
    return res.status(500).json({ error: "Failed to test API key" });
  }
});

// Получение баланса кошелька пользователя на бирже
router.get("/balance/:exchange", ensureAuthenticated, async (req, res) => {
  try {
    const exchangeName = req.params.exchange;
    if (!exchangeName) {
      return res.status(400).json({ error: "Exchange name is required" });
    }
    
    // Проверяем, есть ли у пользователя API ключи для данной биржи
    const apiKeys = await storage.getExchangeApiKeysByUserId(req.user.id);
    const exchangeKey = apiKeys.find(key => key.exchange === exchangeName);
    
    if (!exchangeKey) {
      return res.status(404).json({ error: "No API key found for this exchange" });
    }
    
    // В реальном приложении здесь будет код для получения баланса с биржи
    // Сейчас возвращаем фиктивные данные
    const mockBalance = [
      { asset: "BTC", free: 0.05, locked: 0.01, total: 0.06 },
      { asset: "ETH", free: 1.5, locked: 0.2, total: 1.7 },
      { asset: "USDT", free: 1200, locked: 800, total: 2000 }
    ];
    
    return res.status(200).json(mockBalance);
  } catch (error) {
    console.error("Error fetching exchange balance:", error);
    return res.status(500).json({ error: "Failed to fetch balance from exchange" });
  }
});

// Получение открытых ордеров на бирже
router.get("/orders/:exchange", ensureAuthenticated, async (req, res) => {
  try {
    const exchangeName = req.params.exchange;
    if (!exchangeName) {
      return res.status(400).json({ error: "Exchange name is required" });
    }
    
    // Проверяем, есть ли у пользователя API ключи для данной биржи
    const apiKeys = await storage.getExchangeApiKeysByUserId(req.user.id);
    const exchangeKey = apiKeys.find(key => key.exchange === exchangeName);
    
    if (!exchangeKey) {
      return res.status(404).json({ error: "No API key found for this exchange" });
    }
    
    // В реальном приложении здесь будет код для получения ордеров с биржи
    // Сейчас возвращаем фиктивные данные
    const mockOrders = [];
    
    return res.status(200).json(mockOrders);
  } catch (error) {
    console.error("Error fetching exchange orders:", error);
    return res.status(500).json({ error: "Failed to fetch orders from exchange" });
  }
});

// Вспомогательная функция для маскирования API ключа
function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 8) return "***";
  
  const firstFour = apiKey.slice(0, 4);
  const lastFour = apiKey.slice(-4);
  const maskedPart = "*".repeat(apiKey.length - 8);
  
  return `${firstFour}${maskedPart}${lastFour}`;
}

export default router;