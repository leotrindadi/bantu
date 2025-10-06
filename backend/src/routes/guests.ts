import { Router } from 'express';
import pool from '../config/database';

const router = Router();

// GET - Listar todos os hóspedes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM guests ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar hóspedes:', error);
    res.status(500).json({ error: 'Erro ao buscar hóspedes' });
  }
});

// GET - Buscar hóspede por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM guests WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hóspede não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar hóspede:', error);
    res.status(500).json({ error: 'Erro ao buscar hóspede' });
  }
});

// POST - Criar novo hóspede
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, document, nationality, address } = req.body;
    
    const result = await pool.query(
      `INSERT INTO guests (name, email, phone, document, nationality, address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, email, phone, document, nationality, address]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar hóspede:', error);
    res.status(500).json({ error: 'Erro ao criar hóspede' });
  }
});

// PUT - Atualizar hóspede
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, document, nationality, address } = req.body;
    
    const result = await pool.query(
      `UPDATE guests 
       SET name = $1, email = $2, phone = $3, document = $4, 
           nationality = $5, address = $6
       WHERE id = $7
       RETURNING *`,
      [name, email, phone, document, nationality, address, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hóspede não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar hóspede:', error);
    res.status(500).json({ error: 'Erro ao atualizar hóspede' });
  }
});

// DELETE - Excluir hóspede
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM guests WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hóspede não encontrado' });
    }
    
    res.json({ message: 'Hóspede excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir hóspede:', error);
    res.status(500).json({ error: 'Erro ao excluir hóspede' });
  }
});

export default router;
