import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database';

// Rotas
import roomsRouter from './routes/rooms';
import guestsRouter from './routes/guests';
import bookingsRouter from './routes/bookings';
import consumablesRouter from './routes/consumables';
import employeesRouter from './routes/employees';
import cleaningLogsRouter from './routes/cleaning-logs';
import dashboardRouter from './routes/dashboard';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Desabilitar cache para desenvolvimento
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Rota de health check
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: result.rows[0].now 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Rotas da API
app.use('/api/rooms', roomsRouter);
app.use('/api/guests', guestsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/consumables', consumablesRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/cleaning-logs', cleaningLogsRouter);
app.use('/api/dashboard', dashboardRouter);

// Tratamento de erros global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 API disponível em http://localhost:${PORT}/api`);
});
