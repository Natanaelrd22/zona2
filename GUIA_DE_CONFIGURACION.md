# 📘 Guía de Configuración - Club de Conquistadores

## ✅ Proyecto HTML Completado

Tu aplicación web está construida con **HTML, CSS y JavaScript puro**, conectándose a **Supabase** para la base de datos y autenticación.

---

## 📁 Estructura del Proyecto

```
Z2/
├── index.html                 # Página de inicio
├── login.html                 # Página de login
├── staff.html                 # Gestión de Staff
├── aventureros.html           # Directiva Aventureros
├── conquistadores.html        # Directiva Conquistadores
├── guias.html                 # Directiva Guías
├── historia.html              # Historia del Denominador
├── recursos.html              # Recursos y archivos
├── css/
│   └── styles.css            # Estilos CSS
├── js/
│   ├── config.js             # Configuración de Supabase
│   ├── auth.js               # Autenticación
│   ├── main.js               # Funciones principales
│   ├── staff.js              # Gestión de Staff
│   ├── directores.js         # Gestión de Directores
│   ├── historia.js           # Gestión de Historia
│   └── recursos.js           # Gestión de Recursos
└── database/
    └── schema.sql            # 📌 Script SQL para Supabase
```

---

## 🚀 PASOS PARA CONFIGURAR

### 1️⃣ Crear una cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en **"Start your project"** o **"Sign In"**
3. Crea una cuenta con GitHub, GitLab o correo electrónico
4. Una vez dentro, haz clic en **"New Project"**

### 2️⃣ Configurar la Base de Datos

1. **Crea un nuevo proyecto:**
   - Name: `Club de Conquistadores`
   - Database Password: (elige una contraseña segura y guárdala)
   - Region: Elige la más cercana a tu ubicación
   - Haz clic en **"Create new project"**

2. **Espera a que se configure** (toma unos 2 minutos)

3. **Ejecuta el script SQL:**
   - En el panel izquierdo, haz clic en **"SQL Editor"**
   - Haz clic en **"New query"**
   - Abre el archivo `database/schema.sql` de tu proyecto
   - Copia TODO el contenido del archivo
   - Pégalo en el editor SQL de Supabase
   - Haz clic en **"Run"** (o presiona Ctrl+Enter)
   - ✅ ¡Listo! Todas las tablas y políticas fueron creadas

### 3️⃣ Crear el Usuario Administrador

1. En el panel izquierdo, haz clic en **"Authentication"** > **"Users"**

2. Haz clic en **"Add user"** > **"Create new user"**

3. Ingresa los siguientes datos:
   - **Email**: `ministrylion@gmail.com`
   - **Password**: `Admin`
   - **Email Confirm**: ✅ Marca esta casilla para confirmar el email automáticamente

4. Haz clic en **"Create user"**

✅ ¡El administrador está creado!

### 4️⃣ Obtener las Credenciales de la API

1. En el panel izquierdo, haz clic en **"Project Settings"** (ícono de engranaje ⚙️)

2. Haz clic en **"API"** en el menú lateral

3. Verás dos valores importantes:
   - **Project URL**: Se ve así: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public**: Una clave larga que empieza con `eyJ...`

4. **Copia ambos valores**

### 5️⃣ Configurar el Archivo de Configuración

1. **Abre el archivo** `js/config.js` en un editor de texto

2. **Reemplaza los valores placeholder**:

   ```javascript
   const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   ```

3. **Guarda el archivo**

### 6️⃣ Ejecutar la Aplicación

**Opción 1: Abrir directamente**
- Simplemente haz doble clic en `index.html`

**Opción 2: Usar un servidor local (Recomendado)**
```bash
# Si tienes Python instalado:
python -m http.server 8000

# Luego abre: http://localhost:8000
```

**Opción 3: Usar Live Server en VS Code**
- Instala la extensión "Live Server"
- Haz clic derecho en `index.html` > "Open with Live Server"

✅ ¡Tu aplicación está funcionando!

---

## 🎯 CÓMO USAR LA APLICACIÓN

### Iniciar Sesión como Administrador

1. Haz clic en **"Login"** en el menú
2. Ingresa:
   - **Correo**: `ministrylion@gmail.com`
   - **Contraseña**: `Admin`
3. Haz clic en **"Iniciar Sesión"**

### Gestionar Staff

1. Haz clic en **"Staff"** en el menú
2. Haz clic en **"+ Nuevo Registro"** (solo visible para admin)
3. Completa los campos:
   - **Nombre**: Nombre de la persona
   - **Foto**: Sube una imagen (opcional)
   - **Cargo**: Posición que ocupa
   - **Teléfono**: Número de contacto
4. Haz clic en **"Guardar"**

Puedes **editar** o **eliminar** cualquier registro con los botones en cada tarjeta.

### Gestionar Directivas (Aventureros, Conquistadores, Guías)

Funciona igual que Staff:

1. Ve a la sección correspondiente:
   - **"Dir. Aventureros"**
   - **"Dir. Conquistadores"**
   - **"Dir. Guías"**

2. Crea, edita o elimina registros

### Editar Historia del Denominador

1. Ve a **"Historia Den."**
2. Haz clic en **"Editar"** (solo visible para el admin)
3. Agrega:
   - **Foto**: Imagen representativa
   - **Contenido**: Texto de la historia (puedes escribir varios párrafos)
4. Haz clic en **"Guardar"**

