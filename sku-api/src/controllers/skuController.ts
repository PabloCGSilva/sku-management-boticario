// src/controllers/skuController.ts
import { Request, Response, NextFunction } from 'express';
import { SKUService } from '../services/skuService';
import { logger } from '../utils/logger';

// Standardized response format
class ResponseFormatter {
  static success<T>(data: T, message?: string) {
    return {
      success: true,
      data,
      message,
      meta: {
        timestamp: new Date().toISOString()
      }
    };
  }
}

export class SKUController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const sku = await SKUService.create(req.body);
      res.status(201).json(ResponseFormatter.success(sku, 'SKU created successfully'));
    } catch (error) {
      next(error); // Let error middleware handle it
    }
  }

  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const skus = await SKUService.findAll();
      res.json(ResponseFormatter.success(skus));
    } catch (error) {
      next(error);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const sku = await SKUService.findById(req.params.id);
      res.json(ResponseFormatter.success(sku));
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const sku = await SKUService.update(req.params.id, req.body);
      res.json(ResponseFormatter.success(sku, 'SKU updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await SKUService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}