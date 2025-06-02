import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'SKU Management API',
        version: '1.0.0',
        description: 'API para gerenciamento de SKUs - Grupo Boticário',
        contact: {
            name: 'Desenvolvedor',
            email: 'dev@example.com'
        }
    },
    servers: [
        {
            url: 'http://localhost:3001',
            description: 'Servidor de desenvolvimento'
        }
    ],
    components: {
        schemas: {
            SKU: {
                type: 'object',
                required: ['description', 'commercialDescription', 'sku'],
                properties: {
                    id: {
                        type: 'string',
                        description: 'ID único do SKU'
                    },
                    description: {
                        type: 'string',
                        description: 'Descrição do produto'
                    },
                    commercialDescription: {
                        type: 'string',
                        description: 'Descrição comercial do produto'
                    },
                    sku: {
                        type: 'string',
                        description: 'Código SKU único'
                    },
                    status: {
                        type: 'string',
                        enum: ['PRE_CADASTRO', 'CADASTRO_COMPLETO', 'ATIVO', 'DESATIVADO', 'CANCELADO'],
                        description: 'Status atual do SKU'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Data de criação'
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Data da última atualização'
                    }
                }
            },
            CreateSKURequest: {
                type: 'object',
                required: ['description', 'commercialDescription', 'sku'],
                properties: {
                    description: {
                        type: 'string',
                        description: 'Descrição do produto'
                    },
                    commercialDescription: {
                        type: 'string',
                        description: 'Descrição comercial do produto'
                    },
                    sku: {
                        type: 'string',
                        description: 'Código SKU único'
                    }
                }
            },
            UpdateSKURequest: {
                type: 'object',
                properties: {
                    description: {
                        type: 'string',
                        description: 'Descrição do produto'
                    },
                    commercialDescription: {
                        type: 'string',
                        description: 'Descrição comercial do produto'
                    },
                    sku: {
                        type: 'string',
                        description: 'Código SKU único'
                    },
                    status: {
                        type: 'string',
                        enum: ['PRE_CADASTRO', 'CADASTRO_COMPLETO', 'ATIVO', 'DESATIVADO', 'CANCELADO'],
                        description: 'Status do SKU'
                    }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    error: {
                        type: 'string',
                        description: 'Mensagem de erro'
                    }
                }
            }
        }
    }
};

const options = {
    definition: swaggerDefinition,
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Paths to files with OpenAPI definitions
};

export const swaggerSpec = swaggerJsdoc(options);