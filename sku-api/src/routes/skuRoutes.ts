// src/routes/skuRoutes.ts
import { Router } from 'express';
import { SKUController } from '../controllers/skuController';
import { validateRequest } from '../middleware/validation';
import { CreateSKUSchema, UpdateSKUSchema } from '../models/SKU';
import { z } from 'zod';

const router = Router();

// Validation schemas for params and query
const ParamsSchema = z.object({
    id: z.string().cuid('Invalid ID format')
});

const QuerySchema = z.object({
    status: z.enum(['PRE_CADASTRO', 'CADASTRO_COMPLETO', 'ATIVO', 'DESATIVADO', 'CANCELADO']).optional(),
    search: z.string().min(1).max(100).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional()
});

/**
 * @swagger
 * /api/skus:
 *   get:
 *     summary: Lista todos os SKUs
 *     tags: [SKUs]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PRE_CADASTRO, CADASTRO_COMPLETO, ATIVO, DESATIVADO, CANCELADO]
 *         description: Filtrar por status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           maxLength: 100
 *         description: Buscar por SKU, descrição ou descrição comercial
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Página para paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Limite de itens por página
 *     responses:
 *       200:
 *         description: Lista de SKUs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SKU'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.get('/',
    validateRequest({ query: QuerySchema }),
    SKUController.findAll
);

/**
 * @swagger
 * /api/skus:
 *   post:
 *     summary: Cria um novo SKU
 *     tags: [SKUs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSKURequest'
 *     responses:
 *       201:
 *         description: SKU criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SKU'
 *                 message:
 *                   type: string
 *                   example: "SKU created successfully"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       422:
 *         $ref: '#/components/responses/BusinessRuleError'
 */
router.post('/',
    validateRequest({ body: CreateSKUSchema }),
    SKUController.create
);

/**
 * @swagger
 * /api/skus/{id}:
 *   get:
 *     summary: Busca SKU por ID
 *     tags: [SKUs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-z0-9]+$'
 *         description: ID do SKU (CUID format)
 *     responses:
 *       200:
 *         description: SKU encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SKU'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id',
    validateRequest({ params: ParamsSchema }),
    SKUController.findById
);

/**
 * @swagger
 * /api/skus/{id}:
 *   put:
 *     summary: Atualiza um SKU
 *     tags: [SKUs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-z0-9]+$'
 *         description: ID do SKU (CUID format)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSKURequest'
 *     responses:
 *       200:
 *         description: SKU atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SKU'
 *                 message:
 *                   type: string
 *                   example: "SKU updated successfully"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       422:
 *         $ref: '#/components/responses/BusinessRuleError'
 */
router.put('/:id',
    validateRequest({
        params: ParamsSchema,
        body: UpdateSKUSchema
    }),
    SKUController.update
);

/**
 * @swagger
 * /api/skus/{id}:
 *   delete:
 *     summary: Remove um SKU
 *     tags: [SKUs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-z0-9]+$'
 *         description: ID do SKU (CUID format)
 *     responses:
 *       204:
 *         description: SKU removido com sucesso
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:id',
    validateRequest({ params: ParamsSchema }),
    SKUController.delete
);

export default router;