### Gestionar Recursos

**Crear una categoría:**

1. Ve a **"Recursos"**
2. Haz clic en **"+ Nueva Categoría"** (solo admin)
3. Escribe el nombre (ej: "Manuales", "Guías", "Formularios")
4. Haz clic en **"Crear"**

**Subir un archivo:**

1. Haz clic en **"+ Subir Archivo"** (solo admin)
2. Completa:
   - **Nombre**: Nombre del archivo (opcional)
   - **Categoría**: Selecciona la categoría correspondiente
   - **Archivo**: Selecciona el archivo a subir
3. El archivo se subirá automáticamente

**Descargar archivos:**

- Los visitantes pueden ver todos los archivos organizados por categoría
- Pueden descargarlos haciendo clic en **"Descargar"**

---

## 🔐 Seguridad

### Solo el Administrador puede:
- ✅ Crear nuevos registros
- ✅ Editar registros existentes
- ✅ Eliminar registros
- ✅ Subir archivos
- ✅ Crear categorías

### Los Visitantes pueden:
- ✅ Ver todos los registros
- ✅ Descargar archivos
- ✅ Leer la historia

### Protección implementada:
- Autenticación con Supabase Auth
- Row Level Security (RLS) en la base de datos
- Políticas de seguridad en Storage
- Validación en el frontend y backend

---

## 📋 Características

### ✅ Menú de Navegación
- Inicio
- Staff
- Dir. Aventureros
- Dir. Conquistadores
- Dir. Guías
- Historia Den.
- Recursos
- Login / Cerrar Sesión

### ✅ Página de Inicio
- Diseño atractivo con hero section
- Información del club
- Características y programa
- Misión del club

### ✅ Staff
- Crear, editar y eliminar registros
- Campos: Nombre, Foto, Cargo, Teléfono
- Vista en tarjetas con fotos
- Solo admin puede gestionar

### ✅ Directorios
- Mismas funcionalidades que Staff
- Tres secciones independientes
- Aventureros, Conquistadores, Guías

### ✅ Historia
- Página editable
- Contenido e imágenes
- Admin puede editar
- Visitantes pueden leer

### ✅ Recursos
- Crear categorías
- Subir archivos
- Filtrar por categoría
- Descargar archivos
- Gestión completa

---

## 🌐 Publicar en Internet (Opcional)

### Opción 1: GitHub Pages (Gratis)

1. Crea un repositorio en GitHub
2. Sube todos los archivos
3. Ve a Settings > Pages
4. Selecciona la rama main
5. Tu sitio estará en: `https://tu-usuario.github.io/tu-repo/`

**Nota:** GitHub Pages es estático, necesitas actualizar `js/config.js` con tus credenciales antes de subir.

### Opción 2: Netlify (Gratis)

1. Ve a [https://netlify.com](https://netlify.com)
2. Arrastra la carpeta del proyecto
3. Listo, tu sitio estará en vivo

### Opción 3: Vercel

1. Sube tu código a GitHub
2. Importa en [https://vercel.com](https://vercel.com)
3. Deploy automático

---

## ❓ Solución de Problemas

### No puedo iniciar sesión

- ✅ Verifica que el usuario esté creado en Supabase > Authentication > Users
- ✅ El email debe ser exactamente: `ministrylion@gmail.com`
- ✅ La contraseña debe ser: `Admin`

### Error de base de datos

- ✅ Verifica que ejecutaste el script SQL completo
- ✅ Revisa que las credenciales en `js/config.js` sean correctas
- ✅ Asegúrate de que las políticas RLS estén habilitadas

### Las imágenes no se suben

- ✅ Verifica que los buckets de storage estén creados en Supabase
- ✅ Revisa que las políticas de storage estén configuradas
- ✅ Mira la consola del navegador (F12) para ver errores

### La aplicación no carga

- ✅ Abre la consola del navegador (F12) para ver errores
- ✅ Verifica que `js/config.js` tenga valores válidos
- ✅ Asegúrate de que todas las carpetas y archivos existan

### Los botones de Editar/Eliminar no aparecen

- ✅ Estos botones solo son visibles para el administrador
- ✅ Inicia sesión con la cuenta de admin
- ✅ Recarga la página después de iniciar sesión

---

## 🎨 Personalización

### Cambiar Colores

Edita el archivo `css/styles.css` y modifica las variables CSS:

```css
:root {
    --primary-color: #1e40af;      /* Color principal */
    --secondary-color: #7c3aed;    /* Color secundario */
    --danger-color: #dc2626;       /* Color de peligro */
    --success-color: #16a34a;      /* Color de éxito */
}
```

### Cambiar el Logo

Edita el título en cada archivo HTML:

```html
<h1>🏕️ Tu Nombre del Club</h1>
```

---

## 📞 Soporte

Si tienes problemas:

1. Abre la consola del navegador (F12) para ver errores
2. Verifica que todos los pasos de configuración se completaron
3. Consulta la documentación de Supabase: https://supabase.com/docs

---

## 🎉 ¡Listo!

Tu aplicación del Club de Conquistadores está lista para usar. Recuerda:

- ✅ Solo el administrador puede crear/editar/eliminar registros
- ✅ Los visitantes solo pueden ver el contenido
- ✅ Todas las funciones están protegidas por autenticación
- ✅ La base de datos está segura con políticas de seguridad

**¡Disfruta tu aplicación! 🚀**
