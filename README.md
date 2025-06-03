# Sistema de Gestão de SKUs - Grupo Boticário

Sistema completo para gerenciamento de SKUs com fluxo de estados e regras de negócio específicas, refatorado com **arquitetura de nível empresarial**.

## 🚀 Demonstração

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **Documentação API (Swagger)**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health

---

## 📋 Sobre o Projeto

Este projeto implementa um sistema de gestão de SKUs com **arquitetura profissional** e as seguintes funcionalidades:

- ✅ **CRUD completo** de SKUs
- ✅ **Fluxo de estados** com transições controladas
- ✅ **Regras de negócio** específicas por status
- ✅ **Validação de campos** editáveis por status
- ✅ **Regra especial**: Edição da descrição comercial em CADASTRO_COMPLETO retorna para PRÉ-CADASTRO
- ✅ **Interface responsiva** com Material-UI
- ✅ **Documentação interativa** com Swagger
- ✅ **Testes unitários e de integração**

---

## 🏗️ Arquitetura

### Distributed Microservices Architecture

```
sku-management/
├── sku-api/          # Backend API (Node.js + TypeScript)
├── sku-web/          # Frontend Web (React + TypeScript)
└── README.md
```

---

## 🛠️ Tecnologias Utilizadas

### Backend (sku-api)

| Categoria | Tecnologia | Finalidade |
|-----------|------------|------------|
| **Runtime** | Node.js 18+ | Ambiente de execução |
| **Linguagem** | TypeScript | Type safety e DX |
| **Framework** | Express.js | API RESTful |
| **Banco de Dados** | PostgreSQL | Persistência relacional |
| **ORM** | Prisma | Type-safe database access |
| **Validação** | Zod | Schema validation |
| **Documentação** | Swagger UI | API docs interativa |
| **Logs** | Winston | Logging estruturado |
| **Testes** | Jest + Supertest | Unit + Integration tests |
| **Container** | Docker + Docker Compose | Deployment |

### Frontend (sku-web)

| Categoria | Tecnologia | Finalidade |
|-----------|------------|------------|
| **Framework** | React 18 | Interface de usuário |
| **Linguagem** | TypeScript | Type safety |
| **Build Tool** | Vite | Build rápido |
| **UI Library** | Material-UI (MUI) | Design system |
| **State Management** | React Query | Server state |
| **Forms** | React Hook Form + Zod | Formulários validados |
| **HTTP Client** | Axios | API requests |
| **Roteamento** | React Router DOM | SPA routing |

### DevOps & Qualidade

- **Containerização**: Docker
- **Testes**: Jest (Unit + Integration)
- **Linting**: ESLint + Prettier  
- **Type Safety**: TypeScript strict mode

---

## 🔄 Fluxo de Estados dos SKUs

| Status | Transições Possíveis | Campos Editáveis | Observações |
|--------|---------------------|------------------|-------------|
| **PRÉ-CADASTRO** | `CADASTRO_COMPLETO`, `CANCELADO` | `DESCRIÇÃO`, `DESCRIÇÃO_COMERCIAL`, `SKU` | Status inicial |
| **CADASTRO_COMPLETO** | `PRÉ-CADASTRO`, `ATIVO`, `CANCELADO` | `DESCRIÇÃO_COMERCIAL` | Alteração retorna para PRÉ-CADASTRO |
| **ATIVO** | `DESATIVADO` | Nenhum | Nenhuma alteração permitida |
| **DESATIVADO** | `ATIVO`, `PRÉ-CADASTRO` | Nenhum | Nenhuma alteração permitida |
| **CANCELADO** | Nenhum | Nenhum | Status definitivo |


## 📄 **Part 3: Enterprise Refactoring & Installation (Fixed)**

