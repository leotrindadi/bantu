# 🚀 Guia de Deploy - Vercel + Railway

Este guia está dividido em duas partes:
- **Parte 1**: Alterações já feitas no código (✅ Concluído)
- **Parte 2**: Ações que você precisa tomar para fazer o deploy

---

## ✅ PARTE 1: Alterações no Código (JÁ FEITAS)

### Arquivos Criados:
1. ✅ `.env.example` - Exemplo de variáveis de ambiente do frontend
2. ✅ `vercel.json` - Configuração do Vercel
3. ✅ `backend/railway.json` - Configuração do Railway
4. ✅ `DEPLOYMENT.md` - Este guia

### Arquivos Modificados:
1. ✅ `backend/package.json` - TypeScript movido para `dependencies`
2. ✅ `backend/src/server.ts` - CORS configurado para produção
3. ✅ `backend/.env.example` - Adicionada variável `FRONTEND_URL`

---

## 📋 PARTE 2: Ações que VOCÊ Precisa Tomar

### **Pré-requisitos**
- [ ] Conta no GitHub (para conectar com Vercel e Railway)
- [ ] Repositório Git do projeto (faça push do código)
- [ ] Banco de dados Neon já configurado

---

## 🔧 Passo 1: Preparar Variáveis de Ambiente Locais

### 1.1 - Frontend (.env)
Crie o arquivo `.env` na raiz do projeto:

```bash
# Copie o .env.example
cp .env.example .env
```

Conteúdo do `.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

### 1.2 - Backend (.env)
Crie o arquivo `backend/.env`:

```bash
# Copie o .env.example
cp backend/.env.example backend/.env
```

Conteúdo do `backend/.env`:
```env
DATABASE_URL=postgresql://neondb_owner:npg_ksGKZjqdM46h@ep-cool-tree-ach8fe6a-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## 🚂 Passo 2: Deploy do Backend na Railway

### 2.1 - Criar Projeto na Railway

1. Acesse: https://railway.app
2. Clique em **"Login"** e faça login com GitHub
3. Clique em **"New Project"**
4. Selecione **"Deploy from GitHub repo"**
5. Escolha o repositório do projeto
6. Clique em **"Deploy Now"**

### 2.2 - Configurar Root Directory

1. Após o deploy inicial, clique no serviço criado
2. Vá em **"Settings"**
3. Em **"Root Directory"**, digite: `backend`
4. Clique em **"Save"**

### 2.3 - Adicionar Variáveis de Ambiente

1. Ainda em **"Settings"**, role até **"Variables"**
2. Clique em **"+ New Variable"**
3. Adicione as seguintes variáveis:

```env
DATABASE_URL=postgresql://neondb_owner:npg_ksGKZjqdM46h@ep-cool-tree-ach8fe6a-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require
NODE_ENV=production
FRONTEND_URL=https://seu-projeto.vercel.app
```

⚠️ **IMPORTANTE**: Você vai precisar atualizar `FRONTEND_URL` depois do deploy na Vercel.

### 2.4 - Obter URL do Backend

1. Vá para a aba **"Settings"**
2. Role até **"Domains"**
3. Copie a URL gerada (ex: `https://bantu-backend-production.up.railway.app`)
4. **Guarde essa URL** - você vai precisar dela no próximo passo!

### 2.5 - Verificar Deploy

1. Acesse a URL do backend + `/api/health`
2. Exemplo: `https://bantu-backend-production.up.railway.app/api/health`
3. Você deve ver: `{"status":"ok","database":"connected"}`

---

## ▲ Passo 3: Deploy do Frontend na Vercel

### 3.1 - Criar Projeto na Vercel

1. Acesse: https://vercel.com
2. Clique em **"Login"** e faça login com GitHub
3. Clique em **"Add New Project"**
4. Selecione o repositório do projeto
5. Clique em **"Import"**

### 3.2 - Configurar Projeto

Na tela de configuração:

1. **Framework Preset**: Vite (detectado automaticamente)
2. **Root Directory**: `.` (raiz do projeto)
3. **Build Command**: `npm run build` (já configurado)
4. **Output Directory**: `dist` (já configurado)

### 3.3 - Adicionar Variável de Ambiente

