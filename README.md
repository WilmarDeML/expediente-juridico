# ⚖️  Expediente Jurídico

Sistema de administración de expedientes jurídicos con gestión documental integrada.

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Angular 19 + SSR |
| Estilos | TailwindCSS v4 |
| Backend | NestJS + TypeORM |
| Base de datos | PostgreSQL |
| Almacenamiento | Cloudinary |
| Monorepo | Nx + pnpm |

## Funcionalidades

- 📁 Visualización completa del expediente jurídico
- 📤 Carga múltiple de archivos (PDF, Word, Excel, imágenes)
- 🗂️ Agrupación de documentos con título y descripción
- 🗑️ Eliminación de grupos con limpieza automática en Cloudinary
- 🔄 Actualización reactiva sin recargar la página
- 🖥️ SSR con TransferState para carga inicial optimizada

## Requisitos

- Node.js v20 o v22 LTS
- pnpm v9+
- PostgreSQL 15+

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/WilmarDeML/expediente-juridico.git
cd expediente-juridico
```

### 2. Instalar dependencias

```bash
pnpm install
pnpm approve-builds
pnpm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el `.env` con tus credenciales:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=expediente_juridico
DATABASE_USER=expediente_user
DATABASE_PASSWORD="tu_password"

BACKEND_PORT=3000
NODE_ENV=development

API_URL=http://localhost:3000/api

CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 4. Crear la base de datos

```bash
psql -U postgres -c "CREATE DATABASE expediente_juridico;"
psql -U postgres -c "CREATE USER expediente_user WITH ENCRYPTED PASSWORD 'tu_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE expediente_juridico TO expediente_user;"
psql -U postgres -d expediente_juridico -c "GRANT ALL ON SCHEMA public TO expediente_user;"
```

### 5. Cargar datos de prueba

```bash
pnpm seed
```

## Desarrollo

Abre tres terminales:

**Terminal 1 — Tailwind CSS watch:**
```bash
pnpm tw:watch
```

**Terminal 2 — Backend:**
```bash
pnpm nx serve backend
```

**Terminal 3 — Frontend:**
```bash
pnpm nx serve frontend
```

Abre [http://localhost:4200](http://localhost:4200) en el navegador.

## Estructura del Proyecto

```
expediente-juridico/
├── apps/
│   ├── frontend/                  # Angular 19 + SSR
│   │   └── src/
│   │       ├── app/
│   │       │   ├── expediente/    # Componentes del módulo
│   │       │   ├── models/        # Interfaces TypeScript
│   │       │   └── services/      # Servicios HTTP
│   │       └── styles.css         # Generado por Tailwind CLI
│   └── backend/                   # NestJS
│       └── src/
│           ├── common/            # Filtros, interceptores, Cloudinary
│           ├── documentos/        # Módulo de documentos
│           └── expedientes/       # Módulo de expedientes
├── .env.example
├── render.yaml                    # Configuración de Render
├── vercel.json                    # Configuración de Vercel
└── README.md
```

## Despliegue

| Servicio | Plataforma | URL |
|---|---|---|
| Frontend | Vercel | pendiente |
| Backend | Render | pendiente |
| Base de datos | Render PostgreSQL | pendiente |
| Archivos | Cloudinary | activo |

## Licencia

MIT