```markdown
---

## 🎯 Refatoração

### ✨ Melhorias de Arquitetura Implementadas

#### 1. Sistema de Tratamento de Erros
```typescript
// Hierarquia de erros customizada
class ValidationError extends AppError { statusCode = 400; }
class BusinessRuleError extends AppError { statusCode = 422; }
class NotFoundError extends AppError { statusCode = 404; }
```

- **Códigos HTTP corretos** para cada tipo de erro
- **Classificação de erros** operacionais vs técnicos  
- **Contexto estruturado** para debugging
- **Logging centralizado** com correlation IDs

#### 2. Middleware de Validação Centralizado
```typescript
// Validação automática antes dos controllers
router.post('/', validateRequest({ body: CreateSKUSchema }), SKUController.create);
```

- **Validação automática** de params, body e query
- **Erros padronizados** do Zod
- **Type safety** completa nos controllers

#### 3. Formato de Resposta Padronizado
```json
{
  "success": true,
  "data": { },
  "message": "SKU created successfully",
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 4. Documentação Swagger Avançada
- **Schemas reutilizáveis** para respostas de erro
- **Exemplos detalhados** para todos endpoints
- **Códigos de erro específicos** (VALIDATION_ERROR, BUSINESS_RULE_VIOLATION)
- **Metadata de debugging** incluída

### 🚀 Padrões de Desenvolvimento Sênior

- **Error-First Design**: Arquitetura que trata erros como cidadãos de primeira classe
- **Type Safety Completa**: TypeScript strict mode com interfaces customizadas
- **Separation of Concerns**: Controllers apenas orquestram, Services contêm lógica
- **Middleware Pipeline**: Validação, autenticação, logging em camadas
- **Production-Ready Logging**: Logs estruturados com contexto completo

---

## 🚀 Como Executar

### Pré-requisitos

- **Node.js 18+**
- **Docker e Docker Compose**
- **Git**

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


---

## 📡 API Endpoints

### Principais Endpoints

| Método | Endpoint | Descrição | Validação |
|--------|----------|-----------|-----------|
| `GET` | `/api/skus` | Lista todos os SKUs | Query params validados |
| `POST` | `/api/skus` | Cria novo SKU | Body + Zod validation |
| `GET` | `/api/skus/:id` | Busca SKU por ID | CUID format validation |
| `PUT` | `/api/skus/:id` | Atualiza SKU | Params + Body validation |
| `DELETE` | `/api/skus/:id` | Remove SKU | CUID format validation |
| `GET` | `/health` | Health check | Dependency status |

**📖 Documentação Completa**: http://localhost:3001/api-docs

### Exemplo de Resposta de Erro

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed: description is required",
    "details": {
      "details": [
        {
          "field": "description",
          "message": "String must contain at least 1 character(s)",
          "code": "too_small"
        }
      ],
      "totalErrors": 1
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "path": "/api/skus",
    "method": "POST",
    "requestId": "req_123456789"
  }
}
```


## 🧪 Cobertura de Testes

Este projeto implementa uma **estratégia de testes abrangente** com diferentes níveis de validação para garantir a qualidade e confiabilidade do sistema.

### 📊 Tipos de Testes Implementados

| Tipo | Comando | Descrição | Cobertura |
|------|---------|-----------|-----------|
| **Unitários** | `npm run test:unit` | Testes isolados de funções e métodos | Lógica de negócio, validações |
| **Integração** | `npm run test:integration` | Testes de API end-to-end | Endpoints, fluxo completo |
| **State Machine** | `npm run test:state-machine` | Validação completa das regras de negócio | Transições de estado, permissões |
| **Completos** | `npm run test:all` | Executa todos os testes em sequência | Cobertura total do sistema |

### 🎯 Detalhamento da Cobertura

#### 1. Testes Unitários (test:unit)

```bash
npm run test:unit
```

**Arquivos testados:**
- `test/unit.test.js` - Testes básicos de configuração
- `test/simple.test.ts` - Validações de tipos e schemas

**Cobertura:**
- ✅ Validação de schemas Zod
- ✅ Tipos TypeScript
- ✅ Configuração do ambiente
- ✅ Utilitários e helpers

#### 2. Testes de Integração (test:integration)

```bash
npm run test:integration
```

**Arquivo:** `test/integration.test.js`

**Cobertura:**
- ✅ **CRUD completo** - Create, Read, Update, Delete
- ✅ **Regra especial** - Alteração de descrição comercial
- ✅ **Validação de campos** - Permissões por status
- ✅ **Respostas da API** - Códigos HTTP e formato JSON
- ✅ **Fluxo end-to-end** - Criação → Transição → Validação

**Cenários testados:**
```
✅ Criação de SKU com status inicial PRE_CADASTRO
✅ Transição PRE_CADASTRO → CADASTRO_COMPLETO  
✅ Regra: commercialDescription em CADASTRO_COMPLETO → PRE_CADASTRO
✅ Validação de permissões de edição por status
✅ Validação de transições inválidas
```

#### 3. Testes de State Machine (test:state-machine)

```bash
npm run test:state-machine
```

**Arquivo:** `test/sku-state-machine.test.js`

**Cobertura completa das regras de negócio do desafio técnico:**

##### 3.1 Estado PRE_CADASTRO
- ✅ Permite editar: `DESCRIÇÃO`, `DESCRIÇÃO_COMERCIAL`, `SKU`
- ✅ Transições válidas: `CADASTRO_COMPLETO`, `CANCELADO`
- ✅ Valida todas as combinações de campos editáveis

##### 3.2 Estado CADASTRO_COMPLETO
- ✅ Permite editar: **apenas** `DESCRIÇÃO_COMERCIAL`
- ✅ Regra especial: alteração retorna para `PRE_CADASTRO`
- ✅ Transições válidas: `PRE_CADASTRO`, `ATIVO`, `CANCELADO`
- ✅ Bloqueia edição de outros campos

##### 3.3 Estado ATIVO
- ✅ **Nenhuma edição permitida** - todos os campos bloqueados
- ✅ Transição válida: apenas `DESATIVADO`
- ✅ Valida rejeição de alterações de campos

##### 3.4 Estado DESATIVADO
- ✅ **Nenhuma edição permitida** - todos os campos bloqueados  
- ✅ Transições válidas: `ATIVO`, `PRE_CADASTRO`
- ✅ Valida rejeição de alterações de campos

##### 3.5 Estado CANCELADO
- ✅ **Status definitivo** - nenhuma alteração permitida
- ✅ **Nenhuma transição válida** - estado final
- ✅ Valida rejeição total de mudanças

##### 3.6 Validações de Transições Inválidas
- ✅ Bloqueia transições não permitidas
- ✅ Retorna erros `422 BUSINESS_RULE_VIOLATION`
- ✅ Mensagens específicas por violação

### 🎖️ Qualidade dos Testes

#### Padrões Profissionais Implementados:

1. **Isolamento de Testes**
   - Cada teste cria seus próprios dados
   - Cleanup automático após execução
   - Sem dependências entre testes

2. **Cobertura de Edge Cases**
   - Todas as transições de estado possíveis
   - Validação de campos por status
   - Cenários de erro e sucesso

3. **Validação de Regras de Negócio**
   - 100% das regras do desafio técnico
   - Casos especiais documentados
   - Comportamentos específicos validados

4. **Assertions Robustas**
   - Validação de códigos HTTP corretos
   - Verificação de estrutura de resposta
   - Contexto detalhado em falhas

### 📈 Métricas de Cobertura

```bash
# Executar todos os testes
npm run test:all

