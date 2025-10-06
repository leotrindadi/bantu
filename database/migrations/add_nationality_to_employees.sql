-- Adicionar campo nationality e address à tabela employees

ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS nationality VARCHAR(100),
ADD COLUMN IF NOT EXISTS address TEXT;

-- Comentário explicativo
COMMENT ON COLUMN employees.nationality IS 'Nacionalidade do funcionário';
COMMENT ON COLUMN employees.address IS 'Endereço completo do funcionário';
