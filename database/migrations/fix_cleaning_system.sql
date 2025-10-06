-- Script para corrigir/aplicar o sistema de limpeza

-- 1. Atualizar constraint de status dos quartos para incluir 'cleaning-in-progress'
ALTER TABLE rooms DROP CONSTRAINT IF EXISTS rooms_status_check;
ALTER TABLE rooms ADD CONSTRAINT rooms_status_check 
    CHECK (status IN ('available', 'occupied', 'maintenance', 'cleaning', 'cleaning-in-progress'));

-- 2. Criar tabela de logs de limpeza se não existir
CREATE TABLE IF NOT EXISTS room_cleaning_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_room_cleaning_logs_room ON room_cleaning_logs(room_id);
CREATE INDEX IF NOT EXISTS idx_room_cleaning_logs_employee ON room_cleaning_logs(employee_id);
CREATE INDEX IF NOT EXISTS idx_room_cleaning_logs_active ON room_cleaning_logs(room_id, completed_at) WHERE completed_at IS NULL;

-- 4. Comentários nas tabelas
COMMENT ON TABLE room_cleaning_logs IS 'Registra histórico de limpezas realizadas nos quartos';
COMMENT ON COLUMN room_cleaning_logs.started_at IS 'Data/hora em que a limpeza foi iniciada';
COMMENT ON COLUMN room_cleaning_logs.completed_at IS 'Data/hora em que a limpeza foi concluída';
COMMENT ON COLUMN room_cleaning_logs.notes IS 'Anotações sobre a limpeza realizada';

-- 5. Verificar se tudo foi criado corretamente
DO $$
BEGIN
    -- Verificar se a constraint foi atualizada
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'rooms'::regclass 
        AND conname = 'rooms_status_check'
        AND pg_get_constraintdef(oid) LIKE '%cleaning-in-progress%'
    ) THEN
        RAISE NOTICE 'ERRO: Constraint de status dos quartos não foi atualizada corretamente';
    ELSE
        RAISE NOTICE 'OK: Constraint de status dos quartos atualizada';
    END IF;

    -- Verificar se a tabela foi criada
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'room_cleaning_logs'
    ) THEN
        RAISE NOTICE 'ERRO: Tabela room_cleaning_logs não foi criada';
    ELSE
        RAISE NOTICE 'OK: Tabela room_cleaning_logs criada';
    END IF;
END $$;
