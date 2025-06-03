
# Sistema de Gestão de SKUs - Grupo Boticário

Sistema completo para gerenciamento de SKUs com fluxo de estados e regras de negócio específicas.

## 🚀 Demonstração

- **Frontend**: <http://localhost:3000>0>
- **API**: <http://localhost:3001>
- **Documentação API (Swagger)**: <http://localhost:3001/api-docs>
- **Health Check**: <http://localhost:3001/health>

## 📋 Sobre o Projeto

Este projeto implementa um sistema de gestão de SKUs com as seguintes funcionalidades:

- ✅ **CRUD completo** de SKUs
- ✅ **Fluxo de estados** com transições controladas
- ✅ **Regras de negócio** específicas por status
- ✅ **Validação de campos** editáveis por status
- ✅ **Regra especial**: Edição da descrição comercial em CADASTRO_COMPLETO retorna para PRÉ-CADASTRO
- ✅ **Interface responsiva** com Material-UI
- ✅ **Documentação interativa** com Swagger
- ✅ **Testes unitários e de integração**

## 🏗️ Arquitetura

### Distributed Microservices Architecture

```markdown
sku-management/
├── sku-api/          # Backend API (Node.js + TypeScript)
├── sku-web/          # Frontend Web (React + TypeScript)
└── README.md
```

**Decisão Arquitetural**: Optei por uma arquitetura distribuída com serviços separados para demonstrar conhecimento em:

- Microserviços independentes
- Deployments separados
- Separação de responsabilidades
- Escalabilidade individual dos serviços

## 🛠️ Tecnologias Utilizadas

### Backend (sku-api)

- **Runtime**: Node.js 18+
- **Linguagem**: TypeScript
- **Framework**: Express.js
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Validação**: Zod
- **Documentação**: Swagger UI
- **Logs**: Winston
- **Testes**: Jest + Supertest
- **Containerização**: Docker + Docker Compose

### Frontend (sku-web)

- **Framework**: React 18
- **Linguagem**: TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Roteamento**: React Router DOM

### DevOps & Qualidade

- **Containerização**: Docker
- **Testes**: Jest (Unit + Integration)
- **Linting**: ESLint + Prettier
- **Type Safety**: TypeScript strict mode

## 🔄 Fluxo de Estados dos SKUs

| Status | Transições Possíveis | Campos Editáveis | Observações |
|--------|---------------------|------------------|-------------|
| **PRÉ-CADASTRO** | CADASTRO_COMPLETO, CANCELADO | DESCRIÇÃO, DESCRIÇÃO_COMERCIAL, SKU | Status inicial |
| **CADASTRO_COMPLETO** | PRÉ-CADASTRO, ATIVO, CANCELADO | DESCRIÇÃO_COMERCIAL | Alteração retorna para PRÉ-CADASTRO |
| **ATIVO** | DESATIVADO | Nenhum | Nenhuma alteração permitida |
| **DESATIVADO** | ATIVO, PRÉ-CADASTRO | Nenhum | Nenhuma alteração permitida |
| **CANCELADO** | Nenhum | Nenhum | Status definitivo |

### ✅ Requisitos Obrigatórios

- [x] API RESTful em TypeScript
- [x] Interface web em TypeScript
- [x] CRUD de SKUs
- [x] Fluxo de estados conforme especificação
- [x] Validação de campos editáveis por status
- [x] Banco de dados (PostgreSQL)

### ✅ Diferenciais Implementados

- [x] **Testes unitários e de integração** (TDD/BDD)
- [x] **Arquitetura distribuída** (microserviços)
- [x] **Containerização com Docker**
- [x] **Documentação interativa** (Swagger)
- [x] **Logs estruturados** (Winston)
- [x] **Validação robusta** (Zod)
- [x] **Type Safety** completo
- [x] **State Machine Pattern**
- [x] **Responsive Design**

### 🏆 **Melhorias**

