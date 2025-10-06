import fs from 'fs';
import path from 'path';
import pool from '../config/database';

async function setupDatabase() {
  try {
    console.log('🔧 Configurando banco de dados...');

    // Ler arquivo de schema
    const schemaPath = path.join(__dirname, '../../../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Executar schema
    await pool.query(schema);
    console.log('✅ Schema criado com sucesso!');

    // Ler arquivo de seed (opcional)
    const seedPath = path.join(__dirname, '../../../database/seed.sql');
    if (fs.existsSync(seedPath)) {
      const seed = fs.readFileSync(seedPath, 'utf-8');
      await pool.query(seed);
      console.log('✅ Dados iniciais inseridos com sucesso!');
    }

    console.log('🎉 Banco de dados configurado!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error);
    process.exit(1);
  }
}

setupDatabase();
