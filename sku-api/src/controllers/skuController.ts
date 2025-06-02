import { Request, Response } from 'express';
import { SKUService } from '../services/skuService';
import { CreateSKUSchema, UpdateSKUSchema } from '../models/SKU';
import { logger } from '../utils/logger';

export class SKUController {
  static async create(req: Request, res: Response) {
    try {
      const data = CreateSKUSchema.parse(req.body);
      const sku = await SKUService.create(data);
      res.status(201).json(sku);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Error creating SKU:', error);
      res.status(400).json({ error: message });
    }
  }

  static async findAll(req: Request, res: Response) {
    try {
      const skus = await SKUService.findAll();
      res.json(skus);
    } catch (error) {
      logger.error('Error fetching SKUs:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const sku = await SKUService.findById(id);
      if (!sku) {
        return res.status(404).json({ error: 'SKU not found' });
      }
      res.json(sku);
    } catch (error) {
      logger.error('Error fetching SKU:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      console.log('=== CONTROLLER UPDATE ===');
      console.log('Params:', req.params);
      console.log('Body:', req.body);

      const { id } = req.params;
      const updates = UpdateSKUSchema.parse(req.body);

      console.log('Parsed updates:', updates);
      console.log('Calling SKUService.update...');

      const sku = await SKUService.update(id, updates);

      console.log('Service returned:', sku);
      res.json(sku);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.log('Controller error:', error);
      logger.error('Error updating SKU:', error);
      res.status(400).json({ error: message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await SKUService.delete(id);
      res.status(204).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Error deleting SKU:', error);
      res.status(400).json({ error: message });
    }
  }
}