import { Router } from 'express';
import pool from '../config/database';

const router = Router();

// GET - Buscar logs de limpeza por quarto
router.get('/room/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const result = await pool.query(`
      SELECT 
        cl.id,
        cl.room_id,
        cl.employee_id,
        cl.started_at,
        cl.completed_at,
        cl.notes,
        cl.created_at,
        json_build_object(
          'id', e.id,
          'name', e.name,
          'position', e.position,
          'email', e.email
        ) as employee
      FROM room_cleaning_logs cl
      LEFT JOIN employees e ON cl.employee_id = e.id
      WHERE cl.room_id = $1
      ORDER BY cl.started_at DESC
    `, [roomId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar logs de limpeza do quarto:', error);
    res.status(500).json({ error: 'Erro ao buscar logs de limpeza do quarto' });
  }
});

// GET - Buscar log de limpeza ativo (em andamento) de um quarto
router.get('/room/:roomId/active', async (req, res) => {
  try {
    const { roomId } = req.params;
    const result = await pool.query(`
      SELECT 
        cl.id,
        cl.room_id,
        cl.employee_id,
        cl.started_at,
        cl.completed_at,
        cl.notes,
        cl.created_at,
        json_build_object(
          'id', e.id,
          'name', e.name,
          'position', e.position,
          'email', e.email
        ) as employee
      FROM room_cleaning_logs cl
      LEFT JOIN employees e ON cl.employee_id = e.id
      WHERE cl.room_id = $1 AND cl.completed_at IS NULL
      ORDER BY cl.started_at DESC
      LIMIT 1
    `, [roomId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Nenhuma limpeza ativa encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar limpeza ativa:', error);
    res.status(500).json({ error: 'Erro ao buscar limpeza ativa' });
  }
});

// POST - Iniciar nova limpeza
router.post('/', async (req, res) => {
  try {
    const { room_id, employee_id } = req.body;
    
    console.log('Iniciando limpeza:', { room_id, employee_id });
    
    // Validar parâmetros
    if (!room_id || !employee_id) {
      return res.status(400).json({ error: 'room_id e employee_id são obrigatórios' });
    }
    
    // Verificar se já existe limpeza ativa para este quarto
    const activeCheck = await pool.query(
      'SELECT id FROM room_cleaning_logs WHERE room_id = $1 AND completed_at IS NULL',
      [room_id]
    );
    
    if (activeCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Já existe uma limpeza em andamento para este quarto' });
    }
    
    // Atualizar status do quarto para cleaning-in-progress
    await pool.query(
      'UPDATE rooms SET status = $1 WHERE id = $2',
      ['cleaning-in-progress', room_id]
    );
    
    // Registrar início da limpeza
    const result = await pool.query(
      `INSERT INTO room_cleaning_logs (room_id, employee_id, started_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       RETURNING *`,
      [room_id, employee_id]
    );
    
    console.log('Limpeza iniciada com sucesso:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro detalhado ao iniciar limpeza:', error);
    res.status(500).json({ 
      error: 'Erro ao iniciar limpeza',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// PUT - Completar limpeza (adicionar anotações e marcar como concluída)
router.put('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    // Buscar log para obter room_id
    const logResult = await pool.query(
      'SELECT room_id FROM room_cleaning_logs WHERE id = $1',
      [id]
    );
    
    if (logResult.rows.length === 0) {
      return res.status(404).json({ error: 'Log de limpeza não encontrado' });
    }
    
    const { room_id } = logResult.rows[0];
    
    // Atualizar status do quarto para disponível
    await pool.query(
      'UPDATE rooms SET status = $1 WHERE id = $2',
      ['available', room_id]
    );
    
    // Finalizar log de limpeza
    const result = await pool.query(
      `UPDATE room_cleaning_logs 
       SET completed_at = CURRENT_TIMESTAMP, notes = $1
       WHERE id = $2
       RETURNING *`,
      [notes, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao completar limpeza:', error);
    res.status(500).json({ error: 'Erro ao completar limpeza' });
  }
});

export default router;
