import { Router } from 'express';
import pool from '../config/database';

const router = Router();

// GET - Listar todas as reservas (com dados de hóspede e quarto)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.*,
        g.name as guest_name, g.email as guest_email, g.phone as guest_phone,
        r.number as room_number, r.type as room_type, r.price as room_price
      FROM bookings b
      LEFT JOIN guests g ON b.guest_id = g.id
      LEFT JOIN rooms r ON b.room_id = r.id
      ORDER BY b.check_in DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    res.status(500).json({ error: 'Erro ao buscar reservas' });
  }
});

// GET - Buscar reserva por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        b.*,
        g.name as guest_name, g.email as guest_email, g.phone as guest_phone,
        r.number as room_number, r.type as room_type, r.price as room_price
      FROM bookings b
      LEFT JOIN guests g ON b.guest_id = g.id
      LEFT JOIN rooms r ON b.room_id = r.id
      WHERE b.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar reserva:', error);
    res.status(500).json({ error: 'Erro ao buscar reserva' });
  }
});

// POST - Criar nova reserva
router.post('/', async (req, res) => {
  try {
    const { guest_id, room_id, check_in, check_out, status, total_amount, guests_count, special_requests, payment_method, consumables_cost } = req.body;
    
    const result = await pool.query(
      `INSERT INTO bookings (guest_id, room_id, check_in, check_out, status, total_amount, guests_count, special_requests, payment_method, consumables_cost)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [guest_id, room_id, check_in, check_out, status || 'confirmed', total_amount, guests_count, special_requests, payment_method, consumables_cost || 0]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({ error: 'Erro ao criar reserva' });
  }
});

// PUT - Atualizar reserva
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { guest_id, room_id, check_in, check_out, status, total_amount, guests_count, special_requests, payment_method, consumables_cost } = req.body;
    
    const result = await pool.query(
      `UPDATE bookings 
       SET guest_id = $1, room_id = $2, check_in = $3, check_out = $4, 
           status = $5, total_amount = $6, guests_count = $7, special_requests = $8, payment_method = $9, consumables_cost = $10
       WHERE id = $11
       RETURNING *`,
      [guest_id, room_id, check_in, check_out, status, total_amount, guests_count, special_requests, payment_method, consumables_cost || 0, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar reserva:', error);
    res.status(500).json({ error: 'Erro ao atualizar reserva' });
  }
});

// DELETE - Excluir reserva
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM bookings WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }
    
    res.json({ message: 'Reserva excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir reserva:', error);
    res.status(500).json({ error: 'Erro ao excluir reserva' });
  }
});

export default router;