# Resultado esperado:
✅ Testes Unitários: 100% dos utilitários
✅ Testes de Integração: 100% dos endpoints  
✅ Testes de State Machine: 100% das regras de negócio
✅ Total: 17+ cenários validados
```

### 🚀 Executando os Testes

#### Pré-requisitos
- API rodando em `http://localhost:3001`
- Banco de dados PostgreSQL ativo
- Dependências instaladas (`npm install`)

#### Comandos Disponíveis

```bash
# Testes rápidos (sem dependência da API)
npm run test:unit

# Testes completos de API (requer API ativa)
npm run test:integration

# Validação completa de regras de negócio
npm run test:state-machine

# Suite completa (recomendado antes de deploy)
npm run test:all
```

#### CI/CD Ready
Os testes estão preparados para integração contínua:
- ✅ **Determinísticos** - resultados consistentes
- ✅ **Rápidos** - execução em menos de 10s
- ✅ **Informativos** - mensagens claras de erro
- ✅ **Cleanup automático** - sem efeitos colaterais

---

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

### 🏆 Melhorias Implementadas

- [x] **Error Handling Architecture** - Hierarquia de erros com códigos HTTP corretos
- [x] **Centralized Validation** - Middleware de validação automática
- [x] **Standardized Responses** - Formato consistente para sucesso e erro
- [x] **Production Logging** - Logs estruturados com correlation IDs
- [x] **Advanced Swagger** - Documentação com exemplos e schemas reutilizáveis
- [x] **Type Safety Completa** - Interfaces customizadas para Request/Response

---

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
- **Error-First Design**: Tratamento centralizado de erros
- **Middleware Pipeline**: Validação e logging em camadas

---

## 🔧 Configuração do Ambiente

### Variáveis de Ambiente (Backend)

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sku_management"
PORT=3001
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"
```

---

## 📊 Estrutura do Projeto

### Backend structure (sku-api)

```
src/
├── controllers/     # Controladores da API (apenas orquestração)
├── services/        # Lógica de negócio e regras
├── models/          # Definições de tipos e schemas Zod
├── routes/          # Definição das rotas com validação
├── middleware/      # Middlewares (validation, errorHandler)
├── errors/          # Hierarquia de erros customizada
├── utils/           # Utilitários e helpers
├── config/          # Configurações (Swagger, etc)
└── index.ts         # Entrada da aplicação
```

### Frontend structure (sku-web)

```
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

## 🎖️ Demonstração de Maturidade Técnica

Este projeto demonstra conhecimento através de:

- **Arquitetura de Erros**: Sistema profissional com hierarquia de classes
- **Middleware Design**: Pipeline de validação e tratamento
- **Type Safety Avançado**: TypeScript com interfaces customizadas
- **Production Patterns**: Logging, health checks, documentação
- **Clean Code**: Separação de responsabilidades clara
- **API Design**: RESTful com códigos HTTP semânticos
- **Testing Strategy**: Cobertura completa de regras de negócio

---

