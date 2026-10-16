import express, { Application, Request, Response } from 'express';
import cors from 'cors';

// Importación modular de rutas en TypeScript
import userRoutes from './routes/userRoutes';
import ambienteRoutes from './routes/ambienteRoutes';
import equipoRoutes from './routes/equipoRoutes';
import novedadRoutes from './routes/novedadRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

const app: Application = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Verificación de estado del servicio (Health Check)
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    servicio: 'ControlLabs REST API',
    arquitectura: 'TypeScript Modular (Express Router + Controllers + PATCH)',
    timestamp: new Date().toISOString(),
  });
});

// Mapeo modular de prefijos de ruta REST
// Módulo 1: Gestión de Usuarios
app.use('/api/v1/usuarios', userRoutes);
app.use('/api/v1/users', userRoutes); // Alias en inglés para conveniencia

// Módulo 2: Gestión de Ambientes (Laboratorios / Salas)
app.use('/api/v1/ambientes', ambienteRoutes);
app.use('/api/v1/environments', ambienteRoutes); // Alias en inglés

// Módulo 3: Gestión de Equipos (Hardware / Activos)
app.use('/api/v1/equipos', equipoRoutes);
app.use('/api/v1/equipments', equipoRoutes); // Alias en inglés

// Módulo 4: Gestión de Novedades (Incidencias)
app.use('/api/v1/novedades', novedadRoutes);
app.use('/api/v1/incidents', novedadRoutes); // Alias en inglés

// Módulo 5: Dashboard (Panel de Control y Analítica)
app.use('/api/v1/dashboard', dashboardRoutes);

// Manejo de rutas no encontradas (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: [${req.method}] ${req.originalUrl}`,
    sugerencia: 'Consulta los endpoints disponibles bajo el prefijo /api/v1/...',
  });
});

export default app;
