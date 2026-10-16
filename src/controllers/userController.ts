import { Request, Response } from 'express';
import { usuariosDB } from '../data/mockData';
import { Usuario, RolUsuario, EstadoCuenta } from '../types';

export class UserController {
  /**
   * 1. Obtener el listado completo de usuarios registrados en el sistema
   * Permite filtrar opcionalmente por estado o incluir inactivos
   */
  public getUsuarios = (req: Request, res: Response): void => {
    try {
      const { rol, estado, soloActivos } = req.query;

      let resultado = [...usuariosDB];

      if (soloActivos === 'true') {
        resultado = resultado.filter((u) => u.activo === true);
      }

      if (rol) {
        resultado = resultado.filter((u) => u.rol.toLowerCase() === String(rol).toLowerCase());
      }

      if (estado) {
        resultado = resultado.filter((u) => u.estado.toLowerCase() === String(estado).toLowerCase());
      }

      res.status(200).json({
        success: true,
        total: resultado.length,
        data: resultado,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno al consultar los usuarios.',
        error: (error as Error).message,
      });
    }
  };

  /**
   * 2. Registrar un nuevo perfil de usuario (estudiante, docente, administrador)
   */
  public createUsuario = (req: Request, res: Response): void => {
    try {
      const { nombre, email, password, rol, documento } = req.body;

      if (!nombre || !email || !rol) {
        res.status(400).json({
          success: false,
          message: 'Los campos nombre, email y rol son obligatorios.',
        });
        return;
      }

      const rolesValidos: RolUsuario[] = ['estudiante', 'docente', 'administrador'];
      if (!rolesValidos.includes(rol.toLowerCase() as RolUsuario)) {
        res.status(400).json({
          success: false,
          message: `Rol inválido. Los roles permitidos son: ${rolesValidos.join(', ')}.`,
        });
        return;
      }

      const existeEmail = usuariosDB.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existeEmail) {
        res.status(400).json({
          success: false,
          message: 'Ya existe un usuario registrado con ese correo electrónico.',
        });
        return;
      }

      const nuevoUsuario: Usuario = {
        id: `usr-${Date.now()}`,
        nombre,
        email,
        password: password || 'default123',
        rol: rol.toLowerCase() as RolUsuario,
        estado: 'activo',
        activo: true,
        documento: documento || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      usuariosDB.push(nuevoUsuario);

      res.status(201).json({
        success: true,
        message: 'Perfil de usuario registrado exitosamente.',
        data: nuevoUsuario,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al registrar el usuario.',
        error: (error as Error).message,
      });
    }
  };

  /**
   * 3. Consultar los detalles de un usuario específico mediante su identificador único
   */
  public getUsuarioById = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const usuario = usuariosDB.find((u) => u.id === id);

      if (!usuario) {
        res.status(404).json({
          success: false,
          message: `Usuario con identificador '${id}' no encontrado.`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: usuario,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al consultar el usuario.',
        error: (error as Error).message,
      });
    }
  };

  /**
   * 4. Actualizar parcialmente el rol, estado de cuenta o contraseña (PATCH)
   * No requiere enviar el objeto completo (evita usar PUT para cambios aislados)
   */
  public updateUsuarioParcial = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const usuarioIndex = usuariosDB.findIndex((u) => u.id === id);

      if (usuarioIndex === -1) {
        res.status(404).json({
          success: false,
          message: `Usuario con ID '${id}' no encontrado para actualización parcial.`,
        });
        return;
      }

      const { rol, estado, password, nombre } = req.body;

      if (rol !== undefined) {
        const rolesValidos: RolUsuario[] = ['estudiante', 'docente', 'administrador'];
        if (!rolesValidos.includes(rol.toLowerCase() as RolUsuario)) {
          res.status(400).json({
            success: false,
            message: `Rol '${rol}' no permitido. Roles válidos: ${rolesValidos.join(', ')}.`,
          });
          return;
        }
        usuariosDB[usuarioIndex].rol = rol.toLowerCase() as RolUsuario;
      }

      if (estado !== undefined) {
        const estadosValidos: EstadoCuenta[] = ['activo', 'inactivo', 'suspendido'];
        if (!estadosValidos.includes(estado.toLowerCase() as EstadoCuenta)) {
          res.status(400).json({
            success: false,
            message: `Estado '${estado}' inválido. Valores permitidos: ${estadosValidos.join(', ')}.`,
          });
          return;
        }
        usuariosDB[usuarioIndex].estado = estado.toLowerCase() as EstadoCuenta;
        if (estado === 'inactivo' || estado === 'suspendido') {
          usuariosDB[usuarioIndex].activo = false;
        } else if (estado === 'activo') {
          usuariosDB[usuarioIndex].activo = true;
        }
      }

      if (password !== undefined) {
        usuariosDB[usuarioIndex].password = password;
      }

      if (nombre !== undefined) {
        usuariosDB[usuarioIndex].nombre = nombre;
      }

      usuariosDB[usuarioIndex].updatedAt = new Date().toISOString();

      res.status(200).json({
        success: true,
        message: 'Atributos del usuario actualizados parcialmente con éxito (PATCH).',
        cambiosAplicados: req.body,
        data: usuariosDB[usuarioIndex],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar parcialmente el usuario.',
        error: (error as Error).message,
      });
    }
  };

  /**
   * 5. Eliminar lógicamente un usuario del sistema (Soft Delete)
   * Conserva el registro en el sistema pero cambia su estado a inactivo
   */
  public deleteUsuarioLogico = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const usuarioIndex = usuariosDB.findIndex((u) => u.id === id);

      if (usuarioIndex === -1) {
        res.status(404).json({
          success: false,
          message: `Usuario con ID '${id}' no encontrado.`,
        });
        return;
      }

      usuariosDB[usuarioIndex].activo = false;
      usuariosDB[usuarioIndex].estado = 'inactivo';
      usuariosDB[usuarioIndex].updatedAt = new Date().toISOString();

      res.status(200).json({
        success: true,
        message: `Usuario '${usuariosDB[usuarioIndex].nombre}' eliminado lógicamente del sistema.`,
        data: usuariosDB[usuarioIndex],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al realizar la eliminación lógica del usuario.',
        error: (error as Error).message,
      });
    }
  };
}

export const userController = new UserController();
