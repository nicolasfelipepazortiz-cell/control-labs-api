# Control Labs API - SENA 🚀

API RESTful modular desarrollada con Express y Sequelize para el control de inventario, laboratorios y préstamos de recursos de formación del SENA.

---

## 📁 Estructura del Proyecto

```text
control-labs-api/
├── .env                  # Variables de entorno activas (ignorado en Git)
├── .env.example          # Plantilla de variables de entorno
├── .gitignore            # Exclusión estricta de node_modules, .env y logs
├── package.json          # Dependencias y scripts de ejecución
├── server.js             # Punto de entrada HTTP raíz del servidor
└── src/
    ├── app.js            # Núcleo de Express, middlewares globales y rutas
    ├── config/
    │   ├── database.js   # Conexión Sequelize (Postgres / MySQL / SQLite)
    │   └── oauth.js      # Configuración de Google OAuth y validaciones SENA
    ├── controllers/
    │   ├── authController.js       # Autenticación, registro y Google OAuth
    │   ├── inventoryController.js  # Control de peticiones HTTP para activos
    │   ├── loanController.js       # Control de peticiones HTTP para préstamos
    │   ├── reportController.js     # Control de peticiones HTTP para reportes
    │   └── roomController.js       # Control de peticiones HTTP para ambientes
    ├── middlewares/
    │   ├── auth.js         # Validación de tokens JWT Bearer
    │   ├── errorHandler.js # Manejo centralizado de excepciones y AppError
    │   └── roles.js        # Control de Acceso Basado en Roles (RBAC)
    ├── models/
    │   ├── index.js          # Asociaciones relacionales del ORM
    │   ├── InventoryItem.js  # Activos de inventario SENA (placas, estado)
    │   ├── Loan.js           # Préstamos de equipos/ambientes (fichas SENA)
    │   ├── Room.js           # Ambientes de aprendizaje y laboratorios
    │   └── User.js           # Usuarios (Admin, Instructor, Aprendiz, Coordinador)
    ├── routes/
    │   ├── authRoutes.js       # Rutas de autenticación (/api/v1/auth)
    │   ├── index.js            # Enrutador central modular (/api/v1)
    │   ├── inventoryRoutes.js  # Rutas de inventario (/api/v1/inventory)
    │   ├── loanRoutes.js       # Rutas de préstamos (/api/v1/loans)
    │   ├── reportRoutes.js     # Rutas de reportes (/api/v1/reports)
    │   └── roomRoutes.js       # Rutas de ambientes (/api/v1/rooms)
    └── services/
        ├── inventoryService.js # Reglas de placas SENA, estado y reubicación
        ├── loanService.js      # Validaciones de préstamos y aprobaciones
        └── reportService.js    # Cálculos de reportes y préstamos vencidos
```

---

## ⚙️ Configuración y Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura los valores correspondientes:

```bash
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos (Sequelize)
DB_DIALECT=postgres   # postgres | mysql | sqlite
DB_HOST=localhost
DB_PORT=5432
DB_NAME=control_labs_sena
DB_USER=postgres
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=tu_clave_secreta_jwt
JWT_EXPIRES_IN=8h

# Google OAuth institucional
GOOGLE_CLIENT_ID=tu_cliente_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_cliente_secreto
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback
```

---

## 🚀 Scripts de Ejecución

- **Modo Desarrollo (con reinicio automático nodemon):**
  ```bash
  npm run dev
  ```

- **Modo Producción:**
  ```bash
  npm start
  ```

---

## 📡 Endpoints Principales (`/api/v1`)

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| `GET` | `/health` | Healthcheck y estado de la API | Público |
| `POST` | `/api/v1/auth/login` | Inicio de sesión y generación de JWT | Público |
| `POST` | `/api/v1/auth/register` | Registro de usuarios SENA | Público |
| `POST` | `/api/v1/loans` | Solicitud de préstamo (equipos/ambientes) | Autenticado |
| `GET` | `/api/v1/loans` | Lista de préstamos con filtros | Autenticado |
| `PATCH` | `/api/v1/loans/:id/approve` | Aprobación de préstamo | Instructor / Admin |
| `PATCH` | `/api/v1/loans/:id/return` | Devolución y reporte de novedades | Instructor / Admin |
| `GET` | `/api/v1/inventory` | Consulta de inventario | Autenticado |
| `POST` | `/api/v1/inventory` | Registro de activo con placa SENA | Admin / Instructor |
| `GET` | `/api/v1/reports/metrics` | Resumen estadístico e indicadores | Admin / Instructor |
| `GET` | `/api/v1/reports/overdue` | Listado de préstamos vencidos | Admin / Instructor |
