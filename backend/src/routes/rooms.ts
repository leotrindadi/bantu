import { Router } from 'express';
import pool from '../config/database';

const router = Router();

// GET - Listar todos os quartos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM rooms ORDER BY number ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar quartos:', error);
    res.status(500).json({ error: 'Erro ao buscar quartos' });
  }
});

// GET - Buscar quarto por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quarto não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar quarto:', error);
    res.status(500).json({ error: 'Erro ao buscar quarto' });
  }
});

// POST - Criar novo quarto
router.post('/', async (req, res) => {
  try {
    const { number, type, status, price, capacity, amenities, consumables, description } = req.body;
    
    const result = await pool.query(
      `INSERT INTO rooms (number, type, status, price, capacity, amenities, consumables, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [number, type, status || 'available', price, capacity, amenities, consumables || [], description]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar quarto:', error);
    res.status(500).json({ error: 'Erro ao criar quarto' });
  }
});

// PUT - Atualizar quarto
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { number, type, status, price, capacity, amenities, consumables, description } = req.body;
    
    const result = await pool.query(
      `UPDATE rooms 
       SET number = $1, type = $2, status = $3, price = $4, 
           capacity = $5, amenities = $6, consumables = $7, description = $8
       WHERE id = $9
       RETURNING *`,
      [number, type, status, price, capacity, amenities, consumables || [], description, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quarto não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar quarto:', error);
    res.status(500).json({ error: 'Erro ao atualizar quarto' });
  }
});

// DELETE - Excluir quarto
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Excluir o quarto (reservas e logs mantêm o room_id para histórico)
    const result = await pool.query('DELETE FROM rooms WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quarto não encontrado' });
    }
    
    res.json({ message: 'Quarto excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir quarto:', error);
    res.status(500).json({ error: 'Erro ao excluir quarto' });
  }
});

export default router;
