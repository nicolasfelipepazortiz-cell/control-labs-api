import { Router } from 'express';
import { novedadController } from '../controllers/novedadController';

const router = Router();

// Módulo 4: Gestión de Novedades (Incidencias)
// 1. Consultar el historial completo de incidencias reportadas
router.get('/', novedadController.getNovedades);

// 2. Crear un reporte de novedad asociándolo a un equipo o ambiente específico
router.post('/', novedadController.createNovedad);

// Consultar una novedad por ID
router.get('/:id', novedadController.getNovedadById);

// 3. Actualizar parcialmente el estado de una novedad vía PATCH
router.patch('/:id', novedadController.updateNovedadParcial);

export default router;
