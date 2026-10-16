# ControlLabs — Taller de Arquitectura REST en TypeScript 🚀

API RESTful modular desarrollada con **Node.js, Express y TypeScript** para el sistema de control de laboratorios, inventario, equipos y novedades de ControlLabs (SENA).

Este proyecto implementa diseño avanzado de rutas, controladores con tipado estricto y operaciones de actualización parcial mediante el verbo HTTP **PATCH**.

---

## 🛠️ Tecnologías y Características
- **Lenguaje:** TypeScript (`^5.x` / `^7.x`)
- **Framework Web:** Express con tipado estricto (`Request`, `Response`)
- **Arquitectura Modular:** Separación estricta de responsabilidades en `src/routes/` y `src/controllers/`
- **Operaciones Parciales:** Implementación rigurosa del método HTTP `PATCH` para evitar sobreescrituras innecesarias (no requiere enviar el objeto completo como en `PUT`)
- **Eliminación Lógica:** Soft delete en usuarios conservando el historial
- **Pruebas de API:** Colección completa lista para **Thunder Client** (`thunder-collection_ControlLabs.json`)

---

## 📁 Estructura del Proyecto

```text
control-labs-api/
├── package.json                    # Scripts y dependencias
├── tsconfig.json                   # Configuración del compilador TypeScript
├── thunder-collection_ControlLabs.json # Colección de pruebas para Thunder Client
└── src/
    ├── app.ts                      # Instancia de Express, middlewares y enrutamiento modular
    ├── server.ts                   # Punto de entrada HTTP y arranque del servidor
    ├── types/
    │   └── index.ts                # Interfaces y tipos de dominio
    ├── data/
    │   └── mockData.ts             # Almacén de datos en memoria y semilla inicial
    ├── controllers/
    │   ├── userController.ts       # Módulo 1: Control de usuarios y soft delete
    │   ├── ambienteController.ts   # Módulo 2: Control de ambientes y capacidad
    │   ├── equipoController.ts     # Módulo 3: Control de equipos y filtros
    │   ├── novedadController.ts    # Módulo 4: Control de incidencias asociadas
    │   └── dashboardController.ts # Módulo 5: Analítica y contadores consolidados
    └── routes/
        ├── userRoutes.ts           # Rutas /api/v1/usuarios
        ├── ambienteRoutes.ts       # Rutas /api/v1/ambientes
        ├── equipoRoutes.ts         # Rutas /api/v1/equipos
        ├── novedadRoutes.ts        # Rutas /api/v1/novedades
        └── dashboardRoutes.ts      # Rutas /api/v1/dashboard
```

---

## 🚀 Puesta en Marcha

### 1. Iniciar en Modo Desarrollo (con recarga en caliente):
```bash
npm run dev
```
El servidor quedará disponible en: `http://localhost:3000`

### 2. Verificar estado de la API (Healthcheck):
```http
GET http://localhost:3000/api/v1/health
```

---

## 📡 Matriz de Endpoints y Verbos HTTP

### 1. Módulo: Gestión de Usuarios
| Verbo | Ruta | Descripción | Tipo de Operación |
|---|---|---|---|
| `GET` | `/api/v1/usuarios` | Listar todos los usuarios registrados | Consulta general |
| `POST` | `/api/v1/usuarios` | Registrar nuevo usuario (estudiante, docente, administrador) | Creación (201) |
| `GET` | `/api/v1/usuarios/:id` | Consultar detalle de un usuario específico | Consulta por ID |
| `PATCH` | `/api/v1/usuarios/:id` | Actualizar parcialmente rol, estado o contraseña | **PATCH (Parcial)** |
| `DELETE` | `/api/v1/usuarios/:id` | Eliminación lógica del usuario del sistema | **Soft Delete** |

### 2. Módulo: Gestión de Ambientes (Laboratorios / Salas)
| Verbo | Ruta | Descripción | Tipo de Operación |
|---|---|---|---|
| `GET` | `/api/v1/ambientes` | Listar espacios físicos y laboratorios | Consulta general |
| `POST` | `/api/v1/ambientes` | Crear nuevo ambiente especificando capacidad y ubicación | Creación (201) |
| `GET` | `/api/v1/ambientes/:id` | Consultar detalle de un ambiente | Consulta por ID |
| `PATCH` | `/api/v1/ambientes/:id` | Actualizar atributos específicos (capacidad, estado operativo) | **PATCH (Parcial)** |

### 3. Módulo: Gestión de Equipos (Hardware / Activos)
| Verbo | Ruta | Descripción | Tipo de Operación |
|---|---|---|---|
| `GET` | `/api/v1/equipos` | Listar todos los equipos | Consulta general |
| `GET` | `/api/v1/equipos?ambienteId=:id` | Filtrar equipos asignados a un ambiente específico | Filtro por Query Param |
| `POST` | `/api/v1/equipos` | Registrar equipo vinculado a un ambiente | Creación (201) |
| `GET` | `/api/v1/equipos/:id` | Consultar detalle de un equipo y su ambiente | Consulta por ID |
| `PATCH` | `/api/v1/equipos/:id` | Actualizar estado técnico ("en mantenimiento") o ubicación | **PATCH (Parcial)** |

### 4. Módulo: Gestión de Novedades (Incidencias)
| Verbo | Ruta | Descripción | Tipo de Operación |
|---|---|---|---|
| `GET` | `/api/v1/novedades` | Consultar historial completo de incidencias | Consulta general |
| `POST` | `/api/v1/novedades` | Reportar novedad asociada a un equipo o ambiente | Creación (201) |
| `GET` | `/api/v1/novedades/:id` | Consultar detalle de una incidencia | Consulta por ID |
| `PATCH` | `/api/v1/novedades/:id` | Actualizar estado ("pendiente", "en proceso", "resuelto") | **PATCH (Parcial)** |

### 5. Módulo: Dashboard (Panel de Control y Analítica)
| Verbo | Ruta | Descripción | Tipo de Operación |
|---|---|---|---|
| `GET` | `/api/v1/dashboard` | Resumen consolidado con contadores globales de usuarios, ambientes activos, equipos operativos y novedades críticas sin resolver | Tarjetas Analíticas |

---

## ⚡ Cómo Usar con Thunder Client (en VS Code)

1. Abre Visual Studio Code con este proyecto.
2. Abre la pestaña **Thunder Client** en la barra lateral izquierda.
3. Haz clic en **Collections** > menú de tres puntos `...` > **Import**.
4. Selecciona el archivo `thunder-collection_ControlLabs.json` ubicado en la raíz del proyecto.
5. ¡Listo! Verás todas las carpetas con las peticiones preconfiguradas con sus métodos, URLs y cuerpos JSON para probar de inmediato.
