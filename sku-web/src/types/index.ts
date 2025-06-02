export interface SKU {
    id: string
    description: string
    commercialDescription: string
    sku: string
    status: SKUStatus
    createdAt: string
    updatedAt: string
}

export enum SKUStatus {
    PRE_CADASTRO = 'PRE_CADASTRO',
    CADASTRO_COMPLETO = 'CADASTRO_COMPLETO',
    ATIVO = 'ATIVO',
    DESATIVADO = 'DESATIVADO',
    CANCELADO = 'CANCELADO'
}

export interface CreateSKUData {
    description: string
    commercialDescription: string
    sku: string
}

export interface UpdateSKUData {
    description?: string
    commercialDescription?: string
    sku?: string
    status?: SKUStatus
}