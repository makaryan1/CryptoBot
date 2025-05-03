import { Express, Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { insertKycSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Setup multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WEBP and MP4 are allowed.') as any, false);
    }
  }
});

// Auth middleware
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}

export function setupKycRoutes(app: Express) {
  // Get user's KYC documents
  app.get('/api/kyc', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const kyc = await storage.getKycByUserId(req.user!.id);
      res.json(kyc);
    } catch (error) {
      next(error);
    }
  });

  // Upload KYC document
  app.post('/api/kyc/upload', isAuthenticated, upload.single('documentFile'), async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { documentType, level } = req.body;
      
      if (!documentType || !level) {
        return res.status(400).json({ message: "Document type and level are required" });
      }
      
      // Validate level
      const levelNum = parseInt(level);
      if (isNaN(levelNum) || levelNum < 1 || levelNum > 3) {
        return res.status(400).json({ message: "Invalid KYC level" });
      }
      
      // Check if user's current KYC level is already higher than requested level
      if (req.user!.kycLevel >= levelNum) {
        return res.status(400).json({ message: "You have already completed this KYC level" });
      }
      
      // For level 2, require level 1 to be completed first
      if (levelNum === 2 && req.user!.kycLevel < 1) {
        return res.status(400).json({ message: "You must complete Level 1 KYC first" });
      }
      
      // For level 3, require level 2 to be completed first
      if (levelNum === 3 && req.user!.kycLevel < 2) {
        return res.status(400).json({ message: "You must complete Level 2 KYC first" });
      }
      
      // Save KYC document info to database
      const kyc = await storage.createKyc({
        userId: req.user!.id,
        documentType,
        documentPath: req.file.path,
        level: levelNum,
      });
      
      res.status(201).json({ 
        id: kyc.id,
        documentType: kyc.documentType,
        status: kyc.status,
        level: kyc.level,
        createdAt: kyc.createdAt
      });
    } catch (error) {
      next(error);
    }
  });

  // Get KYC status
  app.get('/api/kyc/status', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const kycLevel = req.user!.kycLevel;
      const kycDocuments = await storage.getKycByUserId(req.user!.id);
      
      // Check document status for each level
      const level1Status = kycLevel >= 1 ? 'completed' : 
        kycDocuments.some(doc => doc.level === 1 && doc.status === 'rejected') ? 'rejected' :
        kycDocuments.some(doc => doc.level === 1) ? 'pending' : 'not_started';
      
      const level2Status = kycLevel >= 2 ? 'completed' : 
        kycDocuments.some(doc => doc.level === 2 && doc.status === 'rejected') ? 'rejected' :
        kycDocuments.some(doc => doc.level === 2) ? 'pending' : 'not_started';
      
      const level3Status = kycLevel >= 3 ? 'completed' : 
        kycDocuments.some(doc => doc.level === 3 && doc.status === 'rejected') ? 'rejected' :
        kycDocuments.some(doc => doc.level === 3) ? 'pending' : 'not_started';
      
      // Check if specific documents are verified
      const addressVerified = kycDocuments.some(doc => 
        doc.documentType === 'address_proof' && doc.status === 'approved'
      );
      
      const videoVerified = kycDocuments.some(doc => 
        doc.documentType === 'video_verification' && doc.status === 'approved'
      );
      
      // Get rejection reason if any
      const rejectedDoc = kycDocuments.find(doc => doc.status === 'rejected');
      
      res.json({
        level1: level1Status,
        level2: level2Status,
        level3: level3Status,
        addressVerified,
        videoVerified,
        rejectionReason: rejectedDoc?.rejectionReason
      });
    } catch (error) {
      next(error);
    }
  });

  // Get KYC document (for admin or user)
  app.get('/api/kyc/:id', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const kyc = await storage.getKyc(parseInt(req.params.id));
      
      if (!kyc) {
        return res.status(404).json({ message: "KYC document not found" });
      }
      
      // Check if the user is authorized to access this document
      if (kyc.userId !== req.user!.id && !req.user!.isAdmin) {
        return res.status(403).json({ message: "Not authorized to access this document" });
      }
      
      res.json(kyc);
    } catch (error) {
      next(error);
    }
  });
}
