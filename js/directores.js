// Directores Management JavaScript (Aventureros, Conquistadores, Guías)
// This file is used by aventureros.html, conquistadores.html, and guias.html

let editingId = null;

// Load records on page load
document.addEventListener('DOMContentLoaded', () => {
    loadRecords();
});

// Load all records
async function loadRecords() {
    const container = document.getElementById(CONTAINER_ID);
    container.innerHTML = '<div class="loading">Cargando</div>';

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        container.innerHTML = `<div class="alert alert-error">Error al cargar: ${error.message}</div>`;
        return;
    }

    if (!data || data.length === 0) {
        showEmpty(container, 'No hay registros todavía.');
        return;
    }

    container.innerHTML = '';
    data.forEach(item => {
        container.innerHTML += renderCard(item, TABLE_NAME);
    });
}

// Open modal to create new record
function openModalFunc() {
    if (!requireAdmin()) return;
    
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Nuevo Registro';
    document.getElementById(FORM_ID).reset();
    document.getElementById(`${TABLE_NAME}Id`).value = '';
    document.getElementById(`${TABLE_NAME}Preview`).innerHTML = '';
    document.getElementById(`${TABLE_NAME}LogoPreview`).innerHTML = '';
    document.getElementById(ALERT_ID).innerHTML = '';
    openModal(MODAL_ID);
}

// Create wrapper functions for each table
function openAventurerosModal() {
    if (TABLE_NAME === 'aventureros') openModalFunc();
}

function openConquistadoresModal() {
    if (TABLE_NAME === 'conquistadores') openModalFunc();
}

function openGuiasModal() {
    if (TABLE_NAME === 'guias') openModalFunc();
}

// Edit record
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
    document.getElementById(`${tableName}Id`).value = data.id;
    document.getElementById(`${tableName}Nombre`).value = data.nombre;
    document.getElementById(`${tableName}Cargo`).value = data.cargo;
    document.getElementById(`${tableName}Telefono`).value = data.telefono || '';
    document.getElementById(`${tableName}NombreClub`).value = data.nombre_club || '';

    if (data.foto) {
        document.getElementById(`${tableName}Preview`).innerHTML = `<img src="${data.foto}" style="max-width: 150px; border-radius: 8px;">`;
    }
    
    if (data.logo_club) {
        document.getElementById(`${tableName}LogoPreview`).innerHTML = `<img src="${data.logo_club}" style="max-width: 150px; border-radius: 8px;">`;
    }
    
    document.getElementById('modalTitle').textContent = 'Editar Registro';
    openModal(MODAL_ID);
}

// Handle form submission
document.getElementById(FORM_ID).addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!requireAdmin()) return;

    const alertContainer = document.getElementById(ALERT_ID);
    alertContainer.innerHTML = '';

    const nombre = document.getElementById(`${TABLE_NAME}Nombre`).value;
    const cargo = document.getElementById(`${TABLE_NAME}Cargo`).value;
    const telefono = document.getElementById(`${TABLE_NAME}Telefono`).value;
    const nombreClub = document.getElementById(`${TABLE_NAME}NombreClub`).value;
    const fotoFile = document.getElementById(`${TABLE_NAME}Foto`).files[0];
    const logoFile = document.getElementById(`${TABLE_NAME}LogoClub`).files[0];

    let fotoUrl = null;
    let logoUrl = null;

    // Upload photo if provided
    if (fotoFile) {
        const uploadResult = await uploadImage(fotoFile, 'fotos', TABLE_NAME);
        if (!uploadResult.success) {
            showAlert(alertContainer, 'Error al subir la foto: ' + uploadResult.error, 'error');
            return;
        }
        fotoUrl = uploadResult.url;
    }

    // Upload logo if provided
    if (logoFile) {
        const uploadResult = await uploadImage(logoFile, 'fotos', `${TABLE_NAME}/logos`);
        if (!uploadResult.success) {
            showAlert(alertContainer, 'Error al subir el logo: ' + uploadResult.error, 'error');
            return;
        }
        logoUrl = uploadResult.url;
    }

    // Show loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';

    let error;

    if (editingId) {
        // Update existing record
        const updateData = { nombre, cargo, telefono, nombre_club: nombreClub };
        if (fotoUrl) updateData.foto = fotoUrl;
        if (logoUrl) updateData.logo_club = logoUrl;

        const result = await supabase
            .from(TABLE_NAME)
            .update(updateData)
            .eq('id', editingId);

        error = result.error;
    } else {
        // Create new record
        const insertData = { nombre, cargo, telefono, nombre_club: nombreClub };
        if (fotoUrl) insertData.foto = fotoUrl;
        if (logoUrl) insertData.logo_club = logoUrl;
        
        const result = await supabase
            .from(TABLE_NAME)
            .insert(insertData);
        
        error = result.error;
    }

    if (error) {
        showAlert(alertContainer, 'Error al guardar: ' + error.message, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Guardar';
    } else {
        closeModal(MODAL_ID);
        loadRecords();
    }
});
