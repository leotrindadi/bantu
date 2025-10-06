-- Adicionar coluna consumables na tabela rooms
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS consumables UUID[];

-- Comentário explicativo
COMMENT ON COLUMN rooms.consumables IS 'Array de IDs de consumíveis disponíveis no quarto';
