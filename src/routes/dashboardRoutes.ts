import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController';

const router = Router();

// Módulo 5: Dashboard (Panel de Control y Analítica)
// Obtener resumen consolidado con contadores globales
router.get('/', dashboardController.getResumen);

export default router;
