# Altaa.ai Multitenant - Teste Técnico Fullstack

## 📋 Sobre o Projeto

Aplicação multi-tenant completa para gerenciamento de empresas e usuários, desenvolvida como teste técnico para a Altaa.ai. O projeto demonstra habilidades em arquitetura de software, TypeScript, Node.js, Prisma ORM e boas práticas de desenvolvimento.

---

## 🛠️ Stack Tecnológica

### Backend
- **Node.js** v20
- **TypeScript** v5.9
- **Fastify** v5.6 (framework web)
- **Prisma ORM** v6.19 (ORM para PostgreSQL)
- **PostgreSQL** v15 (banco de dados)
- **Zod** v4.1 (validação de schemas)
- **Bcrypt** v6.0 (hash de senhas)
- **JWT** (autenticação via cookies httpOnly)
- **Docker & Docker Compose** (containerização)

### Ferramentas de Desenvolvimento
- **ESLint** + **Prettier** (qualidade de código)
- **Husky** + **Commitlint** (git hooks e validação de commits)
- **Concurrently** (execução paralela de scripts)
- **TSX** (execução TypeScript em desenvolvimento)
- **Scalar API Reference** (documentação interativa da API)

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js v20 ou superior
- Docker e Docker Compose instalados
- Git

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/Birgiman/teste-tecnico-fullstack-altaa.ai.git
cd teste-tecnico-fullstack-altaa.ai-multitenant
```

2. **Configure as variáveis de ambiente**
```bash
cd backend
cp .env.example .env
# Edite o .env com suas configurações
```

3. **Inicie o ambiente Docker**
```bash
# Na raiz do projeto
npm run docker:start
```

Ou manualmente:
```bash
docker compose up -d
```

4. **Execute as migrações do Prisma**
```bash
cd backend
npx prisma migrate dev
```

5. **Inicie o backend em modo desenvolvimento**
```bash
cd backend
npm run dev:mode
```

Este comando inicia automaticamente:
- Servidor Fastify (porta 4000)
- Container Docker do PostgreSQL
- Prisma Studio (porta 5555)

### Scripts Disponíveis

#### Na raiz do projeto:
- `npm run docker:start` - Inicia containers Docker (PostgreSQL, Backend, Prisma Studio)
- `npm run docker:down` - Para e remove containers
- `npm run docker:stop` - Para containers sem remover

#### No diretório backend:
- `npm run dev` - Inicia servidor em modo desenvolvimento (hot reload)
- `npm run dev:mode` - Inicia servidor + Docker + Prisma Studio simultaneamente
- `npm run dev:docker` - Inicia container Docker do PostgreSQL
- `npm run dev:prisma` - Inicia Prisma Studio
- `npm run build` - Compila TypeScript para JavaScript
- `npm run start` - Inicia servidor em produção (após build)
- `npm run lint` - Executa ESLint para verificar qualidade de código

---

## 📚 Documentação da API

Após iniciar o servidor, acesse:
- **Documentação Interativa**: `http://localhost:4000/docs`
- **Prisma Studio**: `http://localhost:5555`

---

## 🏗️ Arquitetura e Estrutura do Projeto

### Estrutura de Diretórios

```
backend/
├── src/
│   ├── controllers/     # Controladores (camada de requisição/resposta)
│   ├── services/         # Lógica de negócio
│   ├── schemas/          # Schemas Zod para validação
│   ├── middlewares/      # Middlewares (auth, authorize, error handler)
│   ├── routes/           # Definição de rotas
│   ├── types/            # Tipos TypeScript e enums
│   ├── utils/            # Utilitários (JWT, cookies, erros)
│   └── lib/              # Configurações (Prisma client)
├── prisma/
│   ├── schema.prisma     # Schema do banco de dados
│   └── migrations/       # Migrações do Prisma
└── generated/            # Código gerado pelo Prisma
```

### Padrão de Arquitetura

**Separação de Responsabilidades:**
- **Controllers**: Recebem requisições, validam entrada com Zod, chamam services
- **Services**: Contêm lógica de negócio, interagem com banco via Prisma
- **Schemas**: Validação de dados de entrada com Zod
- **Middlewares**: Autenticação, autorização e tratamento global de erros
- **Routes**: Definição e organização das rotas da API

**Fluxo de Dados:**
```
Request → Middleware (Auth) → Middleware (Authorize) → Controller (Valida Zod) → Service (Lógica) → Database
```

---

## 🔐 Autenticação e Autorização

### Autenticação
- JWT armazenado em cookie `httpOnly` e `secure`
- Middleware global `authMiddleware` valida token em todas as rotas protegidas
- Busca `activeCompanyId` do usuário para definir escopo da sessão

### Autorização por Roles
- **OWNER**: Todas as ações (editar/deletar empresa, gerenciar membros, atualizar cargos)
- **ADMIN**: Convidar/remover MEMBER, editar dados da empresa, atualizar cargos
- **MEMBER**: Acesso de leitura, alternar entre empresas

**Regras de Negócio:**
- OWNER nunca pode ser removido da empresa
- OWNER nunca pode ter seu cargo alterado
- Não é possível promover membro para OWNER (apenas criado na criação da empresa)
- Ao deletar empresa, todos os membros são removidos automaticamente (cascade)

---

## 📡 Rotas da API

### Rotas Públicas
- `GET /` - Health check
- `GET /docs` - Documentação interativa da API
- `POST /auth/signup` - Cadastro de usuário
- `POST /auth/login` - Login de usuário

### Rotas Protegidas (requerem autenticação)

#### Autenticação
- `POST /auth/logout` - Logout (limpa cookie)

