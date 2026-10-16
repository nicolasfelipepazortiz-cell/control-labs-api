import { Request, Response } from 'express';
import { equiposDB, ambientesDB } from '../data/mockData';
import { Equipo, EstadoTecnicoEquipo } from '../types';

export class EquipoController {
  /**
   * 1. Listar todos los equipos existentes o filtrar aquellos asignados a un ambiente específico
   * Soporta query param ?ambienteId=amb-1 y ?estadoTecnico=operativo
   */
  public getEquipos = (req: Request, res: Response): void => {
    try {
      const { ambienteId, estadoTecnico, categoria } = req.query;

      let resultado = [...equiposDB];

      if (ambienteId) {
        resultado = resultado.filter((e) => e.ambienteId === String(ambienteId));
      }

      if (estadoTecnico) {
        resultado = resultado.filter(
          (e) => e.estadoTecnico.toLowerCase() === String(estadoTecnico).toLowerCase()
        );
      }

      if (categoria) {
        resultado = resultado.filter(
          (e) => e.categoria.toLowerCase() === String(categoria).toLowerCase()
        );
      }

      res.status(200).json({
        success: true,
        total: resultado.length,
        filtroAmbiente: ambienteId ? String(ambienteId) : 'todos',
        data: resultado,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al listar los equipos.',
        error: (error as Error).message,
      });
    }
  };

  /**
   * 2. Registrar un nuevo equipo vinculado a un ambiente de laboratorio
   */
  public createEquipo = (req: Request, res: Response): void => {
    try {
      const { nombre, serial, placaInventario, categoria, ambienteId, estadoTecnico, ubicacion } = req.body;

      if (!nombre || !serial || !ambienteId) {
        res.status(400).json({
          success: false,
          message: 'Los campos nombre, serial y ambienteId son obligatorios.',
        });
        return;
      }

      // Validar que el ambiente vinculado exista
      const ambienteExiste = ambientesDB.some((a) => a.id === ambienteId);
      if (!ambienteExiste) {
        res.status(404).json({
          success: false,
          message: `El ambiente con ID '${ambienteId}' no existe en ControlLabs.`,
        });
        return;
      }

      const estadosValidos: EstadoTecnicoEquipo[] = ['operativo', 'en mantenimiento', 'fuera de servicio'];
      const estadoFinal: EstadoTecnicoEquipo =
        estadoTecnico && estadosValidos.includes(estadoTecnico.toLowerCase())
          ? (estadoTecnico.toLowerCase() as EstadoTecnicoEquipo)
          : 'operativo';

      const nuevoEquipo: Equipo = {
        id: `eq-${Date.now()}`,
        placaInventario: placaInventario || `SENA-INV-${Math.floor(1000 + Math.random() * 9000)}`,
        nombre,
        serial,
        categoria: categoria || 'Equipo General',
        ambienteId,
        estadoTecnico: estadoFinal,
        ubicacion: ubicacion || 'Asignado al ambiente',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      equiposDB.push(nuevoEquipo);

      res.status(201).json({
        success: true,
        message: 'Equipo vinculado y registrado exitosamente.',
        data: nuevoEquipo,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al registrar el equipo.',
        error: (error as Error).message,
      });
    }
  };

  /**
   * Consultar equipo por ID
   */
  public getEquipoById = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const equipo = equiposDB.find((e) => e.id === id);

      if (!equipo) {
        res.status(404).json({
          success: false,
          message: `Equipo con identificador '${id}' no encontrado.`,
        });
        return;
      }

      // Enriquecer con información del ambiente actual
      const ambiente = ambientesDB.find((a) => a.id === equipo.ambienteId);

      res.status(200).json({
        success: true,
        data: {
          ...equipo,
          ambienteDetalle: ambiente || null,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al consultar el equipo.',
        error: (error as Error).message,
      });
    }
  };

  /**
   * 3. Actualizar de forma parcial el estado técnico de un equipo o cambiar su ubicación (PATCH)
   * ej. marcarlo como "en mantenimiento" o cambiar su ambienteId/ubicación
   */
  public updateEquipoParcial = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const index = equiposDB.findIndex((e) => e.id === id);

      if (index === -1) {
        res.status(404).json({
          success: false,
          message: `Equipo con ID '${id}' no encontrado para modificación parcial.`,
        });
        return;
      }

      const { estadoTecnico, ubicacion, ambienteId, nombre, categoria } = req.body;

      if (estadoTecnico !== undefined) {
        const estadosValidos: EstadoTecnicoEquipo[] = ['operativo', 'en mantenimiento', 'fuera de servicio'];
        if (!estadosValidos.includes(estadoTecnico.toLowerCase() as EstadoTecnicoEquipo)) {
          res.status(400).json({
            success: false,
            message: `Estado técnico '${estadoTecnico}' inválido. Válidos: ${estadosValidos.join(', ')}.`,
          });
          return;
        }
        equiposDB[index].estadoTecnico = estadoTecnico.toLowerCase() as EstadoTecnicoEquipo;
      }

      if (ambienteId !== undefined) {
        const ambienteExiste = ambientesDB.some((a) => a.id === ambienteId);
        if (!ambienteExiste) {
          res.status(404).json({
            success: false,
            message: `El ambiente de destino con ID '${ambienteId}' no existe.`,
          });
          return;
        }
        equiposDB[index].ambienteId = ambienteId;
      }

      if (ubicacion !== undefined) {
        equiposDB[index].ubicacion = ubicacion;
      }

      if (nombre !== undefined) {
        equiposDB[index].nombre = nombre;
      }

      if (categoria !== undefined) {
        equiposDB[index].categoria = categoria;
      }

      equiposDB[index].updatedAt = new Date().toISOString();

      res.status(200).json({
        success: true,
        message: 'Estado técnico / ubicación del equipo actualizados parcialmente (PATCH).',
        cambiosAplicados: req.body,
        data: equiposDB[index],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar parcialmente el equipo.',
        error: (error as Error).message,
      });
    }
  };
}

export const equipoController = new EquipoController();
