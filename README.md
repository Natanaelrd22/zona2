# 🏕️ Club de Conquistadores - Aplicación Web

## ✅ ¡Proyecto Completado!

Aplicación web completa construida con **HTML, CSS y JavaScript puro**, conectada a **Supabase** para base de datos y autenticación.

---

## 📂 Archivos del Proyecto

```
Z2/
├── 📄 index.html                 → Página de inicio
├── 🔐 login.html                 → Página de login
├── 👥 staff.html                 → Gestión de Staff
├── 🏅 aventureros.html           → Directiva Aventureros
├── ⭐ conquistadores.html        → Directiva Conquistadores
├── 🎯 guias.html                 → Directiva Guías
├── 📖 historia.html              → Historia del Denominador
├── 📁 recursos.html              → Recursos y archivos
│
├── 📁 css/
│   └── styles.css               → Estilos CSS completos
│
├── 📁 js/
│   ├── config.js                → Configuración de Supabase ⚙️
│   ├── auth.js                  → Sistema de autenticación
│   ├── main.js                  → Funciones principales
│   ├── staff.js                 → Gestión de Staff
│   ├── directores.js            → Gestión de Directores
│   ├── historia.js              → Gestión de Historia
│   └── recursos.js              → Gestión de Recursos
│
└── 📁 database/
    └── schema.sql               → 📌 Script SQL para Supabase
```

---

## 🚀 Configuración Rápida (3 Pasos)

### 1️⃣ Configurar Supabase

1. Crea una cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a **SQL Editor** y ejecuta el script `database/schema.sql`
4. Crea usuario admin en **Authentication > Users**:
   - Email: `ministrylion@gmail.com`
   - Password: `Admin`

### 2️⃣ Configurar Credenciales

Abre `js/config.js` y reemplaza:

```javascript
const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

Obtén estos valores en **Project Settings > API** de Supabase.

### 3️⃣ Ejecutar

```bash
# Opción 1: Abrir directamente
Doble clic en index.html

# Opción 2: Servidor local (recomendado)
python -m http.server 8000
# Abrir: http://localhost:8000
```

---

## ✨ Características Implementadas

### ✅ Menú Completo
- ✅ Inicio
- ✅ Staff
- ✅ Dir. Aventureros
- ✅ Dir. Conquistadores
- ✅ Dir. Guías
- ✅ Historia Den.
- ✅ Recursos
- ✅ Login

### ✅ Página de Inicio
- Diseño atractivo y moderno
- Información del club
- Secciones de Aventureros y Conquistadores
- Programa y misión

### ✅ Gestión de Staff
- Crear registros con: Nombre, Foto, Cargo, Teléfono
- Editar registros existentes
- Eliminar registros
- Vista en tarjetas con fotos
- **Solo el administrador puede gestionar**

### ✅ Directorios (3 secciones)
- Aventureros
- Conquistadores
- Guías

Mismas funcionalidades que Staff.

### ✅ Historia del Denominador
- Página editable con contenido e imágenes
- Solo admin puede editar
- Visitantes pueden leer

### ✅ Recursos
- Crear categorías de archivos
- Subir archivos a categorías
- Descargar archivos fácilmente
- Filtrar por categoría
- Gestión completa (admin solamente)

### ✅ Autenticación Segura
- Login para administrador
- Email: `ministrylion@gmail.com`
- Contraseña: `Admin`
- Row Level Security (RLS) en base de datos
- Solo admin puede crear/editar/eliminar

---

## 🔐 Seguridad

### Protecciones Implementadas:

1. **Autenticación**: Supabase Auth
2. **Row Level Security**: Solo admin puede escribir
3. **Storage Policies**: Solo admin puede subir archivos
4. **Frontend Validation**: Validación en el navegador
5. **Backend Validation**: Validación en Supabase

### Permisos:

| Acción | Administrador | Visitante |
|--------|--------------|-----------|
| Ver contenido | ✅ | ✅ |
| Crear registros | ✅ | ❌ |
| Editar registros | ✅ | ❌ |
| Eliminar registros | ✅ | ❌ |
| Subir archivos | ✅ | ❌ |
| Descargar archivos | ✅ | ✅ |

---

## 📖 Guía Completa

Para instrucciones detalladas paso a paso, consulta el archivo:

📄 **`GUIA_DE_CONFIGURACION.md`**

Incluye:
- Configuración paso a paso
- Cómo usar cada sección
- Solución de problemas
- Personalización
- Publicación en internet

---

## 🎯 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Storage**: Supabase Storage
- **Diseño**: CSS Grid, Flexbox, Variables CSS

---

## 📱 Responsive Design

La aplicación es completamente responsive y funciona en:
- 📱 Teléfonos móviles
- 📱 Tablets
- 💻 Computadoras de escritorio
- 🖥️ Pantallas grandes

---

## 🎉 ¡Listo para Usar!

Tu aplicación está completa y lista para producción. Solo necesitas:

1. ✅ Crear cuenta en Supabase
2. ✅ Ejecutar el script SQL
3. ✅ Configurar las credenciales en `js/config.js`
4. ✅ ¡Abrir y usar!

---

## 📞 Soporte

Si tienes problemas:
1. Revisa `GUIA_DE_CONFIGURACION.md`
2. Abre la consola del navegador (F12)
3. Verifica la configuración de Supabase

**Documentación de Supabase**: https://supabase.com/docs

---

**¡Disfruta tu aplicación del Club de Conquistadores! 🏕️🚀**
