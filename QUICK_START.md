# 🚀 Quick Start - Bantu ERP

> Guia rápido para começar a usar o sistema em 5 minutos

---

## ⚡ Início Rápido

### 1. Instalar Dependências

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 2. Configurar Ambiente

```bash
# Backend
cd backend
cp .env.example .env
# Edite o .env com suas credenciais do Neon
cd ..
```

### 3. Criar Tabelas no Banco

1. Acesse [console.neon.tech](https://console.neon.tech)
2. Abra o SQL Editor
3. Execute o arquivo `database/schema.sql`
4. (Opcional) Execute `database/seed.sql` para dados de teste

### 4. Iniciar Servidores

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Acessar Sistema

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001/api/health

---

## 🔐 Login

**Admin (acesso total):**
- Email: `admin@bantu.com`
- Senha: `123456`

**Colaborador (apenas Hotelaria):**
- Email: `colaborador@bantu.com`
- Senha: `123456`

---

## 📚 Documentação Completa

Consulte o arquivo **[README.md](./README.md)** para documentação detalhada.

---

## 🆘 Problemas Comuns

### Backend não conecta ao banco
```bash
# Verifique a connection string no backend/.env
# Teste a conexão no Neon Console
```

### Erro "relation does not exist"
```bash
# Execute o schema.sql no Neon SQL Editor
```

### Porta em uso
```bash
# Altere a porta no backend/.env
PORT=3002
```

---

## 📂 Estrutura Básica

```
bantu-4/
├── backend/          # API Node.js/Express
├── database/         # Scripts SQL
├── src/              # Frontend React
│   ├── components/   # Componentes reutilizáveis
│   ├── features/     # Módulos (Hotelaria, etc)
│   ├── pages/        # Páginas
│   └── services/     # Serviços (API, Auth)
└── README.md         # Documentação completa
```

---

## ✅ Checklist

- [ ] Dependências instaladas
- [ ] .env configurado
- [ ] Tabelas criadas no Neon
- [ ] Backend rodando (porta 3001)
- [ ] Frontend rodando (porta 5173)
- [ ] Login funcionando

---

**Pronto! Seu sistema está rodando! 🎉**
