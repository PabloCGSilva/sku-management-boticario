import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function errorHandler(error: any, req: any, res: any, next: any) {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
}