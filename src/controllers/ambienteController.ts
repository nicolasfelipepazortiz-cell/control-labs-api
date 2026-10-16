import { Request, Response } from 'express';
import { ambientesDB } from '../data/mockData';
import { Ambiente, EstadoAmbiente } from '../types';

export class AmbienteController {
  /**
   * 1. Listar todos los espacios físicos y laboratorios de ControlLabs
   */
  public getAmbientes = (req: Request, res: Response): void => {
    try {
      const { estadoOperativo } = req.query;

      let resultado = [...ambientesDB];

      if (estadoOperativo) {
        resultado = resultado.filter(
          (a) => a.estadoOperativo.toLowerCase() === String(estadoOperativo).toLowerCase()
        );
      }

      res.status(200).json({
        success: true,
        total: resultado.length,
        data: resultado,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al consultar los ambientes y laboratorios.',
        error: (error as Error).message,
      });
    }
  };

  /**
   * 2. Crear un nuevo ambiente especificando su capacidad y ubicación
   */
  public createAmbiente = (req: Request, res: Response): void => {
    try {
      const { nombre, codigo, capacidad, ubicacion, estadoOperativo, descripcion } = req.body;

      if (!nombre || !capacidad || !ubicacion) {
        res.status(400).json({
          success: false,
          message: 'Los atributos nombre, capacidad y ubicación son obligatorios para crear un ambiente.',
        });
        return;
      }

      if (typeof capacidad !== 'number' || capacidad <= 0) {
        res.status(400).json({
          success: false,
          message: 'La capacidad debe ser un número entero mayor a 0.',
        });
        return;
      }

      const estadosValidos: EstadoAmbiente[] = ['disponible', 'mantenimiento', 'ocupado', 'inactivo'];
      const estadoFinal: EstadoAmbiente = estadoOperativo && estadosValidos.includes(estadoOperativo.toLowerCase())
        ? (estadoOperativo.toLowerCase() as EstadoAmbiente)
        : 'disponible';

      const nuevoAmbiente: Ambiente = {
        id: `amb-${Date.now()}`,
        codigo: codigo || `AMB-${Math.floor(100 + Math.random() * 900)}`,
        nombre,
        capacidad,
        ubicacion,
        estadoOperativo: estadoFinal,
        descripcion: descripcion || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      ambientesDB.push(nuevoAmbiente);

      res.status(201).json({
        success: true,
        message: 'Espacio físico / laboratorio creado con éxito.',
        data: nuevoAmbiente,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al registrar el nuevo ambiente.',
        error: (error as Error).message,
      });
    }
  };

  /**
   * Consultar ambiente por ID
   */
  public getAmbienteById = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const ambiente = ambientesDB.find((a) => a.id === id);

      if (!ambiente) {
        res.status(404).json({
          success: false,
          message: `Ambiente con identificador '${id}' no encontrado.`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: ambiente,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al consultar el ambiente.',
        error: (error as Error).message,
      });
    }
  };

  /**
   * 3. Actualizar atributos específicos de un ambiente vía PATCH
   * (ej. cambiar solo la capacidad o estado operativo)
   */
  public updateAmbienteParcial = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const index = ambientesDB.findIndex((a) => a.id === id);

      if (index === -1) {
        res.status(404).json({
          success: false,
          message: `Ambiente con ID '${id}' no encontrado para actualización parcial.`,
        });
        return;
      }

      const { capacidad, estadoOperativo, ubicacion, nombre, descripcion } = req.body;

      if (capacidad !== undefined) {
        if (typeof capacidad !== 'number' || capacidad <= 0) {
          res.status(400).json({
            success: false,
            message: 'La capacidad debe ser un número entero positivo.',
          });
          return;
        }
        ambientesDB[index].capacidad = capacidad;
      }

      if (estadoOperativo !== undefined) {
        const estadosValidos: EstadoAmbiente[] = ['disponible', 'mantenimiento', 'ocupado', 'inactivo'];
        if (!estadosValidos.includes(estadoOperativo.toLowerCase() as EstadoAmbiente)) {
          res.status(400).json({
            success: false,
            message: `Estado operativo '${estadoOperativo}' inválido. Válidos: ${estadosValidos.join(', ')}.`,
          });
          return;
        }
        ambientesDB[index].estadoOperativo = estadoOperativo.toLowerCase() as EstadoAmbiente;
      }

      if (ubicacion !== undefined) {
        ambientesDB[index].ubicacion = ubicacion;
      }

      if (nombre !== undefined) {
        ambientesDB[index].nombre = nombre;
      }

      if (descripcion !== undefined) {
        ambientesDB[index].descripcion = descripcion;
      }

      ambientesDB[index].updatedAt = new Date().toISOString();

      res.status(200).json({
        success: true,
        message: 'Atributos del ambiente actualizados parcialmente con éxito (PATCH).',
        cambiosAplicados: req.body,
        data: ambientesDB[index],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar parcialmente el ambiente.',
        error: (error as Error).message,
      });
    }
  };
}

export const ambienteController = new AmbienteController();
