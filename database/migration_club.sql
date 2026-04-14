-- =============================================
-- Club de Conquistadores - Migration Script
-- Para agregar los nuevos campos de Club
-- Ejecutar SOLO si ya tienes las tablas creadas
-- =============================================

-- Agregar columnas a la tabla aventureros
ALTER TABLE aventureros 
ADD COLUMN IF NOT EXISTS club_dirige VARCHAR(255),
ADD COLUMN IF NOT EXISTS nombre_club VARCHAR(255),
ADD COLUMN IF NOT EXISTS logo_club TEXT;

-- Agregar columnas a la tabla conquistadores
ALTER TABLE conquistadores 
ADD COLUMN IF NOT EXISTS club_dirige VARCHAR(255),
ADD COLUMN IF NOT EXISTS nombre_club VARCHAR(255),
ADD COLUMN IF NOT EXISTS logo_club TEXT;

-- Agregar columnas a la tabla guias
ALTER TABLE guias 
ADD COLUMN IF NOT EXISTS club_dirige VARCHAR(255),
ADD COLUMN IF NOT EXISTS nombre_club VARCHAR(255),
ADD COLUMN IF NOT EXISTS logo_club TEXT;

-- =============================================
-- Verificación
-- =============================================
-- Para verificar que las columnas se agregaron:
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'aventureros' 
-- ORDER BY ordinal_position;
