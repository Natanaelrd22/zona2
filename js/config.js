const SUPABASE_URL = 'https://lolcljygjkclxlemsqaz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvbGNsanlnamtjbHhsZW1zcWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMjMzMjMsImV4cCI6MjA5MTY5OTMyM30.RDtSRC4nd7dixK78CS68qqlhVYilIyzJUE6siiyS2oI';

function isConfigured() {
    return SUPABASE_URL && SUPABASE_ANON_KEY;
}

let supabase = null;

function initSupabase() {
    if (typeof window.supabase === 'undefined') {
        console.error('❌ Supabase CDN no cargó. Verifica tu conexión a internet.');
        return;
    }
    if (typeof window.supabase.createClient !== 'function') {
        console.error('❌ Supabase createClient no disponible.');
        return;
    }
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase configurado correctamente');
        console.log('URL:', SUPABASE_URL);
    } catch (error) {
        console.error('❌ Error creando cliente Supabase:', error.message);
    }
}

initSupabase();
const ADMIN_EMAIL = 'ministrylion@gmail.com';
