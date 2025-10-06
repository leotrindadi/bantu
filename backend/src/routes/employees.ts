import { Router } from 'express';
import pool from '../config/database';

const router = Router();

// GET - Listar todos os funcionários
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM employees ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
    res.status(500).json({ error: 'Erro ao buscar funcionários' });
  }
});

// GET - Buscar funcionário por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar funcionário:', error);
    res.status(500).json({ error: 'Erro ao buscar funcionário' });
  }
});

// POST - Criar novo funcionário
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, document, nationality, address, position, department, salary, hire_date, status } = req.body;
    
    const result = await pool.query(
      `INSERT INTO employees (name, email, phone, document, nationality, address, position, department, salary, hire_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [name, email, phone, document, nationality, address, position, department, salary, hire_date, status || 'active']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar funcionário:', error);
    res.status(500).json({ error: 'Erro ao criar funcionário' });
  }
});

// PUT - Atualizar funcionário
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, document, nationality, address, position, department, salary, hire_date, status } = req.body;
    
    const result = await pool.query(
      `UPDATE employees 
       SET name = $1, email = $2, phone = $3, document = $4, nationality = $5, address = $6,
           position = $7, department = $8, salary = $9, hire_date = $10, status = $11, updated_at = CURRENT_TIMESTAMP
       WHERE id = $12
       RETURNING *`,
      [name, email, phone, document, nationality, address, position, department, salary, hire_date, status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
    res.status(500).json({ error: 'Erro ao atualizar funcionário' });
  }
});

// DELETE - Excluir funcionário
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }
    
    res.json({ message: 'Funcionário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir funcionário:', error);
    res.status(500).json({ error: 'Erro ao excluir funcionário' });
  }
});

export default router;
