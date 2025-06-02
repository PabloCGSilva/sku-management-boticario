import { Router } from 'express';
import { SKUController } from '../controllers/skuController';

const router = Router();

/**
 * @swagger
 * /api/skus:
 *   get:
 *     summary: Lista todos os SKUs
 *     tags: [SKUs]
 *     responses:
 *       200:
 *         description: Lista de SKUs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SKU'
 */
router.get('/', SKUController.findAll);

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
 *               $ref: '#/components/schemas/SKU'
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', SKUController.create);

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
 *         description: ID do SKU
 *     responses:
 *       200:
 *         description: SKU encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SKU'
 *       404:
 *         description: SKU não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', SKUController.findById);

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
 *         description: ID do SKU
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
 *               $ref: '#/components/schemas/SKU'
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: SKU não encontrado
 */
router.put('/:id', SKUController.update);

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
 *         description: ID do SKU
 *     responses:
 *       204:
 *         description: SKU removido com sucesso
 *       404:
 *         description: SKU não encontrado
 */
router.delete('/:id', SKUController.delete);

export default router;