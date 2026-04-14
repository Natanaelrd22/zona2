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
    renderCategories();
    populateCategoriaSelect();
}

// Render categories bar
function renderCategories() {
    const bar = document.getElementById('categories-bar');
    
    let html = '<button class="category-btn active" onclick="filterByCategory(null)">Todos</button>';
    
    categorias.forEach(cat => {
        html += `
            <div style="position: relative; display: inline-block;">
                <button class="category-btn ${selectedCategory === cat.id ? 'active' : ''}" 
                        onclick="filterByCategory('${cat.id}')">
                    ${cat.nombre}
                </button>
                ${isAdmin ? `<button onclick="deleteCategoria('${cat.id}')" 
                    style="position: absolute; top: -8px; right: -8px; background: #dc2626; color: white; 
                    border: none; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; 
                    cursor: pointer; display: none;" class="admin-only">
                    ×
                </button>` : ''}
            </div>
        `;
    });
    
    bar.innerHTML = html;
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

// Filter by category
function filterByCategory(categoryId) {
    selectedCategory = categoryId;
    renderCategories();
    loadRecursos();
}

// Load all recursos
async function loadRecursos() {
    const container = document.getElementById('recursos-container');
    container.innerHTML = '<div class="loading">Cargando</div>';

    let query = supabase
        .from('recursos')
        .select('*')
        .order('created_at', { ascending: false });

    if (selectedCategory) {
        query = query.eq('categoria_id', selectedCategory);
    }

    const { data, error } = await query;

    if (error) {
        container.innerHTML = `<div class="alert alert-error">Error al cargar: ${error.message}</div>`;
        return;
    }

    if (!data || data.length === 0) {
        showEmpty(container, selectedCategory ? 'No hay archivos en esta categoría.' : 'No hay recursos todavía.');
        return;
    }

    container.innerHTML = '';
    data.forEach(recurso => {
        const categoria = categorias.find(c => c.id === recurso.categoria_id);
        
        container.innerHTML += `
            <div class="resource-card">
                <h3>${recurso.nombre}</h3>
                ${categoria ? `<span class="category-tag">${categoria.nombre}</span>` : ''}
                <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                    <a href="${recurso.archivo_url}" download class="btn btn-success" style="flex: 1; text-align: center;">
                        Descargar
                    </a>
                    <button onclick="deleteRecurso('${recurso.id}')" 
                            class="btn btn-danger admin-only" 
                            style="display: ${isAdmin ? 'inline-block' : 'none'}">
                        Eliminar
                    </button>
                </div>
            </div>
        `;
    });
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