#### Empresas
- `GET /companies` - Listar empresas do usuário (com paginação)
- `POST /company` - Criar nova empresa
- `GET /company/:id` - Obter detalhes da empresa (com lista de membros)
- `PUT /company/:id` - Atualizar empresa (OWNER ou ADMIN)
- `DELETE /company/:id` - Deletar empresa (apenas OWNER)
- `POST /company/:id/select` - Selecionar empresa ativa

#### Membros
- `PATCH /company/:id/members/:userId` - Atualizar cargo do membro (OWNER apenas, ADMIN ↔ MEMBER)
- `DELETE /company/:id/members/:userId` - Remover membro (OWNER ou ADMIN, não pode remover OWNER)

#### Convites
- `POST /company/:id/invite` - Criar convite (OWNER ou ADMIN)
- `POST /auth/accept-invite` - Aceitar convite

---

## 🎯 Funcionalidades Implementadas

### ✅ Autenticação e Sessão
- [x] Cadastro de usuário com validação
- [x] Login com JWT em cookie httpOnly
- [x] Logout
- [x] Middleware de autenticação global
- [x] Sessão baseada em `activeCompanyId` (escopo da requisição)

### ✅ Gerenciamento de Empresas
- [x] CRUD completo de empresas
- [x] Listagem com paginação
- [x] Alternar empresa ativa
- [x] Listagem de membros com cargos
- [x] Validação de permissões por role

### ✅ Gerenciamento de Membros
- [x] Atualizar cargo de membro (ADMIN ↔ MEMBER)
- [x] Remover membro da empresa
- [x] Proteção: OWNER não pode ser removido ou ter cargo alterado
- [x] Validação de permissões

### ✅ Sistema de Convites
- [x] Criar convite com token único
- [x] Validação de expiração (configurável, padrão 7 dias)
- [x] Aceitar convite por token
- [x] Validação de email do convite
- [x] Controle de roles ao convidar

### ✅ Tratamento de Erros
- [x] Middleware global de tratamento de erros
- [x] Erros Zod retornam 400 com mensagens específicas
- [x] Erros de negócio padronizados (AppError)
- [x] Enumerador tipado de erros (error.types.ts)
- [x] Mensagens de erro consistentes

### ✅ Validação e Tipagem
- [x] Validação Zod em todos os endpoints
- [x] Tipagem TypeScript completa
- [x] Inferência de tipos dos schemas Zod
- [x] Validação no controller, lógica no service

### ✅ Qualidade de Código
- [x] ESLint + Prettier configurados
- [x] Husky com git hooks
- [x] Commitlint para validação de commits
- [x] CI/CD com GitHub Actions (lint)

---

## 🔧 Escolhas Técnicas

### Por que Fastify?
- Performance superior ao Express
- Suporte nativo a TypeScript
- Validação integrada com Zod via `fastify-type-provider-zod`
- Arquitetura baseada em plugins (modularidade)

### Por que Prisma?
- Type-safety completo
- Migrations automáticas
- Prisma Studio para visualização de dados
- Relações bem definidas com cascade

### Por que Zod?
- Validação e tipagem em um único lugar
- Mensagens de erro customizáveis
- Inferência automática de tipos TypeScript
- Validação em runtime e compile-time

### Por que Cookies httpOnly?
- Segurança: JavaScript não acessa o token
- Proteção contra XSS
- Gerenciamento automático pelo navegador
- Compatível com CORS

### Arquitetura de Middlewares
- **Separação de responsabilidades**: `auth.middleware.ts` (autenticação) e `authorize.middleware.ts` (autorização)
- **Middleware global**: Aplicado em `protected.routes.index.ts` para evitar duplicação
- **Middleware específico**: Aplicado por rota quando necessário (ex: `authorizeOwner()`)

### Padrão de Validação
- **Controller**: Valida entrada com Zod (`schema.parse()`)
- **Service**: Recebe dados já validados e tipados
- **Benefício**: Separação clara entre validação de formato e regras de negócio

---

## 🧪 Testes

Os testes serão implementados com Vitest. A estrutura está preparada para:
- Testes unitários de services
- Testes de integração de rotas
- Testes de middlewares

---

## 📦 CI/CD

O projeto possui workflow do GitHub Actions configurado em `.github/workflows/ci.yml` que:
- Executa lint em cada push
- Valida qualidade de código
- Garante que o código segue os padrões estabelecidos

---

## 🐳 Docker

O projeto inclui `docker-compose.yml` com:
- **PostgreSQL**: Banco de dados
- **Backend**: Servidor Fastify (desenvolvimento)
- **Prisma Studio**: Interface visual do banco

### Comandos Docker
```bash
npm run docker:start  # Inicia todos os serviços
npm run docker:stop   # Para os serviços
npm run docker:down   # Remove containers e volumes
```

---

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` no diretório `backend/` com:

```env
# Servidor
PORT=4000
HOST=0.0.0.0
NODE_ENV=development
FRONT_END_URL=http://localhost:3000

# Banco de Dados
DATABASE_URL=postgresql://altaa_user:senha@localhost:5432/altaadb

# JWT
JWT_SECRET=seu_jwt_secret_aqui
COOKIE_SECRET=seu_cookie_secret_aqui
```

---

## 🎨 Próximos Passos

### Backend (Pendências)
- [ ] Implementar testes unitários e de integração
- [ ] Criar seed script para popular banco com dados de teste
- [ ] Implementar upload de logo da empresa (diferencial)

### Frontend
- [ ] Implementar interface de autenticação
- [ ] Dashboard de empresas
- [ ] Gerenciamento de membros
- [ ] Sistema de convites
- [ ] Integração completa com backend

---

## 📄 Licença

Este projeto foi desenvolvido como teste técnico para a Altaa.ai.

---

## 👤 Autor

Desenvolvido como parte do processo seletivo da Altaa.ai.
