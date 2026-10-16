import { Router } from 'express';
import { equipoController } from '../controllers/equipoController';

const router = Router();

// Módulo 3: Gestión de Equipos (Hardware / Activos)
// 1. Listar todos los equipos existentes o filtrar por ambiente (?ambienteId=...)
router.get('/', equipoController.getEquipos);

// 2. Registrar un nuevo equipo vinculado a un ambiente de laboratorio
router.post('/', equipoController.createEquipo);

// Consultar equipo por ID
router.get('/:id', equipoController.getEquipoById);

// 3. Actualizar de forma parcial el estado técnico o ubicación vía PATCH
router.patch('/:id', equipoController.updateEquipoParcial);

export default router;
