# 📚 Bantu ERP - Documentação Completa

> Sistema de Gestão Empresarial Modular com React, TypeScript e Node.js

---

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Tecnologias](#-tecnologias)
3. [Arquitetura](#-arquitetura)
4. [Instalação e Configuração](#-instalação-e-configuração)
5. [Sistema de Autenticação](#-sistema-de-autenticação)
6. [Backend API](#-backend-api)
7. [Banco de Dados](#-banco-de-dados)
8. [Componentes UI](#-componentes-ui)
9. [Módulos do Sistema](#-módulos-do-sistema)
10. [Scripts Disponíveis](#-scripts-disponíveis)
11. [Deploy](#-deploy)
12. [Troubleshooting](#-troubleshooting)
13. [Changelog](#-changelog)

---

## 🎯 Visão Geral

Sistema de gestão empresarial modular desenvolvido com React, TypeScript e Vite, projetado para gerenciar diferentes áreas de negócio:

- **🏨 Hotelaria** - Gestão hoteleira, reservas e hospedagem
- **📦 Armazém** - Gestão de estoque, produtos e inventário
- **💼 Comercial** - Vendas, clientes e relacionamento
- **🍽️ Restaurante** - Cardápio, pedidos e atendimento

### Características Principais

- ✅ **Autenticação completa** com controle de acesso por módulos
- ✅ **Backend Node.js/Express** com TypeScript
- ✅ **Banco de dados PostgreSQL** (Neon Serverless)
- ✅ **Interface moderna** com Tailwind CSS
- ✅ **Componentes reutilizáveis** e bem documentados
- ✅ **API RESTful** completa
- ✅ **Tipagem TypeScript** em todo o projeto

---

## 🚀 Tecnologias

### Frontend
- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool e dev server ultra-rápido
- **Tailwind CSS** - Framework CSS utilitário
- **Axios** - Cliente HTTP para requisições
- **React Router DOM** - Roteamento
- **Lucide React** - Ícones modernos
- **Chart.js** - Gráficos e visualizações

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **PostgreSQL (Neon)** - Banco de dados serverless
- **pg** - Cliente PostgreSQL para Node.js
- **tsx** - Executor TypeScript com hot reload

### Ferramentas de Desenvolvimento
- **ESLint + Prettier** - Linting e formatação de código
- **Vite** - Build otimizado
- **Hot Module Replacement (HMR)** - Desenvolvimento ágil

---

## 🏗️ Arquitetura

### Estrutura de Pastas

```
bantu-4/
├── backend/                    # Backend Node.js/Express
│   ├── src/
│   │   ├── config/            # Configurações (DB, etc)
│   │   ├── routes/            # Rotas da API
│   │   └── scripts/           # Scripts utilitários
│   ├── .env.example           # Exemplo de variáveis de ambiente
│   └── package.json
│
├── database/                   # Scripts SQL
│   ├── migrations/            # Migrações do banco
│   ├── schema.sql             # Schema completo
│   └── seed.sql               # Dados de teste
│
├── src/                        # Frontend React
│   ├── assets/                # Imagens, fontes e ícones
│   │
│   ├── components/            # Componentes reutilizáveis
│   │   ├── auth/             # Componentes de autenticação
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── index.ts
│   │   ├── layout/           # Componentes de layout
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── PageWrapper.tsx
│   │   ├── sections/         # Seções reutilizáveis
│   │   │   ├── ModulesSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   └── index.ts
│   │   └── ui/               # Componentes UI básicos
│   │       ├── Button/
│   │       ├── Input/
│   │       ├── Modal/
│   │       ├── StatusBadge/
│   │       ├── ModuleCard/
│   │       └── index.ts
│   │
│   ├── contexts/              # Contextos React
│   │   └── AuthContext.tsx   # Contexto de autenticação
│   │
│   ├── features/              # Módulos por domínio
│   │   ├── Armazem/          # Módulo de armazém
│   │   ├── Comercial/        # Módulo comercial
│   │   ├── Hotelaria/        # Módulo hotelaria
│   │   │   ├── api/          # Chamadas de API
│   │   │   ├── components/   # Componentes do módulo
│   │   │   ├── hooks/        # Hooks customizados
│   │   │   ├── pages/        # Páginas do módulo
│   │   │   ├── types.ts      # Tipos TypeScript
│   │   │   └── index.ts
│   │   └── Restaurante/      # Módulo restaurante
│   │
│   ├── hooks/                 # Hooks globais
│   │   └── useAuth.ts        # Hook de autenticação
│   │
│   ├── lib/                   # Utilitários
│   │   └── formatDate.ts     # Funções auxiliares
│   │
│   ├── pages/                 # Páginas principais
│   │   ├── index.tsx         # Página inicial
│   │   └── LoginPage.tsx     # Página de login
│   │
│   ├── services/              # Serviços externos
│   │   ├── authService.ts    # Serviço de autenticação
│   │   └── axios.ts          # Configuração HTTP
│   │
│   ├── styles/                # Estilos globais
│   │   └── global.css
│   │
│   ├── types/                 # Tipos TypeScript globais
│   │   └── index.ts
│   │
│   ├── App.tsx               # Componente raiz
│   └── main.tsx              # Entry point
│
├── .env                       # Variáveis de ambiente (não versionado)
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### Padrões de Organização

#### 1. **Organização por Features**
Cada módulo de negócio (Hotelaria, Armazém, etc.) é auto-contido com seus próprios componentes, hooks, tipos e API.

#### 2. **Componentes UI Reutilizáveis**
Componentes base na pasta `components/ui` com tipagem completa e estilos modulares.

#### 3. **Aliases de Importação**
```typescript
import { Button } from '@components/ui';
import { useAuth } from '@hooks/useAuth';
import type { User } from '@types';
import authService from '@services/authService';
import { AuthProvider } from '@contexts/AuthContext';
```

**Aliases configurados:**
- `@components/*` - Componentes reutilizáveis
- `@pages/*` - Páginas da aplicação
- `@hooks/*` - Hooks personalizados
- `@types` - Definições de tipos TypeScript
- `@styles/*` - Estilos globais
- `@features/*` - Módulos/funcionalidades
- `@lib/*` - Utilitários e bibliotecas
- `@contexts/*` - Contextos React
- `@services/*` - Serviços externos

---

## 🔧 Instalação e Configuração

### Pré-requisitos

- **Node.js** 16 ou superior
- **npm** ou **yarn**
- Conta no **Neon Postgres** (ou PostgreSQL local)

### 1️⃣ Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd bantu-4
```

### 2️⃣ Configurar o Backend

```bash
# Entrar na pasta do backend
cd backend

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env
```

**Edite o arquivo `.env` com suas credenciais:**
```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
PORT=3001
NODE_ENV=development
```

### 3️⃣ Configurar o Banco de Dados

#### Opção A - Via Neon Console (Recomendado)

1. Acesse [console.neon.tech](https://console.neon.tech)
2. Faça login na sua conta
3. Abra seu projeto
4. Clique em **"SQL Editor"** no menu lateral
5. Copie todo o conteúdo do arquivo `database/schema.sql`
6. Cole no editor e clique em **"Run"**
7. Aguarde a confirmação de sucesso

#### Opção B - Via Terminal (com psql)

```bash
# Voltar para a raiz
cd ..

# Executar schema
psql 'sua-connection-string' -f database/schema.sql

# (Opcional) Inserir dados de teste
psql 'sua-connection-string' -f database/seed.sql
```

### 4️⃣ Iniciar o Backend

```bash
cd backend
npm run dev
```

**Você deve ver:**
```
🚀 Servidor rodando na porta 3001
📍 API disponível em http://localhost:3001/api
✅ Conectado ao Neon Postgres
```

### 5️⃣ Configurar o Frontend

Em outro terminal:

```bash
# Voltar para a raiz
cd ..

# Instalar dependências
npm install

# Iniciar o frontend
npm run dev
```

### 6️⃣ Acessar a Aplicação

Abra o navegador em: **http://localhost:5173**

### ✅ Checklist de Verificação

- [ ] Backend rodando na porta 3001
- [ ] Frontend rodando na porta 5173
- [ ] Endpoint `/api/health` retornando `"status": "ok"`
- [ ] Tabelas criadas no banco de dados
- [ ] Login funcionando

---

## 🔐 Sistema de Autenticação

### Visão Geral

Sistema completo de autenticação implementado com controle de acesso por módulos e tipos de usuário.

### Tipos de Usuário

#### Admin
- **Email:** admin@bantu.com
- **Senha:** 123456
- **Permissões:** Acesso total a todos os módulos

#### Colaborador
- **Email:** colaborador@bantu.com
- **Senha:** 123456
- **Permissões:** Acesso apenas ao módulo Hotelaria

### Módulos Disponíveis

- `HOTELARIA` - Sistema de gestão hoteleira
- `ARMAZEM` - Gestão de estoque e armazém
- `COMERCIAL` - Gestão comercial
- `RESTAURANTE` - Gestão de restaurante

### Como Usar

#### 1. Proteger uma Rota

```tsx
import { ProtectedRoute } from '@components/auth';
import { Module } from '@types';

// Rota simples protegida
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>

// Rota com verificação de módulo
<Route
  path="/hotelaria"
  element={
    <ProtectedRoute requiredModule={Module.HOTELARIA}>
      <HotelariaPage />
    </ProtectedRoute>
  }
/>

// Rota apenas para admin
<Route
  path="/admin"
  element={
    <ProtectedRoute adminOnly={true}>
      <AdminPage />
    </ProtectedRoute>
  }
/>
```

#### 2. Usar o Hook useAuth

```tsx
import useAuth from '@hooks/useAuth';
import { Module } from '@types';

function MyComponent() {
  const { 
    user,                    // Dados do usuário
    isAuthenticated,         // Status de autenticação
    isLoading,              // Estado de carregamento
    login,                  // Função de login
    logout,                 // Função de logout
    hasModuleAccess,        // Verificar acesso a módulo
    isAdmin                 // Verificar se é admin
  } = useAuth();

  const canAccessHotelaria = hasModuleAccess(Module.HOTELARIA);
  const userIsAdmin = isAdmin();

  return (
    <div>
      {user && <p>Olá, {user.name}</p>}
      {canAccessHotelaria && <button>Acessar Hotelaria</button>}
    </div>
  );
}
```

#### 3. Fazer Login Programaticamente

```tsx
import useAuth from '@hooks/useAuth';

function LoginComponent() {
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login({
        email: 'admin@bantu.com',
        password: '123456'
      });
      // Login bem-sucedido
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

### Arquitetura de Autenticação

```
┌─────────────────────────────────────────┐
│           App.tsx (Router)              │
│         ┌─────────────────┐             │
│         │  AuthProvider   │             │
│         └────────┬────────┘             │
│                  │                       │
│     ┌────────────┴────────────┐         │
│     │                         │         │
│  ┌──▼──────┐          ┌──────▼───────┐ │
│  │  Login  │          │ Protected    │ │
│  │  Page   │          │ Routes       │ │
│  └─────────┘          └──────────────┘ │
└─────────────────────────────────────────┘
```

### Segurança

#### Implementado
- ✅ Armazenamento de token JWT
- ✅ Verificação de autenticação em rotas
- ✅ Controle de acesso por módulo
- ✅ Controle de acesso por role
- ✅ Logout com limpeza de dados

#### Para Produção
- [ ] Implementar backend real
- [ ] Usar httpOnly cookies
- [ ] Adicionar refresh token
- [ ] Implementar CSRF protection
- [ ] Adicionar rate limiting
- [ ] Timeout de sessão

---

## 📡 Backend API

### Endpoints Disponíveis

#### Health Check
- `GET /api/health` - Verifica status do servidor e conexão com banco

#### Quartos
- `GET /api/rooms` - Listar todos os quartos
- `GET /api/rooms/:id` - Buscar quarto por ID
- `POST /api/rooms` - Criar novo quarto
- `PUT /api/rooms/:id` - Atualizar quarto
- `DELETE /api/rooms/:id` - Excluir quarto

#### Hóspedes
- `GET /api/guests` - Listar todos os hóspedes
- `GET /api/guests/:id` - Buscar hóspede por ID
- `POST /api/guests` - Criar novo hóspede
- `PUT /api/guests/:id` - Atualizar hóspede
- `DELETE /api/guests/:id` - Excluir hóspede

#### Reservas
- `GET /api/bookings` - Listar todas as reservas
- `GET /api/bookings/:id` - Buscar reserva por ID
- `POST /api/bookings` - Criar nova reserva
- `PUT /api/bookings/:id` - Atualizar reserva
- `DELETE /api/bookings/:id` - Excluir reserva

#### Consumíveis
- `GET /api/consumables` - Listar todos os consumíveis
- `GET /api/consumables/:id` - Buscar consumível por ID
- `POST /api/consumables` - Criar novo consumível
- `PUT /api/consumables/:id` - Atualizar consumível
- `DELETE /api/consumables/:id` - Excluir consumível

#### Funcionários
- `GET /api/employees` - Listar todos os funcionários
- `GET /api/employees/:id` - Buscar funcionário por ID
- `POST /api/employees` - Criar novo funcionário
- `PUT /api/employees/:id` - Atualizar funcionário
- `DELETE /api/employees/:id` - Excluir funcionário

### Exemplo de Requisição

```bash
# Health Check
curl http://localhost:3001/api/health

# Listar quartos
curl http://localhost:3001/api/rooms

# Criar quarto
curl -X POST http://localhost:3001/api/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "number": "101",
    "type": "single",
    "price": 150.00,
    "status": "available"
  }'
```

---

## 🗄️ Banco de Dados

### Estrutura do Banco (Neon Postgres)

#### Tabelas Principais

1. **rooms** - Quartos do hotel
   - id, number, type, price, status, description

2. **guests** - Hóspedes
   - id, name, email, phone, document, address, city, state, country

3. **bookings** - Reservas
   - id, room_id, guest_id, check_in, check_out, total_price, status, notes

4. **consumables** - Consumíveis (minibar, etc)
   - id, name, category, price, stock

5. **employees** - Funcionários
   - id, name, email, phone, position, department, salary, hire_date, nationality

6. **pos_transactions** - Transações do POS
   - id, employee_id, total, payment_method, status, created_at

7. **pos_transaction_items** - Itens das transações
   - id, transaction_id, consumable_id, quantity, unit_price, total_price

8. **room_consumables** - Consumíveis por quarto
   - id, room_id, consumable_id, quantity

### Migrações Disponíveis

Localização: `database/migrations/`

- `add_consumables_to_rooms.sql` - Adiciona consumíveis aos quartos
- `add_nationality_to_employees.sql` - Adiciona nacionalidade aos funcionários
- `fix_cleaning_system.sql` - Corrige sistema de limpeza
- `update_bookings_schema.sql` - Atualiza schema de reservas

### Como Executar Migrações

1. Acesse o dashboard do Neon (neon.tech)
2. Faça login na conta
3. Selecione o projeto bantu-4
4. Vá para a aba "SQL Editor" ou "Query"
5. Copie e cole o conteúdo do script SQL
6. Execute o script

**Ou use ferramentas como:**
- pgAdmin
- DBeaver
- psql (linha de comando)
- Qualquer cliente PostgreSQL

---

## 🎨 Componentes UI

### Modal Component

Componente Modal reutilizável e adaptável para todas as páginas.

#### Características
- ✅ Reutilizável
- ✅ Responsivo
- ✅ Acessível (fecha com ESC)
- ✅ Customizável
- ✅ Previne scroll do body

#### Uso Básico

```tsx
import Modal from '@components/ui/Modal';

function MyPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Abrir Modal</button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Título do Modal"
        size="md"
      >
        <p>Conteúdo do modal...</p>
      </Modal>
    </>
  );
}
```

#### Tamanhos Disponíveis

- **`sm`** - `max-w-md` (448px) - Confirmações simples
- **`md`** - `max-w-2xl` (672px) - Formulários médios (padrão)
- **`lg`** - `max-w-4xl` (896px) - Formulários grandes
- **`xl`** - `max-w-6xl` (1152px) - Conteúdo extenso
- **`full`** - `max-w-full` - Largura total

### Outros Componentes UI

- **Button** - Botão customizável com variantes
- **Input** - Campo de entrada com validação
- **StatusBadge** - Badge de status colorido
- **ModuleCard** - Card para módulos do sistema

---

## 🏨 Módulos do Sistema

### 1. Hotelaria (Implementado)

**Funcionalidades:**
- ✅ Gestão de quartos
- ✅ Cadastro de hóspedes
- ✅ Sistema de reservas
- ✅ Controle de consumíveis
- ✅ Gestão de funcionários
- ✅ Sistema POS (Point of Sale)

**Páginas:**
- `/hotelaria` - Dashboard principal
- `/hotelaria/rooms` - Gestão de quartos
- `/hotelaria/guests` - Gestão de hóspedes
- `/hotelaria/bookings` - Gestão de reservas
- `/hotelaria/consumables` - Gestão de consumíveis
- `/hotelaria/employees` - Gestão de funcionários
- `/hotelaria/pos` - Sistema POS

### 2. Armazém (Em Desenvolvimento)

**Funcionalidades Planejadas:**
- [ ] Gestão de estoque
- [ ] Controle de produtos
- [ ] Inventário
- [ ] Movimentações

### 3. Comercial (Em Desenvolvimento)

**Funcionalidades Planejadas:**
- [ ] Gestão de vendas
- [ ] Cadastro de clientes
- [ ] Relacionamento (CRM)
- [ ] Relatórios comerciais

### 4. Restaurante (Em Desenvolvimento)

**Funcionalidades Planejadas:**
- [ ] Gestão de cardápio
- [ ] Sistema de pedidos
- [ ] Controle de mesas
- [ ] Gestão de atendimento

---

## 📜 Scripts Disponíveis

### Frontend

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Gera build de produção
npm run preview  # Visualiza build localmente
npm run lint     # Executa linting do código
```

### Backend

```bash
npm run dev      # Inicia servidor com hot reload
npm run build    # Compila TypeScript
npm start        # Inicia servidor em produção
```

---

## 🚀 Deploy

### Build de Produção

#### Frontend
```bash
npm run build
```
A pasta `dist` conterá os arquivos para deploy.

#### Backend
```bash
cd backend
npm run build
npm start
```

### Plataformas Recomendadas

- **Frontend:** Vercel, Netlify, Cloudflare Pages
- **Backend:** Railway, Render, Fly.io
- **Banco de Dados:** Neon (já configurado)

### Variáveis de Ambiente para Produção

**Frontend (.env):**
```env
VITE_API_URL=https://sua-api.com/api
```

**Backend (.env):**
```env
DATABASE_URL=sua-connection-string
PORT=3001
NODE_ENV=production
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
cd backend
npm install
```

### Erro: "Connection refused" ou "ECONNREFUSED"
- Verifique se a connection string do Neon está correta no `.env`
- Teste a conexão diretamente no Neon Console

### Erro: "relation does not exist"
- Execute o arquivo `schema.sql` no Neon SQL Editor
- Verifique se as tabelas foram criadas

### Porta 3001 já está em uso
Altere a porta no arquivo `backend/.env`:
```env
PORT=3002
```

E também em `src/services/axios.ts`:
```typescript
baseURL: 'http://localhost:3002/api'
```

### Erro de autenticação
- Limpe o localStorage do navegador
- Verifique se o AuthProvider está envolvendo as rotas
- Confirme que as credenciais estão corretas

### Modal não abre
- Verifique se o estado `isOpen` está sendo atualizado
- Confirme que o Modal está dentro do DOM

---

## 📝 Changelog

### [2.0.0] - 2025-10-06

#### Adicionado
- ✅ Sistema completo de autenticação
- ✅ Controle de acesso por módulos
- ✅ Tipos de usuário (Admin, Colaborador)
- ✅ Página de login
- ✅ Componente ProtectedRoute
- ✅ Contexto de autenticação
- ✅ Serviço de autenticação
- ✅ Documentação completa do sistema de auth

### [1.1.0] - 2025-09-24

#### Adicionado
- ✅ Configuração de aliases de importação
- ✅ Arquivos barrel (index.ts) para exportação organizada
- ✅ Documentação atualizada sobre aliases
- ✅ Tipagem TypeScript aprimorada

#### Alterado
- Atualizadas importações para usar aliases
- Melhorada organização dos componentes
- Refatoração para melhor tipagem

#### Removido
- Importações relativas desnecessárias
- Código duplicado

### [1.0.0] - Inicial

#### Adicionado
- ✅ Backend Node.js/Express com TypeScript
- ✅ Conexão com Neon Postgres
- ✅ 5 rotas CRUD (rooms, guests, bookings, consumables, employees)
- ✅ Frontend React com TypeScript
- ✅ Integração frontend-backend completa
- ✅ Componente Modal reutilizável
- ✅ Sistema de módulos

---

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use **ESLint** para análise estática
- Formate com **Prettier**
- Mantenha **tipagem TypeScript** estrita
- Siga as **convenções de nomenclatura**
- Documente componentes complexos

---

## 📋 Roadmap

### Curto Prazo
- [ ] Implementar recuperação de senha
- [ ] Adicionar 2FA (autenticação de dois fatores)
- [ ] Implementar sistema de notificações
- [ ] Adicionar testes unitários

### Médio Prazo
- [ ] Desenvolver módulo Armazém
- [ ] Desenvolver módulo Comercial
- [ ] Desenvolver módulo Restaurante
- [ ] Adicionar relatórios avançados

### Longo Prazo
- [ ] Sistema de permissões granulares
- [ ] Logs de auditoria
- [ ] Dashboard analytics
- [ ] Aplicativo mobile
- [ ] Documentação Storybook

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 📞 Suporte

Para dúvidas ou suporte:
- 📧 Email: suporte@bantu.com
- 📱 WhatsApp: +244 XXX XXX XXX
- 🌐 Website: www.bantu.com

---

**Desenvolvido com ❤️ pela equipe Bantu**
