import { Router } from 'express';
import { userController } from '../controllers/userController';

const router = Router();

// Módulo 1: Gestión de Usuarios
// 1. Obtener listado completo de usuarios
router.get('/', userController.getUsuarios);

// 2. Registrar un nuevo perfil de usuario
router.post('/', userController.createUsuario);

// 3. Consultar detalles de un usuario específico por su ID
router.get('/:id', userController.getUsuarioById);

// 4. Actualizar parcialmente rol, estado o contraseña (PATCH)
router.patch('/:id', userController.updateUsuarioParcial);

// 5. Eliminar lógicamente un usuario del sistema (DELETE)
router.delete('/:id', userController.deleteUsuarioLogico);

export default router;
