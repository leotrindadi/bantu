import { Router } from 'express';
import pool from '../config/database';

const router = Router();

// Helper para obter condição de período
function getPeriodCondition(period: string): { startDate: Date; endDate: Date } {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (period) {
    case 'today':
      // Apenas hoje
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
    case 'week':
      // Últimos 7 dias (incluindo hoje)
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
    case 'month':
      // Do dia 1 do mês até hoje
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  }

  return { startDate, endDate };
}

// Helper para calcular período anterior
function getPreviousPeriodCondition(period: string): { startDate: Date; endDate: Date } {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (period) {
    case 'today':
      // Ontem
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
      break;
    case 'week':
      // 7 dias anteriores aos últimos 7 dias
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 13, 0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 23, 59, 59, 999);
      break;
    case 'month':
      // Mês anterior completo
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      startDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1, 0, 0, 0, 0);
      endDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    default:
      const defaultLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      startDate = new Date(defaultLastMonth.getFullYear(), defaultLastMonth.getMonth(), 1, 0, 0, 0, 0);
      endDate = new Date(defaultLastMonth.getFullYear(), defaultLastMonth.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  return { startDate, endDate };
}

// GET - Métricas do dashboard
router.get('/metrics', async (req, res) => {
  try {
    const period = (req.query.period as string) || 'month';
    const { startDate, endDate } = getPeriodCondition(period);
    const previousPeriod = getPreviousPeriodCondition(period);

    console.log('=== Dashboard Metrics Debug ===');
    console.log('Período:', period);
    console.log('Data Início:', startDate);
    console.log('Data Fim:', endDate);
    console.log('Período Anterior - Início:', previousPeriod.startDate);
    console.log('Período Anterior - Fim:', previousPeriod.endDate);

    // Quartos ocupados
    const occupiedResult = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'occupied') as occupied,
        COUNT(*) as total
      FROM rooms
    `);

    // Check-ins no período (conta quando STATUS mudou para checked-in)
    const checkInsResult = await pool.query(`
      SELECT COUNT(*) as count
      FROM bookings
      WHERE updated_at::date >= $1::date AND updated_at::date <= $2::date
      AND status IN ('checked-in', 'checked-out', 'completed')
    `, [startDate, endDate]);
    
    console.log('Check-ins encontrados:', checkInsResult.rows[0].count);

    // Check-ins no período anterior
    const prevCheckInsResult = await pool.query(`
      SELECT COUNT(*) as count
      FROM bookings
      WHERE updated_at::date >= $1::date AND updated_at::date <= $2::date
      AND status IN ('checked-in', 'checked-out', 'completed')
    `, [previousPeriod.startDate, previousPeriod.endDate]);
    
    console.log('Check-ins período anterior:', prevCheckInsResult.rows[0].count);

    // Check-outs no período (conta pela data em que o check-out foi REALIZADO)
    const checkOutsResult = await pool.query(`
      SELECT COUNT(*) as count
      FROM bookings
      WHERE updated_at::date >= $1::date AND updated_at::date <= $2::date
      AND status IN ('checked-out', 'completed')
    `, [startDate, endDate]);
    
    console.log('Check-outs encontrados:', checkOutsResult.rows[0].count);

    // Check-outs no período anterior
    const prevCheckOutsResult = await pool.query(`
      SELECT COUNT(*) as count
      FROM bookings
      WHERE updated_at::date >= $1::date AND updated_at::date <= $2::date
      AND status IN ('checked-out', 'completed')
    `, [previousPeriod.startDate, previousPeriod.endDate]);
    
    console.log('Check-outs período anterior:', prevCheckOutsResult.rows[0].count);

    // Debug receita - verificar dados existentes
    const debugRevenue = await pool.query(`
      SELECT id, total_amount, status, check_in 
      FROM bookings 
      WHERE status IN ('checked-in', 'checked-out', 'completed')
      LIMIT 5
    `);
    console.log('=== DEBUG RECEITA ===');
    console.log('Bookings com receita:', debugRevenue.rows);

    // Receita no período (quando check-in foi REALIZADO)
    const revenueResult = await pool.query(`
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM bookings
      WHERE updated_at::date >= $1::date AND updated_at::date <= $2::date
      AND status IN ('checked-in', 'checked-out', 'completed')
    `, [startDate, endDate]);
    
    console.log('Receita encontrada:', revenueResult.rows[0].total);

    // Receita no período anterior
    const prevRevenueResult = await pool.query(`
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM bookings
      WHERE updated_at::date >= $1::date AND updated_at::date <= $2::date
      AND status IN ('checked-in', 'checked-out', 'completed')
    `, [previousPeriod.startDate, previousPeriod.endDate]);
    
    console.log('Receita período anterior:', prevRevenueResult.rows[0].total);

    // Limpezas em andamento
    const cleaningsResult = await pool.query(`
      SELECT COUNT(*) as count
      FROM rooms
      WHERE status = 'cleaning-in-progress'
    `);

    // Calcular variações percentuais
    const occupied = occupiedResult.rows[0];
    const checkIns = parseInt(checkInsResult.rows[0].count);
    const prevCheckIns = parseInt(prevCheckInsResult.rows[0].count);
    const checkOuts = parseInt(checkOutsResult.rows[0].count);
    const prevCheckOuts = parseInt(prevCheckOutsResult.rows[0].count);
    const revenue = parseFloat(revenueResult.rows[0].total);
    const prevRevenue = parseFloat(prevRevenueResult.rows[0].total);
    const cleanings = parseInt(cleaningsResult.rows[0].count);

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    res.json({
      occupied: `${occupied.occupied}/${occupied.total}`,
      checkIns: checkIns.toString(),
      checkOuts: checkOuts.toString(),
      revenue: `R$ ${revenue.toFixed(2).replace('.', ',')}`,
      cleanings: cleanings.toString(),
      changes: {
        occupied: 0, // Não há histórico de ocupação
        checkIns: calculateChange(checkIns, prevCheckIns),
        checkOuts: calculateChange(checkOuts, prevCheckOuts),
        revenue: calculateChange(revenue, prevRevenue),
        cleanings: 0
      }
    });
  } catch (error) {
    console.error('Erro ao buscar métricas do dashboard:', error);
    res.status(500).json({ error: 'Erro ao buscar métricas do dashboard' });
  }
});

// GET - Últimas atividades (reservas, check-ins, check-outs)
router.get('/recent-activities', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.check_in,
        b.check_out,
        b.status,
        b.created_at,
        b.updated_at,
        r.number as room_number,
        g.name as guest_name
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN guests g ON b.guest_id = g.id
      WHERE b.status IN ('confirmed', 'checked-in', 'checked-out', 'completed')
      ORDER BY b.updated_at DESC
      LIMIT 10
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar atividades recentes:', error);
    res.status(500).json({ error: 'Erro ao buscar atividades recentes' });
  }
});

// GET - Dados de gráfico por métrica e período
router.get('/chart-data', async (req, res) => {
  try {
    const period = (req.query.period as string) || 'month';
    const metric = (req.query.metric as string) || 'occupancy';
    const { startDate, endDate } = getPeriodCondition(period);

    let query = '';
    let params: any[] = [];

    // Determinar granularidade baseado no período
    if (period === 'today') {
      // Gráfico por hora (00h - 23h)
      switch (metric) {
        case 'occupancy':
          query = `
            SELECT 
              EXTRACT(HOUR FROM updated_at)::integer as hour,
              COUNT(*) as value
            FROM bookings
            WHERE updated_at::date = $1::date
            AND status IN ('checked-in', 'checked-out', 'completed')
            GROUP BY hour
            ORDER BY hour ASC
          `;
          params = [startDate];
          break;
        case 'checkIns':
          query = `
            SELECT 
              EXTRACT(HOUR FROM updated_at)::integer as hour,
              COUNT(*) as value
            FROM bookings
            WHERE updated_at::date = $1::date
            AND status IN ('checked-in', 'checked-out', 'completed')
            GROUP BY hour
            ORDER BY hour ASC
          `;
          params = [startDate];
          break;
        case 'checkOuts':
          query = `
            SELECT 
              EXTRACT(HOUR FROM updated_at)::integer as hour,
              COUNT(*) as value
            FROM bookings
            WHERE updated_at::date = $1::date
            AND status IN ('checked-out', 'completed')
            GROUP BY hour
            ORDER BY hour ASC
          `;
          params = [startDate];
          break;
        case 'revenue':
          query = `
            SELECT 
              EXTRACT(HOUR FROM updated_at)::integer as hour,
              COALESCE(SUM(total_amount), 0) as value
            FROM bookings
            WHERE updated_at::date = $1::date
            AND status IN ('checked-in', 'checked-out', 'completed')
            GROUP BY hour
            ORDER BY hour ASC
          `;
          params = [startDate];
          break;
      }
    } else {
      // Gráfico por dia (semana ou mês)
      switch (metric) {
        case 'occupancy':
          query = `
            WITH dates AS (
              SELECT generate_series($1::date, $2::date, '1 day'::interval)::date as date
            )
            SELECT 
              d.date::text,
              COALESCE(COUNT(b.id), 0) as value
            FROM dates d
            LEFT JOIN bookings b ON b.updated_at::date = d.date
              AND b.status IN ('checked-in', 'checked-out', 'completed')
            GROUP BY d.date
            ORDER BY d.date ASC
          `;
          params = [startDate, endDate];
          break;
        case 'checkIns':
          query = `
            WITH dates AS (
              SELECT generate_series($1::date, $2::date, '1 day'::interval)::date as date
            )
            SELECT 
              d.date::text,
              COALESCE(COUNT(b.id), 0) as value
            FROM dates d
            LEFT JOIN bookings b ON b.updated_at::date = d.date
              AND b.status IN ('checked-in', 'checked-out', 'completed')
            GROUP BY d.date
            ORDER BY d.date ASC
          `;
          params = [startDate, endDate];
          break;
        case 'checkOuts':
          query = `
            WITH dates AS (
              SELECT generate_series($1::date, $2::date, '1 day'::interval)::date as date
            )
            SELECT 
              d.date::text,
              COALESCE(COUNT(b.id), 0) as value
            FROM dates d
            LEFT JOIN bookings b ON b.updated_at::date = d.date
              AND b.status IN ('checked-out', 'completed')
            GROUP BY d.date
            ORDER BY d.date ASC
          `;
          params = [startDate, endDate];
          break;
        case 'revenue':
          query = `
            WITH dates AS (
              SELECT generate_series($1::date, $2::date, '1 day'::interval)::date as date
            )
            SELECT 
              d.date::text,
              COALESCE(SUM(b.total_amount), 0) as value
            FROM dates d
            LEFT JOIN bookings b ON b.updated_at::date = d.date
              AND b.status IN ('checked-in', 'checked-out', 'completed')
            GROUP BY d.date
            ORDER BY d.date ASC
          `;
          params = [startDate, endDate];
          break;
      }
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar dados do gráfico:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do gráfico' });
  }
});

export default router;
