import { PrismaClient } from '@prisma/client';
import { CreateSKU, UpdateSKU, SKUStatus } from '../models/SKU';
import { SKUStateMachine } from './skuStateMachine';

const prisma = new PrismaClient();

export class SKUService {
  static async create(data: CreateSKU) {
    return prisma.sKU.create({
      data: {
        ...data,
        status: SKUStatus.PRE_CADASTRO
      }
    });
  }

  static async findAll() {
    return prisma.sKU.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  static async findById(id: string) {
    return prisma.sKU.findUnique({ where: { id } });
  }

  static async update(id: string, updates: UpdateSKU) {
    console.log('=== UPDATE DEBUG ===');
    console.log('ID:', id);
    console.log('Updates:', updates);

    const sku = await this.findById(id);
    if (!sku) throw new Error('SKU not found');

    console.log('Current SKU status:', sku.status);
    console.log('Has commercialDescription?', !!updates.commercialDescription);

    // Special rule: editing commercialDescription in CADASTRO_COMPLETO returns to PRE_CADASTRO
    if (sku.status === SKUStatus.CADASTRO_COMPLETO && updates.commercialDescription) {
      console.log('APPLYING SPECIAL RULE: Setting status to PRE_CADASTRO');
      updates.status = SKUStatus.PRE_CADASTRO;
    }

    console.log('Final updates:', updates);
    console.log('===================');

    return prisma.sKU.update({
      where: { id },
      data: updates
    });
  }

  static async delete(id: string) {
    return prisma.sKU.delete({ where: { id } });
  }
}