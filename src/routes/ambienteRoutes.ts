import { Router } from 'express';
import { ambienteController } from '../controllers/ambienteController';

const router = Router();

// Módulo 2: Gestión de Ambientes (Laboratorios / Salas)
// 1. Listar todos los espacios físicos y laboratorios
router.get('/', ambienteController.getAmbientes);

// 2. Crear un nuevo ambiente especificando capacidad y ubicación
router.post('/', ambienteController.createAmbiente);

// Consultar un ambiente por ID
router.get('/:id', ambienteController.getAmbienteById);

// 3. Actualizar atributos específicos de un ambiente vía PATCH
router.patch('/:id', ambienteController.updateAmbienteParcial);

export default router;
