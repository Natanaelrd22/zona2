// Historia Management JavaScript

let historiaData = null;

// Load historia on page load
document.addEventListener('DOMContentLoaded', () => {
    loadHistoria();
});

// Load historia content
async function loadHistoria() {
    const container = document.getElementById('historia-container');
    container.innerHTML = '<div class="loading">Cargando</div>';

    const { data, error } = await supabase
        .from('historia')
        .select('*')
        .single();

    if (error && error.code !== 'PGRST116') {
        container.innerHTML = `<div class="alert alert-error">Error al cargar: ${error.message}</div>`;
        return;
    }

    historiaData = data;

    if (!data) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No hay contenido de historia todavía.</p>
                ${isAdmin ? '<p>Haga clic en "Editar" para agregar contenido.</p>' : ''}
            </div>
        `;
        return;
    }

    // Display historia content
    const imageHtml = data.foto 
        ? `<img src="${data.foto}" alt="Historia" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px; margin-bottom: 2rem;">`
        : '';

    const contentHtml = data.contenido
        ? data.contenido.split('\n').map(p => `<p style="margin-bottom: 1rem; line-height: 1.8;">${p}</p>`).join('')
        : '<p>No hay contenido todavía.</p>';

    container.innerHTML = `
        <div style="background: white; padding: 3rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            ${imageHtml}
            <div style="color: #374151; font-size: 1.125rem;">
                ${contentHtml}
            </div>
        </div>
    `;

    // Show edit button if admin
    if (isAdmin) {
        document.getElementById('editBtn').style.display = 'inline-block';
    }
}

// Enable edit mode
function enableEdit() {
    if (!requireAdmin()) return;

    const modal = document.getElementById('historiaModal');
    const form = document.getElementById('historiaForm');
    const preview = document.getElementById('historiaPreview');
    const alert = document.getElementById('historiaAlert');

    form.reset();
    alert.innerHTML = '';

    // Fill with existing data
    if (historiaData) {
        document.getElementById('historiaContenido').value = historiaData.contenido || '';
        
        if (historiaData.foto) {
            preview.innerHTML = `<img src="${historiaData.foto}" style="max-width: 200px; border-radius: 8px;">`;
        }
    }

    modal.classList.add('active');
}

// Handle form submission
document.getElementById('historiaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!requireAdmin()) return;

    const alertContainer = document.getElementById('historiaAlert');
    alertContainer.innerHTML = '';

    const contenido = document.getElementById('historiaContenido').value;
    const fotoFile = document.getElementById('historiaFoto').files[0];

    let fotoUrl = historiaData ? historiaData.foto : null;

    // Upload photo if provided
    if (fotoFile) {
        const uploadResult = await uploadImage(fotoFile, 'fotos', 'historia');
        if (!uploadResult.success) {
            showAlert(alertContainer, 'Error al subir la foto: ' + uploadResult.error, 'error');
            return;
        }
        fotoUrl = uploadResult.url;
    }

    // Show loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';

    let error;

    if (historiaData) {
        // Update existing
        const result = await supabase
            .from('historia')
            .update({ contenido, foto: fotoUrl })
            .eq('id', historiaData.id);
        
        error = result.error;
    } else {
        // Create new
        const result = await supabase
            .from('historia')
            .insert({ contenido, foto: fotoUrl });
        
        error = result.error;
    }

    if (error) {
        showAlert(alertContainer, 'Error al guardar: ' + error.message, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Guardar';
    } else {
        closeModal('historiaModal');
        loadHistoria();
    }
});
