import { Router } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { log } from "../vite";
import { exchangeApiKeys } from "@shared/schema";

const router = Router();

// Схема валидации для API ключа
const apiKeySchema = z.object({
  exchange: z.string(),
  apiKey: z.string(),
  apiSecret: z.string(),
  description: z.string().optional(),
  testnetMode: z.boolean().optional(),
});

// Получение всех API ключей пользователя
router.get("/api-keys", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const userApiKeys = await storage.getExchangeApiKeysByUserId(req.user.id);
    // Не возвращаем секретный ключ на клиент
    const safeApiKeys = userApiKeys.map(key => ({
      ...key,
      apiSecret: undefined
    }));
    
    res.json(safeApiKeys);
  } catch (error) {
    log(`Error fetching API keys: ${error}`, "exchange-api");
    res.status(500).json({ error: "Failed to fetch API keys" });
  }
});

// Добавление нового API ключа
router.post("/api-keys", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const validatedData = apiKeySchema.parse(req.body);
    
    // Добавляем userId к данным
    const apiKeyData = {
      ...validatedData,
      userId: req.user.id,
    };

    // Создаем API ключ в базе данных
    const apiKey = await storage.createExchangeApiKey(apiKeyData);
    
    // Не возвращаем секретный ключ на клиент
    const safeApiKey = {
      ...apiKey,
      apiSecret: undefined
    };
    
    res.status(201).json(safeApiKey);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    
    log(`Error creating API key: ${error}`, "exchange-api");
    res.status(500).json({ error: "Failed to create API key" });
  }
});

// Удаление API ключа
router.delete("/api-keys/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const apiKeyId = parseInt(req.params.id);
    
    // Проверяем, что API ключ принадлежит текущему пользователю
    const apiKey = await storage.getExchangeApiKey(apiKeyId);
    
    if (!apiKey) {
      return res.status(404).json({ error: "API key not found" });
    }
    
    if (apiKey.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    
    // Удаляем API ключ
    await storage.deleteExchangeApiKey(apiKeyId);
    
    res.status(200).json({ success: true });
  } catch (error) {
    log(`Error deleting API key: ${error}`, "exchange-api");
    res.status(500).json({ error: "Failed to delete API key" });
  }
});

// Тестирование подключения к бирже
router.post("/test-api-key", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const validatedData = apiKeySchema.parse(req.body);
    
    // Тестируем подключение в зависимости от биржи
    switch (validatedData.exchange) {
      case "binance":
        // Имитация успешного тестирования API Binance
        // В реальном проекте здесь будет код, который проверяет подключение к API Binance
        res.json({ success: true, exchange: "binance", permissions: ["spot", "futures"] });
        break;
        
      case "bybit":
        // Имитация успешного тестирования API Bybit
        res.json({ success: true, exchange: "bybit", permissions: ["spot"] });
        break;
        
      case "okx":
        // Имитация успешного тестирования API OKX
        res.json({ success: true, exchange: "okx", permissions: ["spot", "futures"] });
        break;
        
      default:
        // Для остальных бирж просто возвращаем успешный результат
        res.json({ success: true, exchange: validatedData.exchange });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    
    log(`Error testing API key: ${error}`, "exchange-api");
    res.status(500).json({ error: "Failed to test API key" });
  }
});

// Получение балансов с биржи
router.get("/balances/:exchangeId", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const exchangeId = parseInt(req.params.exchangeId);
    
    // Проверяем, что API ключ принадлежит текущему пользователю
    const apiKey = await storage.getExchangeApiKey(exchangeId);
    
    if (!apiKey) {
      return res.status(404).json({ error: "API key not found" });
    }
    
    if (apiKey.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    
    // В реальном проекте здесь будет код для получения балансов с биржи
    // Имитация ответа с балансами
    const balances = [
      { asset: "BTC", free: 0.01243, locked: 0.0 },
      { asset: "ETH", free: 0.4512, locked: 0.0 },
      { asset: "USDT", free: 1245.78, locked: 50.0 },
    ];
    
    res.json(balances);
  } catch (error) {
    log(`Error fetching balances: ${error}`, "exchange-api");
    res.status(500).json({ error: "Failed to fetch balances" });
  }
});

// Размещение ордера через биржу
router.post("/order", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Валидация данных ордера
    const orderSchema = z.object({
      exchangeId: z.number(),
      symbol: z.string(),
      side: z.enum(["BUY", "SELL"]),
      type: z.enum(["LIMIT", "MARKET"]),
      quantity: z.number().positive(),
      price: z.number().positive().optional(),
    });
    
    const validatedData = orderSchema.parse(req.body);
    
    // Проверяем, что API ключ принадлежит текущему пользователю
    const apiKey = await storage.getExchangeApiKey(validatedData.exchangeId);
    
    if (!apiKey) {
      return res.status(404).json({ error: "API key not found" });
    }
    
    if (apiKey.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    
    // В реальном проекте здесь будет код для размещения ордера на бирже
    // Имитация успешно размещенного ордера
    const order = {
      orderId: Math.floor(Math.random() * 1000000),
      symbol: validatedData.symbol,
      side: validatedData.side,
      type: validatedData.type,
      quantity: validatedData.quantity,
      price: validatedData.price,
      status: "FILLED",
      transactionTime: Date.now(),
    };
    
    res.status(201).json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    
    log(`Error placing order: ${error}`, "exchange-api");
    res.status(500).json({ error: "Failed to place order" });
  }
});

export default router;