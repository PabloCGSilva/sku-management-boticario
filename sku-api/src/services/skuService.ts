// src/services/skuService.ts
import { PrismaClient } from '@prisma/client';
import { CreateSKU, UpdateSKU, SKUStatus } from '../models/SKU';
import { NotFoundError, BusinessRuleError, DatabaseError } from '../errors';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class SKUService {
  // Validate state transitions according to technical challenge requirements
  private static validateStatusTransition(currentStatus: SKUStatus, newStatus: SKUStatus): void {
    const allowedTransitions: Record<SKUStatus, SKUStatus[]> = {
      [SKUStatus.PRE_CADASTRO]: [SKUStatus.CADASTRO_COMPLETO, SKUStatus.CANCELADO],
      [SKUStatus.CADASTRO_COMPLETO]: [SKUStatus.PRE_CADASTRO, SKUStatus.ATIVO, SKUStatus.CANCELADO],
      [SKUStatus.ATIVO]: [SKUStatus.DESATIVADO],
      [SKUStatus.DESATIVADO]: [SKUStatus.ATIVO, SKUStatus.PRE_CADASTRO],
      [SKUStatus.CANCELADO]: [] // No transitions allowed - final state
    };

    const allowed = allowedTransitions[currentStatus] || [];

    if (!allowed.includes(newStatus)) {
      throw new BusinessRuleError(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
        'INVALID_STATUS_TRANSITION',
        {
          currentStatus,
          requestedStatus: newStatus,
          allowedTransitions: allowed
        }
      );
    }
  }

  // Validate field editing permissions according to technical challenge
  private static validateFieldEditing(currentStatus: SKUStatus, updates: UpdateSKU): void {
    const editableFields: Record<SKUStatus, string[]> = {
      [SKUStatus.PRE_CADASTRO]: ['description', 'commercialDescription', 'sku'],
      [SKUStatus.CADASTRO_COMPLETO]: ['commercialDescription'],
      [SKUStatus.ATIVO]: [], // No fields editable
      [SKUStatus.DESATIVADO]: [], // No fields editable  
      [SKUStatus.CANCELADO]: [] // No fields editable
    };

    const allowedFields = editableFields[currentStatus] || [];
    const requestedFields = Object.keys(updates).filter(key => key !== 'status');

    const forbiddenFields = requestedFields.filter(field => !allowedFields.includes(field));

    if (forbiddenFields.length > 0) {
      throw new BusinessRuleError(
        `Fields ${forbiddenFields.join(', ')} cannot be edited in ${currentStatus} status`,
        'FIELD_EDITING_NOT_ALLOWED',
        {
          currentStatus,
          forbiddenFields,
          allowedFields
        }
      );
    }
  }

  static async create(data: CreateSKU) {
    try {
      logger.info('Creating new SKU', { data });

      const sku = await prisma.sKU.create({
        data: {
          ...data,
          status: SKUStatus.PRE_CADASTRO
        }
      });

      logger.info('SKU created successfully', { skuId: sku.id });
      return sku;
    } catch (error: any) {
      logger.error('Failed to create SKU', { data, error: error.message });

      if (error.code === 'P2002') {
        throw new BusinessRuleError(
          'SKU code already exists',
          'DUPLICATE_SKU_CODE',
          { skuCode: data.sku }
        );
      }

      throw new DatabaseError('create SKU', error, { data });
    }
  }

  static async findById(id: string) {
    try {
      const sku = await prisma.sKU.findUnique({ where: { id } });

      if (!sku) {
        throw new NotFoundError('SKU', id);
      }

      return sku;
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Failed to find SKU by ID', { id, error: error.message });
      throw new DatabaseError('find SKU by ID', error, { id });
    }
  }

  static async update(id: string, updates: UpdateSKU) {
    const sku = await this.findById(id);

    try {
      logger.info('Updating SKU', {
        skuId: id,
        updates,
        currentStatus: sku.status
      });

      // 1. Validate field editing permissions first
      this.validateFieldEditing(sku.status, updates);

      // 2. Validate status transitions if status is being changed
      if (updates.status && updates.status !== sku.status) {
        this.validateStatusTransition(sku.status, updates.status);
      }

      // 3. Apply special business rule: editing commercialDescription in CADASTRO_COMPLETO returns to PRE_CADASTRO
      if (sku.status === SKUStatus.CADASTRO_COMPLETO && updates.commercialDescription) {
        if (updates.commercialDescription !== sku.commercialDescription) {
          logger.info('Commercial description changed, applying business rule', {
            skuId: id,
            previousStatus: sku.status,
            newStatus: SKUStatus.PRE_CADASTRO
          });

          updates.status = SKUStatus.PRE_CADASTRO;
        }
      }

      const updatedSku = await prisma.sKU.update({
        where: { id },
        data: updates
      });

      logger.info('SKU updated successfully', { skuId: id });
      return updatedSku;
    } catch (error: any) {
      if (error instanceof BusinessRuleError) {
        throw error; // Re-throw business rule errors
      }

      logger.error('Failed to update SKU', {
        skuId: id,
        updates,
        error: error.message
      });

      if (error.code === 'P2002') {
        throw new BusinessRuleError(
          'SKU code already exists',
          'DUPLICATE_SKU_CODE',
          { skuCode: updates.sku }
        );
      }

      throw new DatabaseError('update SKU', error, { id, updates });
    }
  }

  static async findAll() {
    try {
      return await prisma.sKU.findMany({
        orderBy: { createdAt: 'desc' }
      });
    } catch (error: any) {
      logger.error('Failed to fetch all SKUs', { error: error.message });
      throw new DatabaseError('fetch all SKUs', error);
    }
  }

  static async delete(id: string) {
    await this.findById(id); // Ensure exists

    try {
      await prisma.sKU.delete({ where: { id } });
      logger.info('SKU deleted successfully', { skuId: id });
    } catch (error: any) {
      logger.error('Failed to delete SKU', { skuId: id, error: error.message });
      throw new DatabaseError('delete SKU', error, { id });
    }
  }
}