# ⚖️ Expediente Jurídico

Sistema de administración de expedientes jurídicos con gestión documental integrada, construido como módulo funcional orientado a un entorno de producción real.

## Enfoque de la solución

El módulo fue concebido como un **escritorio jurídico digital**: una interfaz de alta densidad informativa que organiza el expediente en dos zonas complementarias. A la izquierda, un panel lateral fijo con la identidad completa del caso — cliente, abogado responsable, juzgado, fechas y estado. A la derecha, el área de trabajo documental donde el usuario puede cargar grupos de archivos con contexto (título y descripción) y consultarlos en listado.

La decisión técnica central fue tratar cada conjunto de archivos como una **unidad semántica** dentro del expediente, no como archivos sueltos. Esto refleja cómo operan realmente los despachos jurídicos: los documentos siempre pertenecen a una actuación, una etapa o un propósito dentro del proceso. La interfaz refuerza este modelo con tarjetas agrupadas, borde de acento lateral y metadatos contextuales por grupo.

En términos de arquitectura, se optó por un **monorepo Nx** con separación clara entre frontend (Angular SSR) y backend (NestJS), compartiendo modelos de dominio como referencia. El almacenamiento de archivos en Cloudinary garantiza persistencia independiente del servidor, lo que es crítico en despliegues con infraestructura efímera como Render Free.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Angular 21 + SSR |
| Estilos | TailwindCSS v4 |
| Backend | NestJS + TypeORM |
| Base de datos | PostgreSQL |
| Almacenamiento | Cloudinary |
| Monorepo | Nx + pnpm |
| Deploy Frontend | Render (Node SSR) |
| Deploy Backend | Render (Node) |
| Base de datos Prod | Render PostgreSQL |
| Uptime | UptimeRobot |

---

## Funcionalidades

- 📁 Visualización completa del expediente jurídico con metadatos del caso
- 📤 Carga múltiple de archivos con drag & drop y selector nativo
- 🗂️ Agrupación de documentos con título y descripción contextual
- 🗑️ Eliminación de grupos con limpieza automática en Cloudinary
- 🔄 Actualización reactiva del listado sin recargar la página
- 🖥️ SSR con `TransferState` para carga inicial optimizada
- 🔒 Validación de tipos MIME y tamaño máximo por archivo (10MB)
- 📊 Secciones simuladas: acciones rápidas, partes procesales y línea de tiempo
- 🌐 Despliegue completo en Render con PostgreSQL administrado

---

## Requisitos

- Node.js v20 o v22 LTS
- pnpm v9+
- PostgreSQL 15+

---

## Instalación local

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

> ⚠️ Si tu contraseña contiene caracteres especiales como `#`, envuélvela en comillas dobles.

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

---

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

---

## Scripts disponibles

| Script | Descripción |
|---|---|
| `pnpm tw:build` | Genera el CSS de Tailwind una vez |
| `pnpm tw:watch` | Genera el CSS de Tailwind en modo watch |
| `pnpm seed` | Carga datos de prueba en la base de datos local |
| `pnpm seed:prod` | Carga datos de prueba en la base de datos de producción |
| `pnpm nx serve frontend` | Levanta el frontend en modo desarrollo |
| `pnpm nx serve backend` | Levanta el backend en modo desarrollo |
| `pnpm nx build frontend --configuration=production` | Build de producción del frontend |
| `pnpm nx build backend --configuration=production` | Build de producción del backend |

---

## Estructura del Proyecto

```
expediente-juridico/
├── apps/
│   ├── frontend/                        # Angular 21 + SSR
│   │   └── src/
│   │       ├── app/
│   │       │   ├── expediente/          # Componentes del módulo
│   │       │   │   ├── expediente-shell.component.ts
│   │       │   │   ├── expediente-header.component.ts
│   │       │   │   ├── documentos-list.component.ts
│   │       │   │   ├── documento-grupo-card.component.ts
│   │       │   │   ├── archivo-item.component.ts
│   │       │   │   └── upload-documento.component.ts
│   │       │   ├── health/              # Endpoint de salud para UptimeRobot
│   │       │   ├── models/              # Interfaces TypeScript compartidas
│   │       │   └── services/            # Servicios HTTP con TransferState
│   │       ├── environments/            # Configuración por entorno
│   │       └── styles.css               # Generado por Tailwind CLI
│   └── backend/                         # NestJS
│       └── src/
│           ├── app/                     # Módulo raíz con TypeORM
│           ├── common/                  # Filtros, interceptores, Cloudinary
│           │   ├── filters/             # Global exception filter
│           │   ├── interceptors/        # Response interceptor estándar
│           │   ├── cloudinary.module.ts
│           │   ├── cloudinary.service.ts
│           │   └── seed.ts              # Seeder de datos de prueba
│           ├── documentos/              # Módulo de carga y gestión documental
│           └── expedientes/             # Módulo de expedientes jurídicos
├── .env.example
├── render.yaml                          # Configuración de despliegue en Render
├── postcss.config.js                    # Configuración PostCSS para Tailwind
└── README.md
```