1. Expanda **"Environment Variables"**
2. Adicione:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://bantu-backend-production.up.railway.app/api`
   
   ⚠️ Use a URL do Railway que você copiou no Passo 2.4!

3. Clique em **"Deploy"**

### 3.4 - Obter URL do Frontend

1. Após o deploy, copie a URL gerada
2. Exemplo: `https://bantu-6.vercel.app`

---

## 🔄 Passo 4: Atualizar CORS no Backend

Agora que você tem a URL do frontend na Vercel, precisa atualizar o Railway:

1. Volte para o **Railway**
2. Vá em **"Variables"**
3. Edite a variável `FRONTEND_URL`
4. Coloque a URL da Vercel: `https://bantu-6.vercel.app`
5. O Railway vai fazer redeploy automaticamente

---

## ✅ Passo 5: Testar a Aplicação

### 5.1 - Testar Backend
Acesse: `https://seu-backend.up.railway.app/api/health`

Deve retornar:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-10-06T17:30:00.000Z"
}
```

### 5.2 - Testar Frontend
1. Acesse: `https://seu-projeto.vercel.app`
2. Faça login com:
   - Email: `admin@bantu.com`
   - Senha: `123456`
3. Navegue pelos módulos
4. Verifique se os dados carregam corretamente

---

## 🔧 Configurações Adicionais (Opcional)

### Domínio Customizado na Vercel

1. Vá em **"Settings"** > **"Domains"**
2. Adicione seu domínio
3. Configure os DNS conforme instruções

### Domínio Customizado na Railway

1. Vá em **"Settings"** > **"Domains"**
2. Clique em **"Custom Domain"**
3. Adicione seu domínio
4. Configure os DNS conforme instruções

---

## 🐛 Troubleshooting

### Erro: CORS blocked
**Problema**: Frontend não consegue acessar o backend

**Solução**:
1. Verifique se `FRONTEND_URL` no Railway está correto
2. Confirme que a URL não tem `/` no final
3. Faça redeploy do backend

### Erro: Database connection failed
**Problema**: Backend não conecta ao Neon

**Solução**:
1. Verifique se `DATABASE_URL` está correta no Railway
2. Teste a conexão no Neon Console
3. Confirme que `?sslmode=require` está na URL

### Erro: 404 ao recarregar página
**Problema**: Vercel não encontra rotas do React Router

**Solução**:
- O arquivo `vercel.json` já resolve isso com rewrites
- Se persistir, verifique se o arquivo está na raiz do projeto

### Frontend carrega mas não mostra dados
**Problema**: `VITE_API_URL` incorreta

**Solução**:
1. Vá em **Vercel** > **"Settings"** > **"Environment Variables"**
2. Verifique se `VITE_API_URL` aponta para o Railway
3. Faça redeploy: **"Deployments"** > **"..."** > **"Redeploy"**

---

## 📊 Resumo das URLs

Após o deploy, você terá:

| Serviço | URL | Exemplo |
|---------|-----|---------|
| **Frontend (Vercel)** | `https://seu-projeto.vercel.app` | Interface do usuário |
| **Backend (Railway)** | `https://seu-backend.up.railway.app` | API REST |
| **Database (Neon)** | `postgresql://...` | PostgreSQL |

---

## 🔄 Deploy Contínuo

Ambas as plataformas têm deploy automático:

- **Push para `main`** → Deploy automático na Vercel e Railway
- **Pull Request** → Preview deploy na Vercel
- **Rollback** → Disponível em ambas as plataformas

---

## 💰 Custos

- **Vercel**: Grátis (Hobby Plan)
  - 100 GB bandwidth/mês
  - Builds ilimitados
  
- **Railway**: $5 de crédito grátis/mês
  - Suficiente para projetos pequenos
  - ~550 horas de uptime
  
- **Neon**: Grátis (Free Tier)
  - 10 GB de armazenamento
  - 100 horas de compute/mês

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs:
   - **Vercel**: Deployments > Ver logs
   - **Railway**: Deployments > Ver logs

2. Consulte a documentação:
   - [Vercel Docs](https://vercel.com/docs)
   - [Railway Docs](https://docs.railway.app)

---

**✅ Deploy concluído com sucesso!**

Seu projeto agora está rodando em produção com:
- Frontend otimizado e em CDN global (Vercel)
- Backend escalável (Railway)
- Banco de dados serverless (Neon)
