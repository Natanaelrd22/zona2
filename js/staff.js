// Staff Management JavaScript

let editingId = null;

// Load staff on page load
document.addEventListener('DOMContentLoaded', () => {
    loadStaff();
});

// Load all staff records
async function loadStaff() {
    const container = document.getElementById('staff-container');
    container.innerHTML = '<div class="loading">Cargando</div>';

    const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        container.innerHTML = `<div class="alert alert-error">Error al cargar: ${error.message}</div>`;
        return;
    }

    if (!data || data.length === 0) {
        showEmpty(container, 'No hay registros de staff todavía.');
        return;
    }

    container.innerHTML = '';
    data.forEach(item => {
        container.innerHTML += renderCard(item, 'staff');
    });
}

// Open modal to create new staff
function openStaffModal() {
    if (!requireAdmin()) return;
    
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Nuevo Registro';
    document.getElementById('staffForm').reset();
    document.getElementById('staffId').value = '';
    document.getElementById('staffPreview').innerHTML = '';
    document.getElementById('staffAlert').innerHTML = '';
    openModal('staffModal');
}

// Edit staff record
async function editRecord(tableName, id) {
    if (!requireAdmin()) return;
    
    editingId = id;
    
    const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        alert('Error al cargar el registro: ' + error.message);
        return;
    }

    // Fill form with data
    const formId = tableName === 'staff' ? 'staffForm' : `${tableName}Form`;
    const modalId = `${tableName}Modal`;
    
    document.getElementById(`${tableName}Id`).value = data.id;
    document.getElementById(`${tableName}Nombre`).value = data.nombre;
    document.getElementById(`${tableName}Cargo`).value = data.cargo;
    document.getElementById(`${tableName}Telefono`).value = data.telefono || '';
    
    if (data.foto) {
        document.getElementById(`${tableName}Preview`).innerHTML = `<img src="${data.foto}" style="max-width: 150px; border-radius: 8px;">`;
    }
    
    document.getElementById('modalTitle').textContent = 'Editar Registro';
    openModal(modalId);
}

// Handle form submission
document.getElementById('staffForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!requireAdmin()) return;

    const alertContainer = document.getElementById('staffAlert');
    alertContainer.innerHTML = '';

    const nombre = document.getElementById('staffNombre').value;
    const cargo = document.getElementById('staffCargo').value;
    const telefono = document.getElementById('staffTelefono').value;
    const fotoFile = document.getElementById('staffFoto').files[0];

    let fotoUrl = null;

    // Upload photo if provided
    if (fotoFile) {
        const uploadResult = await uploadImage(fotoFile, 'fotos', 'staff');
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

    if (editingId) {
        // Update existing record
        const updateData = { nombre, cargo, telefono };
        if (fotoUrl) updateData.foto = fotoUrl;
        
        const result = await supabase
            .from('staff')
            .update(updateData)
            .eq('id', editingId);
        
        error = result.error;
    } else {
        // Create new record
        const insertData = { nombre, cargo, telefono };
        if (fotoUrl) insertData.foto = fotoUrl;
        
        const result = await supabase
            .from('staff')
            .insert(insertData);
        
        error = result.error;
    }

    if (error) {
        showAlert(alertContainer, 'Error al guardar: ' + error.message, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Guardar';
    } else {
        closeModal('staffModal');
        loadStaff();
    }
});
