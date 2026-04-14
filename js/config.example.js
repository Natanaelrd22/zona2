// Supabase Configuration - EJEMPLO
// ⚠️ ESTE ARCHIVO ES SOLO COMO REFERENCIA
// Copia este archivo a config.js y reemplaza con tus credenciales

const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// Validate configuration
function isConfigured() {
    return SUPABASE_URL !== 'https://tu-proyecto.supabase.co' &&
           SUPABASE_ANON_KEY !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
}

// Initialize Supabase client only if configured
let supabase = null;

if (isConfigured()) {
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (error) {
        console.error('Error initializing Supabase:', error);
    }
} else {
    console.warn('⚠️ Supabase no configurado. Abre js/config.js y agrega tus credenciales.');
}

// Admin credentials (for reference only)
const ADMIN_EMAIL = 'ministrylion@gmail.com';
