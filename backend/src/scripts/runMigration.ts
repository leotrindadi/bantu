import fs from 'fs';
import path from 'path';
import pool from '../config/database';

async function runMigration() {
  try {
    console.log('🔧 Executando migração...');

    // Ler arquivo de migração
    const migrationPath = path.join(__dirname, '../../../database/migrations/add_consumables_to_rooms.sql');
    const migration = fs.readFileSync(migrationPath, 'utf-8');

    // Executar migração
    await pool.query(migration);
    console.log('✅ Migração executada com sucesso!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar migração:', error);
    process.exit(1);
  }
}

runMigration();
