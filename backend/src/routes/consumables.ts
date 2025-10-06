import { Router } from 'express';
import pool from '../config/database';

const router = Router();

// GET - Listar todos os consumíveis
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM consumables ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar consumíveis:', error);
    res.status(500).json({ error: 'Erro ao buscar consumíveis' });
  }
});

// GET - Buscar consumível por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM consumables WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Consumível não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar consumível:', error);
    res.status(500).json({ error: 'Erro ao buscar consumível' });
  }
});

// POST - Criar novo consumível
router.post('/', async (req, res) => {
  try {
    const { name, category, price, stock, min_stock, unit, description } = req.body;
    
    const result = await pool.query(
      `INSERT INTO consumables (name, category, price, stock, min_stock, unit, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, category, price, stock || 0, min_stock || 10, unit || 'un', description]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar consumível:', error);
    res.status(500).json({ error: 'Erro ao criar consumível' });
  }
});

// PUT - Atualizar consumível
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, stock, min_stock, unit, description } = req.body;
    
    const result = await pool.query(
      `UPDATE consumables 
       SET name = $1, category = $2, price = $3, stock = $4, 
           min_stock = $5, unit = $6, description = $7
       WHERE id = $8
       RETURNING *`,
      [name, category, price, stock, min_stock, unit, description, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Consumível não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar consumível:', error);
    res.status(500).json({ error: 'Erro ao atualizar consumível' });
  }
});

// DELETE - Excluir consumível
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM consumables WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Consumível não encontrado' });
    }
    
    res.json({ message: 'Consumível excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir consumível:', error);
    res.status(500).json({ error: 'Erro ao excluir consumível' });
  }
});

export default router;
