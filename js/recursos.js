// Recursos Management JavaScript

let categorias = [];
let selectedCategory = null;

// Load recursos on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCategorias();
    loadRecursos();
});

// Load all categories
async function loadCategorias() {
    const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading categorias:', error);
        return;
    }

    categorias = data || [];
    populateCategoriaSelect();
}

// Populate categoria select in modal
function populateCategoriaSelect() {
    const select = document.getElementById('recursoCategoria');
    
    let html = '<option value="">Seleccionar categoría</option>';
    categorias.forEach(cat => {
        html += `<option value="${cat.id}">${cat.nombre}</option>`;
    });
    
    select.innerHTML = html;
}

// Load all recursos
async function loadRecursos() {
    const container = document.getElementById('recursos-container');
    container.innerHTML = '<div class="loading">Cargando</div>';

    let query = supabase
        .from('recursos')
        .select('*')
        .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
        container.innerHTML = `<div class="alert alert-error">Error al cargar: ${error.message}</div>`;
        return;
    }

    if (!data || data.length === 0) {
        showEmpty(container, 'No hay recursos todavía.');
        return;
    }

    // Group resources by category
    const groupedByCategory = {};
    data.forEach(recurso => {
        const catId = recurso.categoria_id || 'uncategorized';
        if (!groupedByCategory[catId]) {
            groupedByCategory[catId] = [];
        }
        groupedByCategory[catId].push(recurso);
    });

    // Build HTML
    let html = '';
    
    // Render each category
    categorias.forEach(cat => {
        const resources = groupedByCategory[cat.id];
        if (resources && resources.length > 0) {
            html += `
                <div class="category-section">
                    <h2 class="category-title">${cat.nombre}</h2>
                    <ul class="resource-list">
            `;
            
            resources.forEach(recurso => {
                html += `
                    <li class="resource-item">
                        <a href="${recurso.archivo_url}" download class="resource-link">
                            <span class="resource-icon">📄</span>
                            <span class="resource-name">${recurso.nombre}</span>
                        </a>
                        <button onclick="deleteRecurso('${recurso.id}')"
                                class="btn btn-danger btn-sm admin-only"
                                style="display: ${isAdmin ? 'inline-block' : 'none'}">
                            Eliminar
                        </button>
                    </li>
                `;
            });
            
            html += `
                    </ul>
                </div>
            `;
        }
    });

    // Render uncategorized resources
    if (groupedByCategory['uncategorized'] && groupedByCategory['uncategorized'].length > 0) {
        html += `
            <div class="category-section">
                <h2 class="category-title">Sin Categoría</h2>
                <ul class="resource-list">
        `;
        
        groupedByCategory['uncategorized'].forEach(recurso => {
            html += `
                <li class="resource-item">
                    <a href="${recurso.archivo_url}" download class="resource-link">
                        <span class="resource-icon">📄</span>
                        <span class="resource-name">${recurso.nombre}</span>
                    </a>
                    <button onclick="deleteRecurso('${recurso.id}')"
                            class="btn btn-danger btn-sm admin-only"
                            style="display: ${isAdmin ? 'inline-block' : 'none'}">
                        Eliminar
                    </button>
                </li>
            `;
        });
        
        html += `
                </ul>
            </div>
        `;
    }

    container.innerHTML = html;
}

// Open categoria modal
function openCategoriaModal() {
    if (!requireAdmin()) return;
    
    document.getElementById('categoriaForm').reset();
    document.getElementById('categoriaAlert').innerHTML = '';
    openModal('categoriaModal');
}

// Open recurso modal
function openRecursoModal() {
    if (!requireAdmin()) return;
    
    if (categorias.length === 0) {
        alert('Primero debe crear una categoría.');
        return;
    }
    
    document.getElementById('recursoForm').reset();
    document.getElementById('recursoAlert').innerHTML = '';
    populateCategoriaSelect();
    openModal('recursoModal');
}

// Handle categoria form submission
document.getElementById('categoriaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!requireAdmin()) return;

    const alertContainer = document.getElementById('categoriaAlert');
    alertContainer.innerHTML = '';

    const nombre = document.getElementById('categoriaNombre').value;

    // Show loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creando...';

    const { error } = await supabase
        .from('categorias')
        .insert({ nombre });

    if (error) {
        showAlert(alertContainer, 'Error al crear: ' + error.message, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Crear';
    } else {
        closeModal('categoriaModal');
        loadCategorias();
    }
});

// Handle recurso form submission
document.getElementById('recursoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!requireAdmin()) return;

    const alertContainer = document.getElementById('recursoAlert');
    alertContainer.innerHTML = '';

    const nombre = document.getElementById('recursoNombre').value;
    const categoriaId = document.getElementById('recursoCategoria').value;
    const archivo = document.getElementById('recursoArchivo').files[0];

    if (!archivo) {
        showAlert(alertContainer, 'Debe seleccionar un archivo.', 'error');
        return;
    }

    // Show loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Subiendo...';

    try {
        // Upload file to storage
        const fileExt = archivo.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${categoriaId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('recursos')
            .upload(filePath, archivo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = await supabase.storage
            .from('recursos')
            .getPublicUrl(filePath);

        // Insert record in database
        const { error: dbError } = await supabase
            .from('recursos')
            .insert({
                nombre: nombre || archivo.name,
                archivo_url: publicUrl,
                categoria_id: categoriaId
            });

        if (dbError) throw dbError;

        closeModal('recursoModal');
        loadRecursos();
    } catch (error) {
        showAlert(alertContainer, 'Error al subir: ' + error.message, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Subir';
    }
});

// Delete categoria
async function deleteCategoria(id) {
    if (!confirm('¿Está seguro de eliminar esta categoría y todos sus archivos?')) return;
    if (!requireAdmin()) return;

    const { error } = await supabase.from('categorias').delete().eq('id', id);

    if (error) {
        alert('Error al eliminar: ' + error.message);
    } else {
        loadCategorias();
        loadRecursos();
    }
}

// Delete recurso
async function deleteRecurso(id) {
    if (!confirm('¿Está seguro de eliminar este archivo?')) return;
    if (!requireAdmin()) return;

    const { error } = await supabase.from('recursos').delete().eq('id', id);

    if (error) {
        alert('Error al eliminar: ' + error.message);
    } else {
        loadRecursos();
    }
}
