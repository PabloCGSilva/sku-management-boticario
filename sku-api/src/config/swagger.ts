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
                        description: 'ID único do SKU (CUID format)',
                        example: 'cl9ebqhxk00000cl9ebqhxk01'
                    },
                    description: {
                        type: 'string',
                        description: 'Descrição do produto',
                        example: 'Shampoo para cabelos oleosos'
                    },
                    commercialDescription: {
                        type: 'string',
                        description: 'Descrição comercial do produto',
                        example: 'Shampoo revitalizante que limpa profundamente'
                    },
                    sku: {
                        type: 'string',
                        description: 'Código SKU único',
                        example: 'SHP-001-2024'
                    },
                    status: {
                        type: 'string',
                        enum: ['PRE_CADASTRO', 'CADASTRO_COMPLETO', 'ATIVO', 'DESATIVADO', 'CANCELADO'],
                        description: 'Status atual do SKU',
                        example: 'PRE_CADASTRO'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Data de criação',
                        example: '2024-01-15T10:30:00.000Z'
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Data da última atualização',
                        example: '2024-01-15T10:30:00.000Z'
                    }
                }
            },
            CreateSKURequest: {
                type: 'object',
                required: ['description', 'commercialDescription', 'sku'],
                properties: {
                    description: {
                        type: 'string',
                        minLength: 1,
                        maxLength: 500,
                        description: 'Descrição do produto',
                        example: 'Shampoo para cabelos oleosos'
                    },
                    commercialDescription: {
                        type: 'string',
                        minLength: 1,
                        maxLength: 500,
                        description: 'Descrição comercial do produto',
                        example: 'Shampoo revitalizante que limpa profundamente'
                    },
                    sku: {
                        type: 'string',
                        minLength: 1,
                        maxLength: 50,
                        description: 'Código SKU único',
                        example: 'SHP-001-2024'
                    }
                }
            },
            UpdateSKURequest: {
                type: 'object',
                properties: {
                    description: {
                        type: 'string',
                        minLength: 1,
                        maxLength: 500,
                        description: 'Descrição do produto',
                        example: 'Shampoo para cabelos oleosos'
                    },
                    commercialDescription: {
                        type: 'string',
                        minLength: 1,
                        maxLength: 500,
                        description: 'Descrição comercial do produto',
                        example: 'Shampoo revitalizante que limpa profundamente'
                    },
                    sku: {
                        type: 'string',
                        minLength: 1,
                        maxLength: 50,
                        description: 'Código SKU único',
                        example: 'SHP-001-2024'
                    },
                    status: {
                        type: 'string',
                        enum: ['PRE_CADASTRO', 'CADASTRO_COMPLETO', 'ATIVO', 'DESATIVADO', 'CANCELADO'],
                        description: 'Status do SKU',
                        example: 'ATIVO'
                    }
                }
            },
            // Standardized Success Response
            SuccessResponse: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        example: true,
                        description: 'Indica se a operação foi bem-sucedida'
                    },
                    data: {
                        description: 'Dados retornados pela operação'
                    },
                    message: {
                        type: 'string',
                        description: 'Mensagem de sucesso (opcional)',
                        example: 'Operação realizada com sucesso'
                    },
                    meta: {
                        type: 'object',
                        properties: {
                            timestamp: {
                                type: 'string',
                                format: 'date-time',
                                description: 'Timestamp da resposta',
                                example: '2024-01-15T10:30:00.000Z'
                            }
                        }
                    }
                }
            },
            // Error Response Base
            ErrorResponse: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        example: false,
                        description: 'Indica que a operação falhou'
                    },
                    error: {
                        type: 'object',
                        properties: {
                            code: {
                                type: 'string',
                                description: 'Código do erro',
                                example: 'VALIDATION_ERROR'
                            },
                            message: {
                                type: 'string',
                                description: 'Mensagem de erro',
                                example: 'Validation failed: description is required'
                            },
                            details: {
                                type: 'object',
                                description: 'Detalhes adicionais do erro (opcional)'
                            }
                        }
                    },
                    meta: {
                        type: 'object',
                        properties: {
                            timestamp: {
                                type: 'string',
                                format: 'date-time',
                                description: 'Timestamp do erro',
                                example: '2024-01-15T10:30:00.000Z'
                            },
                            path: {
                                type: 'string',
                                description: 'Caminho da requisição que gerou o erro',
                                example: '/api/skus'
                            },
                            method: {
                                type: 'string',
                                description: 'Método HTTP da requisição',
                                example: 'POST'
                            },
                            requestId: {
                                type: 'string',
                                description: 'ID único da requisição',
                                example: 'req_123456789'
                            }
                        }
                    }
                }
            },
            // Legacy Error (for backward compatibility)
            Error: {
                type: 'object',
                properties: {
                    error: {
                        type: 'string',
                        description: 'Mensagem de erro'
                    }
                }
            }
        },
        responses: {
            ValidationError: {
                description: 'Erro de validação dos dados de entrada',
                content: {
                    'application/json': {
                        schema: {
                            allOf: [
                                { $ref: '#/components/schemas/ErrorResponse' },
                                {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'object',
                                            properties: {
                                                code: {
                                                    type: 'string',
                                                    example: 'VALIDATION_ERROR'
                                                },
                                                message: {
                                                    type: 'string',
                                                    example: 'Validation failed: description is required'
                                                },
                                                details: {
                                                    type: 'object',
                                                    properties: {
                                                        details: {
                                                            type: 'array',
                                                            items: {
                                                                type: 'object',
                                                                properties: {
                                                                    field: { type: 'string', example: 'description' },
                                                                    message: { type: 'string', example: 'String must contain at least 1 character(s)' },
                                                                    code: { type: 'string', example: 'too_small' }
                                                                }
                                                            }
                                                        },
                                                        totalErrors: { type: 'number', example: 1 }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            NotFoundError: {
                description: 'Recurso não encontrado',
                content: {
                    'application/json': {
                        schema: {
                            allOf: [
                                { $ref: '#/components/schemas/ErrorResponse' },
                                {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'object',
                                            properties: {
                                                code: {
                                                    type: 'string',
                                                    example: 'RESOURCE_NOT_FOUND'
                                                },
                                                message: {
                                                    type: 'string',
                                                    example: 'SKU with identifier \'cl9ebqhxk00000cl9\' not found'
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            BusinessRuleError: {
                description: 'Violação de regra de negócio',
                content: {
                    'application/json': {
                        schema: {
                            allOf: [
                                { $ref: '#/components/schemas/ErrorResponse' },
                                {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'object',
                                            properties: {
                                                code: {
                                                    type: 'string',
                                                    example: 'BUSINESS_RULE_VIOLATION'
                                                },
                                                message: {
                                                    type: 'string',
                                                    example: 'SKU code already exists'
                                                },
                                                details: {
                                                    type: 'object',
                                                    properties: {
                                                        skuCode: { type: 'string', example: 'SHP-001-2024' }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            InternalServerError: {
                description: 'Erro interno do servidor',
                content: {
                    'application/json': {
                        schema: {
                            allOf: [
                                { $ref: '#/components/schemas/ErrorResponse' },
                                {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'object',
                                            properties: {
                                                code: {
                                                    type: 'string',
                                                    example: 'INTERNAL_SERVER_ERROR'
                                                },
                                                message: {
                                                    type: 'string',
                                                    example: 'An unexpected error occurred'
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
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