- [x] **Error Handling Architecture** - Hierarquia de erros com códigos HTTP corretos
- [x] **Centralized Validation** - Middleware de validação automática
- [x] **Standardized Responses** - Formato consistente para sucesso e erro
- [x] **Production Logging** - Logs estruturados com correlation IDs
- [x] **Advanced Swagger** - Documentação com exemplos e schemas reutilizáveis
- [x] **Type Safety Completa** - Interfaces customizadas para Request/Response

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Git

### Instalação Rápida

```bash
# 1. Clone o repositório
git clone https://github.com/PabloCGSilva/sku-management-boticario.git
cd sku-management

# 2. Execute o script de inicialização (Windows)
start-all.bat
```

### Execução Manual

#### Backend (API)

```bash
cd sku-api

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env

# Iniciar com Docker (recomendado)
docker-compose up --build -d

# OU executar localmente
npm run build
npm start
```

#### Frontend (Web)

```bash
cd sku-web

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

## 🧪 Executar Testes

### Backend

```bash
cd sku-api

# Testes unitários
npm run test:unit

# Testes de integração (precisa da API rodando)
npm run test:integration

# Todos os testes
npm run test:all
```

## 📡 API Endpoints

### Principais Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/skus` | Lista todos os SKUs |
| POST | `/api/skus` | Cria novo SKU |
| GET | `/api/skus/:id` | Busca SKU por ID |
| PUT | `/api/skus/:id` | Atualiza SKU |
| DELETE | `/api/skus/:id` | Remove SKU |
| GET | `/health` | Health check |

**Documentação Completa**: <http://localhost:3001/api-docs>

## 🎯 Funcionalidades Implementadas

### ✅ Requisitos Obrigatórios

- [x] API RESTful em TypeScript
- [x] Interface web em TypeScript
- [x] CRUD de SKUs
- [x] Fluxo de estados conforme especificação
- [x] Validação de campos editáveis por status
- [x] Banco de dados (PostgreSQL)

### ✅ Diferenciais Implementados

- [x] **Testes unitários e de integração** (TDD/BDD)
- [x] **Arquitetura distribuída** (microserviços)
- [x] **Containerização com Docker**
- [x] **Documentação interativa** (Swagger)
- [x] **Logs estruturados** (Winston)
- [x] **Validação robusta** (Zod)
- [x] **Type Safety** completo
- [x] **State Machine Pattern**
- [x] **Responsive Design**

## 💼 Decisões Técnicas

### Por que essas tecnologias?

1. **TypeScript**: Type safety, melhor DX, menos bugs em produção
2. **Prisma**: Type-safe database access, migrations automáticas
3. **React Query**: Cache inteligente, sincronização automática
4. **Material-UI**: Design system consistente, acessibilidade
5. **Docker**: Ambiente consistente, fácil deployment

### Padrões Aplicados

- **SOLID**: Separação de responsabilidades, dependency injection
- **State Machine**: Controle rigoroso de transições de estado
- **Repository Pattern**: Abstração da camada de dados
- **Error Handling**: Tratamento centralizado de erros

## 🔧 Configuração do Ambiente

### Variáveis de Ambiente (Backend)

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sku_management"
PORT=3001
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"
```

## 📊 Estrutura do Projeto

### Backend structure (sku-api)

```markdown
src/
├── controllers/     # Controladores da API
├── services/        # Lógica de negócio
├── models/          # Definições de tipos e schemas
├── routes/          # Definição das rotas
├── middleware/      # Middlewares customizados
├── utils/           # Utilitários e helpers
├── config/          # Configurações (Swagger, etc)
└── index.ts         # Entrada da aplicação
```

### Frontend structure (sku-web)

```markdown
src/
├── components/      # Componentes reutilizáveis
├── pages/           # Páginas da aplicação
├── hooks/           # Custom hooks (React Query)
├── services/        # Cliente da API
├── types/           # Definições de tipos TypeScript
├── utils/           # Utilitários e validações
└── App.tsx          # Componente principal
```

---

### *Desenvolvido como parte do desafio técnico para Pessoa Desenvolvedora Fullstack II - Grupo Boticário*
