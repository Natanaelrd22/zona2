// Authentication Management
let currentUser = null;
let isAdmin = false;

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Verify Supabase is available
    if (!supabase) {
        showSetupWarning();
        return;
    }
    
    // Check if auth module is available
    if (!supabase.auth) {
        console.error('Supabase Auth module not available');
        showSetupWarning();
        return;
    }
    
    try {
        const { data: { session } } = await supabase.auth.getSession();
        updateAuthUI(session);
    } catch (error) {
        console.error('Error checking auth:', error);
        showSetupWarning();
    }
});

// Login function
async function login(email, password) {
    if (!supabase) {
        return { success: false, error: 'Supabase no configurado. Abre js/config.js y agrega tus credenciales.' };
    }
    
    try {
        // Intentar cerrar sesión previa para limpiar estados residuales
        await supabase.auth.signOut().catch(() => {});

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim()
        });

        if (error) throw error;

        updateAuthUI(data.session);
        return { success: true };
    } catch (error) {
        console.error('Login error detail:', error);
        let customMessage = error.message;
        
        // Traducir y clarificar errores comunes de Supabase Auth
        if (error.status === 400 && error.message === 'Invalid login credentials') {
            customMessage = 'Correo o contraseña incorrectos. Asegúrate de que el usuario esté "Confirmado" en el panel de Supabase.';
        } else if (error.message === 'Email logins are disabled') {
            customMessage = 'El inicio de sesión por correo está desactivado en el panel de Supabase (Authentication > Providers).';
        }
        return { success: false, error: customMessage };
    }
}

// Logout function
async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        currentUser = null;
        isAdmin = false;
        updateAuthUI(null);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Update UI based on auth state
function updateAuthUI(session) {
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');

    if (session) {
        currentUser = session.user;
        isAdmin = session.user.email === 'ministrylion@gmail.com';

        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'block';
    } else {
        currentUser = null;
        isAdmin = false;

        if (loginLink) loginLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'none';
    }

    // Show/hide admin-only elements
    showAdminOnly();
}

// Check if user is admin
function requireAdmin() {
    if (!isAdmin) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Show admin-only elements
function showAdminOnly() {
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => {
        if (isAdmin) {
            // Restore original display style based on element type
            const originalDisplay = el.tagName === 'BUTTON' || el.tagName === 'SPAN' || el.tagName === 'A' ? 'inline-block' : 'block';
            el.style.display = originalDisplay;
        } else {
            el.style.display = 'none';
        }
    });
}

// Show/hide loading
function showLoading(element) {
    element.innerHTML = '<div class="loading">Cargando</div>';
}

// Show empty state
function showEmpty(element, message = 'No hay registros todavía') {
    element.innerHTML = `
        <div class="empty-state">
            <p>${message}</p>
        </div>
    `;
}

// Show alert message
function showAlert(container, message, type = 'error') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    container.appendChild(alertDiv);
    
    setTimeout(() => alertDiv.remove(), 5000);
}

// Show setup warning message
function showSetupWarning() {
    // Only show on pages that need Supabase
    const container = document.querySelector('.container') || document.body;
    
    const warningHtml = `
        <div style="max-width: 600px; margin: 3rem auto; padding: 2rem; background: #fef3c7; 
                     border: 2px solid #f59e0b; border-radius: 12px; text-align: center;">
            <h2 style="color: #92400e; margin-bottom: 1rem;">⚠️ Configuración Requerida</h2>
            <p style="color: #78350f; margin-bottom: 1rem;">
                La aplicación necesita configuración de Supabase para funcionar.
            </p>
            <ol style="text-align: left; color: #78350f; margin: 1rem 0;">
                <li>Crea una cuenta en <a href="https://supabase.com" target="_blank" style="color: #1e40af;">supabase.com</a></li>
                <li>Crea un nuevo proyecto</li>
                <li>Ejecuta el script <code>database/schema.sql</code> en el SQL Editor</li>
                <li>Crea un usuario admin en Authentication</li>
                <li>Abre <code>js/config.js</code> y agrega tus credenciales</li>
            </ol>
            <p style="color: #78350f; margin-top: 1rem;">
                📖 Lee <strong>GUIA_DE_CONFIGURACION.md</strong> para instrucciones detalladas
            </p>
        </div>
    `;
    
    // Insert after navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.insertAdjacentHTML('afterend', warningHtml);
    } else {
        container.insertAdjacentHTML('afterbegin', warningHtml);
    }
}
