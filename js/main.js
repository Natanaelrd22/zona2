// Main JavaScript Utilities

// Toggle mobile menu
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Open modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

// Upload image to Supabase Storage
async function uploadImage(file, bucket = 'fotos', folder = 'general') {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return { success: true, url: publicUrl };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Format phone number
function formatPhone(phone) {
    return phone.replace(/\D/g, '');
}

// Create image preview
function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" style="max-width: 150px; border-radius: 8px;">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Render card for staff/directors
function renderCard(item, tableName) {
    const imageHtml = item.foto 
        ? `<img src="${item.foto}" alt="${item.nombre}">`
        : `<div class="placeholder">👤</div>`;

    const logoHtml = item.logo_club 
        ? `<div style="margin-top: 0.5rem; display: flex; align-items: center; gap: 0.5rem; background: #f3f4f6; padding: 0.5rem; border-radius: 4px;">
            <img src="${item.logo_club}" alt="Logo" style="width: 32px; height: 32px; object-fit: contain;">
            <span style="font-size: 0.75rem; color: #6b7280;">${item.nombre_club || 'Club'}</span>
           </div>`
        : (item.nombre_club ? `<p style="font-size: 0.875rem; color: #6b7280; margin-top: 0.5rem;">🏛️ ${item.nombre_club}</p>` : '');

    return `
        <div class="card" data-id="${item.id}">
            <div class="card-image">${imageHtml}</div>
            <div class="card-content">
                <h3>${item.nombre}</h3>
                <p><strong>Cargo:</strong> ${item.cargo}</p>
                ${item.telefono ? `<p><strong>Teléfono:</strong> ${item.telefono}</p>` : ''}
                ${item.club_dirige ? `<p><strong>Club que Dirige:</strong> ${item.club_dirige}</p>` : ''}
                ${logoHtml}
                <div class="card-actions admin-only" style="display: ${isAdmin ? 'flex' : 'none'}">
                    <button class="btn btn-primary" onclick="editRecord('${tableName}', '${item.id}')">Editar</button>
                    <button class="btn btn-danger" onclick="deleteRecord('${tableName}', '${item.id}')">Eliminar</button>
                </div>
            </div>
        </div>
    `;
}

// Generic function to load records
async function loadRecords(tableName, containerId) {
    if (!supabase) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>⚠️ Supabase no configurado</p>
                    <p style="font-size: 0.875rem;">Abre js/config.js y agrega tus credenciales</p>
                </div>
            `;
        }
        return;
    }
    
    const container = document.getElementById(containerId);
    showLoading(container);

    const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        container.innerHTML = `<div class="alert alert-error">Error al cargar: ${error.message}</div>`;
        return;
    }

    if (!data || data.length === 0) {
        showEmpty(container);
        return;
    }

    container.innerHTML = data.map(item => renderCard(item, tableName)).join('');
}

// Delete record
async function deleteRecord(tableName, id) {
    if (!confirm('¿Está seguro de eliminar este registro?')) return;
    if (!requireAdmin()) return;
    
    if (!supabase) {
        alert('Supabase no configurado. Abre js/config.js y agrega tus credenciales.');
        return;
    }

    const { error } = await supabase.from(tableName).delete().eq('id', id);

    if (error) {
        alert('Error al eliminar: ' + error.message);
    } else {
        // Reload the page data
        const tableNameMap = {
            'staff': 'staff-container',
            'aventureros': 'aventureros-container',
            'conquistadores': 'conquistadores-container',
            'guias': 'guias-container'
        };
        if (tableNameMap[tableName]) {
            loadRecords(tableName, tableNameMap[tableName]);
        }
    }
}
