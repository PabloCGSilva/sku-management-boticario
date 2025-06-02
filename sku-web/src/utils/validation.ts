import { z } from 'zod'

export const createSKUSchema = z.object({
    description: z.string().min(1, 'Descrição é obrigatória'),
    commercialDescription: z.string().min(1, 'Descrição comercial é obrigatória'),
    sku: z.string().min(1, 'SKU é obrigatório'),
})

export type CreateSKUFormData = z.infer<typeof createSKUSchema>