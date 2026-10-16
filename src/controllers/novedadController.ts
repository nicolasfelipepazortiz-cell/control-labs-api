import { Request, Response } from 'express';
import { novedadesDB, equiposDB, ambientesDB } from '../data/mockData';
import { Novedad, EstadoNovedad, PrioridadNovedad } from '../types';

export class NovedadController {
  /**
   * 1. Consultar el historial completo de incidencias reportadas
   * Permite filtrar por estado, prioridad, equipoId o ambienteId
   */
  public getNovedades = (req: Request, res: Response): void => {
    try {
      const { estado, prioridad, equipoId, ambienteId } = req.query;

      let resultado = [...novedadesDB];

      if (estado) {
        resultado = resultado.filter(
          (n) => n.estado.toLowerCase() === String(estado).toLowerCase()
        );
      }

      if (prioridad) {
        resultado = resultado.filter(
          (n) => n.prioridad.toLowerCase() === String(prioridad).toLowerCase()
        );
      }

      if (equipoId) {
        resultado = resultado.filter((n) => n.equipoId === String(equipoId));
      }

      if (ambienteId) {
        resultado = resultado.filter((n) => n.ambienteId === String(ambienteId));
      }

      res.status(200).json({
        success: true,
        total: resultado.length,
        data: resultado,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al consultar el historial de incidencias.',
        error: (error as Error).message,
      });
    }
  };

  /**
   * 2. Crear un reporte de novedad asociándolo a un equipo o ambiente específico
   */
  public createNovedad = (req: Request, res: Response): void => {
    try {
      const { titulo, descripcion, prioridad, equipoId, ambienteId, reportadoPor, observaciones } = req.body;

      if (!titulo || !descripcion) {
        res.status(400).json({
          success: false,
          message: 'El título y la descripción de la novedad son obligatorios.',
        });
        return;
      }

      // Validar que esté asociado al menos a un equipo o a un ambiente
      if (!equipoId && !ambienteId) {
        res.status(400).json({
          success: false,
          message: 'Debe asociar la novedad a un equipo (equipoId) o a un ambiente (ambienteId).',
        });
        return;
      }

      if (equipoId) {
        const existeEquipo = equiposDB.some((e) => e.id === equipoId);
        if (!existeEquipo) {
          res.status(404).json({
            success: false,
            message: `El equipo asociado con ID '${equipoId}' no existe.`,
          });
          return;
        }
      }

      if (ambienteId) {
        const existeAmbiente = ambientesDB.some((a) => a.id === ambienteId);
        if (!existeAmbiente) {
          res.status(404).json({
            success: false,
            message: `El ambiente asociado con ID '${ambienteId}' no existe.`,
          });
          return;
        }
      }

      const prioridadesValidas: PrioridadNovedad[] = ['baja', 'media', 'alta', 'critica'];
      const prioridadFinal: PrioridadNovedad =
        prioridad && prioridadesValidas.includes(prioridad.toLowerCase() as PrioridadNovedad)
          ? (prioridad.toLowerCase() as PrioridadNovedad)
          : 'media';

      const nuevaNovedad: Novedad = {
        id: `nov-${Date.now()}`,
        titulo,
        descripcion,
        prioridad: prioridadFinal,
        estado: 'pendiente',
        equipoId: equipoId || undefined,
        ambienteId: ambienteId || undefined,
        reportadoPor: reportadoPor || 'Usuario del Sistema',
        fechaReporte: new Date().toISOString(),
        observaciones: observaciones || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      novedadesDB.push(nuevaNovedad);

      res.status(201).json({
        success: true,
        message: 'Reporte de novedad/incidencia creado exitosamente.',
        data: nuevaNovedad,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al registrar la novedad.',
        error: (error as Error).message,
      });
    }
  };

  /**
   * Consultar detalle de una novedad por ID
   */
  public getNovedadById = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const novedad = novedadesDB.find((n) => n.id === id);

      if (!novedad) {
        res.status(404).json({
          success: false,
          message: `Incidencia con identificador '${id}' no encontrada.`,
        });
        return;
      }

      const equipoRelacionado = novedad.equipoId ? equiposDB.find((e) => e.id === novedad.equipoId) : null;
      const ambienteRelacionado = novedad.ambienteId ? ambientesDB.find((a) => a.id === novedad.ambienteId) : null;

      res.status(200).json({
        success: true,
        data: {
          ...novedad,
          equipo: equipoRelacionado || undefined,
          ambiente: ambienteRelacionado || undefined,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al consultar la incidencia.',
        error: (error as Error).message,
      });
    }
  };

  /**
   * 3. Actualizar parcialmente el estado de una novedad (PATCH)
   * ej. cambiar de "pendiente" a "en proceso" o "resuelto"
   */
  public updateNovedadParcial = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const index = novedadesDB.findIndex((n) => n.id === id);

      if (index === -1) {
        res.status(404).json({
          success: false,
          message: `Novedad con ID '${id}' no encontrada para actualización parcial.`,
        });
        return;
      }

      const { estado, observaciones, prioridad } = req.body;

      if (estado !== undefined) {
        const estadosValidos: EstadoNovedad[] = ['pendiente', 'en proceso', 'resuelto'];
        if (!estadosValidos.includes(estado.toLowerCase() as EstadoNovedad)) {
          res.status(400).json({
            success: false,
            message: `Estado '${estado}' inválido. Estados permitidos: ${estadosValidos.join(', ')}.`,
          });
          return;
        }
        novedadesDB[index].estado = estado.toLowerCase() as EstadoNovedad;
      }

      if (observaciones !== undefined) {
        novedadesDB[index].observaciones = observaciones;
      }

      if (prioridad !== undefined) {
        const prioridadesValidas: PrioridadNovedad[] = ['baja', 'media', 'alta', 'critica'];
        if (!prioridadesValidas.includes(prioridad.toLowerCase() as PrioridadNovedad)) {
          res.status(400).json({
            success: false,
            message: `Prioridad '${prioridad}' inválida. Válidas: ${prioridadesValidas.join(', ')}.`,
          });
          return;
        }
        novedadesDB[index].prioridad = prioridad.toLowerCase() as PrioridadNovedad;
      }

      novedadesDB[index].updatedAt = new Date().toISOString();

      res.status(200).json({
        success: true,
        message: 'Estado de la novedad actualizado parcialmente (PATCH).',
        cambiosAplicados: req.body,
        data: novedadesDB[index],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar parcialmente la novedad.',
        error: (error as Error).message,
      });
    }
  };
}

export const novedadController = new NovedadController();
