-- Script para verificar se o sistema de limpeza foi configurado corretamente

-- 1. Verificar se a constraint de status dos quartos inclui 'cleaning-in-progress'
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'rooms'::regclass 
AND conname LIKE '%status%';

-- 2. Verificar se a tabela room_cleaning_logs existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'room_cleaning_logs'
) as table_exists;

-- 3. Verificar estrutura da tabela room_cleaning_logs
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'room_cleaning_logs'
ORDER BY ordinal_position;

-- 4. Verificar se os índices foram criados
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'room_cleaning_logs';

-- 5. Testar se podemos inserir um registro de teste (não execute em produção)
-- INSERT INTO room_cleaning_logs (room_id, employee_id, started_at) 
-- VALUES ('test-room-id', 'test-employee-id', CURRENT_TIMESTAMP);