---

## API REST

Base URL: `https://expediente-juridico-backend.onrender.com/api`

Documentación interactiva (Swagger): `https://expediente-juridico-backend.onrender.com/api/docs`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/expedientes` | Listar todos los expedientes |
| `GET` | `/expedientes/:id` | Obtener expediente con grupos y archivos |
| `GET` | `/expedientes/:id/documentos` | Listar grupos de documentos |
| `POST` | `/expedientes/:id/documentos` | Cargar grupo con archivos (multipart) |
| `DELETE` | `/expedientes/:id/documentos/:grupoId` | Eliminar grupo y archivos de Cloudinary |
| `GET` | `/health` | Health check del backend |

---

## Despliegue

| Servicio | Plataforma | URL |
|---|---|---|
| Frontend (SSR) | Render Node | https://expediente-juridico-frontend.onrender.com |
| Backend | Render Node | https://expediente-juridico-backend.onrender.com |
| Base de datos | Render PostgreSQL | administrada por Render |
| Almacenamiento | Cloudinary | carpeta `expedientes/` |
| Uptime monitor | UptimeRobot | ping cada 13 minutos a `/health` |

### Despliegue en Render

El proyecto incluye `render.yaml` con la configuración de ambos servicios. Para desplegar:

1. Conecta el repositorio en [render.com](https://render.com)
2. Render detecta automáticamente el `render.yaml`
3. Configura las variables de entorno secretas manualmente:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Para el frontend agrega `NG_ALLOWED_HOSTS` con el dominio asignado por Render

### Variables de entorno en producción

| Variable | Servicio | Descripción |
|---|---|---|
| `NODE_ENV` | Backend | `production` |
| `DATABASE_URL` | Backend | URL de conexión PostgreSQL de Render |
| `CLOUDINARY_CLOUD_NAME` | Backend | Nombre del cloud en Cloudinary |
| `CLOUDINARY_API_KEY` | Backend | API Key de Cloudinary |
| `CLOUDINARY_API_SECRET` | Backend | API Secret de Cloudinary |
| `API_URL` | Frontend | URL completa del backend |
| `NG_ALLOWED_HOSTS` | Frontend | Dominio del frontend en Render |
| `PORT` | Frontend | Puerto del servidor SSR (4000) |

---

## Decisiones técnicas destacadas

**Tailwind CLI sobre PostCSS integrado** — Tailwind v4 cambió su arquitectura de integración. El CLI como proceso independiente fue la solución más estable para el build de Angular SSR con Nx.

**`ngSkipHydration` en el componente de carga** — El formulario de upload usa drag & drop y acceso directo al DOM, operaciones que solo tienen sentido en el browser. Marcar el componente con `ngSkipHydration` evita errores de hidratación SSR sin sacrificar funcionalidad.

**Cloudinary con `resource_type: raw`** — Los documentos jurídicos (PDF, Word, Excel) se almacenan como `raw` en Cloudinary, no como imágenes. Esto garantiza que se sirvan correctamente sin transformaciones no deseadas.

**`NG_ALLOWED_HOSTS` como variable de entorno** — Angular SSR v21 implementa protección SSRF validando el hostname de cada petición. En lugar de hardcodear el dominio en el código, la variable de entorno permite configurarlo por ambiente sin redeploy.

**UptimeRobot al frontend que hace ping al backend** — Con el free tier de Render los servidores duermen tras 15 minutos de inactividad. Un monitor que hace ping al frontend cada 13 minutos, y el frontend que consulta silenciosamente al backend en el endpoint `/health`, mantiene ambos servicios activos con un solo monitor externo.

---

## Licencia

MIT
