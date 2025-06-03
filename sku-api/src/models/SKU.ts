import { z } from 'zod';
import { SKUStatus as PrismaSKUStatus } from '@prisma/client';

export const SKUStatus = PrismaSKUStatus;
export type SKUStatus = PrismaSKUStatus;

export const CreateSKUSchema = z.object({
  description: z.string().min(1, 'Description is required').max(500),
  commercialDescription: z.string().min(1, 'Commercial description is required').max(500),
  sku: z.string().min(1, 'SKU code is required').max(50)
});

export const UpdateSKUSchema = z.object({
  description: z.string().min(1).max(500).optional(),
  commercialDescription: z.string().min(1).max(500).optional(),
  sku: z.string().min(1).max(50).optional(),
  status: z.nativeEnum(PrismaSKUStatus).optional()
}).strict();

export const ParamsSchema = z.object({
  id: z.string().cuid('Invalid CUID format')
});

export const QuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  status: z.nativeEnum(PrismaSKUStatus).optional(),
  search: z.string().max(100).optional()
});

export const SKUSchema = z.object({
  id: z.string().cuid(),
  description: z.string(),
  commercialDescription: z.string(),
  sku: z.string(),
  status: z.nativeEnum(PrismaSKUStatus),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type SKU = z.infer<typeof SKUSchema>;
export type CreateSKU = z.infer<typeof CreateSKUSchema>;
export type UpdateSKU = z.infer<typeof UpdateSKUSchema>;
export type SKUParams = z.infer<typeof ParamsSchema>;
export type SKUQuery = z.infer<typeof QuerySchema>;

export interface SKUResponse {
  id: string;
  description: string;
  commercialDescription: string;
  sku: string;
  status: SKUStatus;
  createdAt: Date;
  updatedAt: Date;
}