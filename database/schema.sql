-- =============================================
-- Club de Conquistadores - Supabase Database Schema
-- =============================================
-- Ejecutar este script en el SQL Editor de Supabase
-- Para una base de datos NUEVA. 
-- Si ya tienes tablas, usa migration_club.sql en su lugar
-- =============================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. TABLA STAFF
-- =============================================
CREATE TABLE IF NOT EXISTS staff (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    foto TEXT,
    cargo VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. TABLA AVENTUREROS
-- =============================================
CREATE TABLE IF NOT EXISTS aventureros (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    foto TEXT,
    cargo VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    club_dirige VARCHAR(255),
    nombre_club VARCHAR(255),
    logo_club TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. TABLA CONQUISTADORES
-- =============================================
CREATE TABLE IF NOT EXISTS conquistadores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    foto TEXT,
    cargo VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    club_dirige VARCHAR(255),
    nombre_club VARCHAR(255),
    logo_club TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. TABLA GUIAS
-- =============================================
CREATE TABLE IF NOT EXISTS guias (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    foto TEXT,
    cargo VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    club_dirige VARCHAR(255),
    nombre_club VARCHAR(255),
    logo_club TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. TABLA HISTORIA
-- =============================================
CREATE TABLE IF NOT EXISTS historia (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    contenido TEXT,
    foto TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. TABLA CATEGORIAS (para Recursos)
-- =============================================
CREATE TABLE IF NOT EXISTS categorias (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. TABLA RECURSOS
-- =============================================
CREATE TABLE IF NOT EXISTS recursos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    archivo_url TEXT NOT NULL,
    categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ÍNDICES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_recursos_categoria ON recursos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_staff_created ON staff(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_aventureros_created ON aventureros(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conquistadores_created ON conquistadores(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guias_created ON guias(created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE aventureros ENABLE ROW LEVEL SECURITY;
ALTER TABLE conquistadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE guias ENABLE ROW LEVEL SECURITY;
ALTER TABLE historia ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE recursos ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLÍTICAS RLS

-- Políticas para Staff
CREATE POLICY "Staff visible para todos" ON staff FOR SELECT USING (true);
CREATE POLICY "Staff puede ser creado solo por admin" ON staff FOR INSERT WITH CHECK (auth.jwt()->>'email' = 'ministrylion@gmail.com');
CREATE POLICY "Staff puede ser actualizado solo por admin" ON staff FOR UPDATE USING (auth.jwt()->>'email' = 'ministrylion@gmail.com');
CREATE POLICY "Staff puede ser eliminado solo por admin" ON staff FOR DELETE USING (auth.jwt()->>'email' = 'ministrylion@gmail.com');

-- Políticas para Aventureros
CREATE POLICY "Aventureros visible para todos" ON aventureros FOR SELECT USING (true);
CREATE POLICY "Aventureros puede ser creado solo por admin" ON aventureros FOR INSERT WITH CHECK (auth.jwt()->>'email' = 'ministrylion@gmail.com');
CREATE POLICY "Aventureros puede ser actualizado solo por admin" ON aventureros FOR UPDATE USING (auth.jwt()->>'email' = 'ministrylion@gmail.com');
CREATE POLICY "Aventureros puede ser eliminado solo por admin" ON aventureros FOR DELETE USING (auth.jwt()->>'email' = 'ministrylion@gmail.com');

-- Políticas para Conquistadores
CREATE POLICY "Conquistadores visible para todos" ON conquistadores FOR SELECT USING (true);
CREATE POLICY "Conquistadores puede ser creado solo por admin" ON conquistadores FOR INSERT WITH CHECK (auth.jwt()->>'email' = 'ministrylion@gmail.com');
CREATE POLICY "Conquistadores puede ser actualizado solo por admin" ON conquistadores FOR UPDATE USING (auth.jwt()->>'email' = 'ministrylion@gmail.com');
CREATE POLICY "Conquistadores puede ser eliminado solo por admin" ON conquistadores FOR DELETE USING (auth.jwt()->>'email' = 'ministrylion@gmail.com');

-- Políticas para Guias
CREATE POLICY "Guias visible para todos" ON guias FOR SELECT USING (true);
CREATE POLICY "Guias puede ser creado solo por admin" ON guias FOR INSERT WITH CHECK (auth.jwt()->>'email' = 'ministrylion@gmail.com');
CREATE POLICY "Guias puede ser actualizado solo por admin" ON guias FOR UPDATE USING (auth.jwt()->>'email' = 'ministrylion@gmail.com');
CREATE POLICY "Guias puede ser eliminado solo por admin" ON guias FOR DELETE USING (auth.jwt()->>'email' = 'ministrylion@gmail.com');

-- Políticas para Historia
CREATE POLICY "Historia visible para todos" ON historia FOR SELECT USING (true);
CREATE POLICY "Historia puede ser creado solo por admin" ON historia FOR INSERT WITH CHECK (auth.jwt()->>'email' = 'ministrylion@gmail.com');
CREATE POLICY "Historia puede ser actualizado solo por admin" ON historia FOR UPDATE USING (auth.jwt()->>'email' = 'ministrylion@gmail.com');

-- Políticas para Categorias
CREATE POLICY "Categorias visible para todos" ON categorias FOR SELECT USING (true);
CREATE POLICY "Categorias puede ser creado solo por admin" ON categorias FOR INSERT WITH CHECK (auth.jwt()->>'email' = 'ministrylion@gmail.com');
CREATE POLICY "Categorias puede ser actualizado solo por admin" ON categorias FOR UPDATE USING (auth.jwt()->>'email' = 'ministrylion@gmail.com');
CREATE POLICY "Categorias puede ser eliminado solo por admin" ON categorias FOR DELETE USING (auth.jwt()->>'email' = 'ministrylion@gmail.com');

-- Políticas para Recursos
CREATE POLICY "Recursos visible para todos" ON recursos FOR SELECT USING (true);
CREATE POLICY "Recursos puede ser creado solo por admin" ON recursos FOR INSERT WITH CHECK (auth.jwt()->>'email' = 'ministrylion@gmail.com');
CREATE POLICY "Recursos puede ser actualizado solo por admin" ON recursos FOR UPDATE USING (auth.jwt()->>'email' = 'ministrylion@gmail.com');
CREATE POLICY "Recursos puede ser eliminado solo por admin" ON recursos FOR DELETE USING (auth.jwt()->>'email' = 'ministrylion@gmail.com');

-- =============================================
-- STORAGE BUCKETS
-- =============================================

-- Crear buckets de almacenamiento
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('fotos', 'fotos', true),
    ('recursos', 'recursos', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- POLÍTICAS DE STORAGE

-- Políticas para el bucket 'fotos'
CREATE POLICY "Fotos son públicas" ON storage.objects FOR SELECT USING (bucket_id = 'fotos');
CREATE POLICY "Fotos pueden ser subidas solo por admin" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'fotos' AND auth.jwt()->>'email' = 'ministrylion@gmail.com');
CREATE POLICY "Fotos pueden ser eliminadas solo por admin" ON storage.objects FOR DELETE USING (bucket_id = 'fotos' AND auth.jwt()->>'email' = 'ministrylion@gmail.com');

-- Políticas para el bucket 'recursos'
CREATE POLICY "Recursos son públicos" ON storage.objects FOR SELECT USING (bucket_id = 'recursos');
CREATE POLICY "Recursos pueden ser subidos solo por admin" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'recursos' AND auth.jwt()->>'email' = 'ministrylion@gmail.com');
CREATE POLICY "Recursos pueden ser eliminados solo por admin" ON storage.objects FOR DELETE USING (bucket_id = 'recursos' AND auth.jwt()->>'email' = 'ministrylion@gmail.com');

-- =============================================
-- LISTO! ✅
-- =============================================
-- Siguientes pasos:
-- 1. Crear usuario admin en Authentication > Users
--    Email: ministrylion@gmail.com
--    Password: Admin
--
-- 2. Configurar js/config.js con tus credenciales
--
-- 3. Abrir index.html y comenzar a usar!
