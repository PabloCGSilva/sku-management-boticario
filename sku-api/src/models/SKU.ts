import { z } from 'zod';

export enum SKUStatus {
  PRE_CADASTRO = 'PRE_CADASTRO',
  CADASTRO_COMPLETO = 'CADASTRO_COMPLETO',
  ATIVO = 'ATIVO',
  DESATIVADO = 'DESATIVADO',
  CANCELADO = 'CANCELADO'
}

export const CreateSKUSchema = z.object({
  description: z.string().min(1),
  commercialDescription: z.string().min(1),
  sku: z.string().min(1)
});

export const UpdateSKUSchema = z.object({
  description: z.string().optional(),
  commercialDescription: z.string().optional(),
  sku: z.string().optional(),
  status: z.nativeEnum(SKUStatus).optional()
});

export type CreateSKU = z.infer<typeof CreateSKUSchema>;
export type UpdateSKU = z.infer<typeof UpdateSKUSchema>;

export interface SKUResponse {
  id: string;
  description: string;
  commercialDescription: string;
  sku: string;
  status: SKUStatus;
  createdAt: Date;
  updatedAt: Date;
}