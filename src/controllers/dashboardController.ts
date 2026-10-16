import { Request, Response } from 'express';
import { usuariosDB, ambientesDB, equiposDB, novedadesDB } from '../data/mockData';
import { DashboardMetrics, RolUsuario, EstadoNovedad } from '../types';

export class DashboardController {
  /**
   * 1. Obtener un resumen consolidado con contadores globales de:
   * - usuarios
   * - ambientes activos
   * - equipos operativos
   * - novedades críticas sin resolver
   * Optimizado para renderizar las tarjetas principales del panel de administración
   */
  public getResumen = (req: Request, res: Response): void => {
    try {
      const totalUsuarios = usuariosDB.length;
      const usuariosActivos = usuariosDB.filter((u) => u.activo === true).length;

      const totalAmbientes = ambientesDB.length;
      const ambientesActivos = ambientesDB.filter((a) => a.estadoOperativo === 'disponible').length;

      const totalEquipos = equiposDB.length;
      const equiposOperativos = equiposDB.filter((e) => e.estadoTecnico === 'operativo').length;
      const equiposEnMantenimiento = equiposDB.filter((e) => e.estadoTecnico === 'en mantenimiento').length;

      const totalNovedades = novedadesDB.length;
      const novedadesCriticasSinResolver = novedadesDB.filter(
        (n) => n.prioridad === 'critica' && (n.estado === 'pendiente' || n.estado === 'en proceso')
      ).length;

      const resumenPorRol: Record<RolUsuario, number> = {
        estudiante: usuariosDB.filter((u) => u.rol === 'estudiante').length,
        docente: usuariosDB.filter((u) => u.rol === 'docente').length,
        administrador: usuariosDB.filter((u) => u.rol === 'administrador').length,
      };

      const novedadesPorEstado: Record<EstadoNovedad, number> = {
        pendiente: novedadesDB.filter((n) => n.estado === 'pendiente').length,
        'en proceso': novedadesDB.filter((n) => n.estado === 'en proceso').length,
        resuelto: novedadesDB.filter((n) => n.estado === 'resuelto').length,
      };

      const metrics: DashboardMetrics = {
        totalUsuarios,
        usuariosActivos,
        ambientesActivos,
        totalAmbientes,
        equiposOperativos,
        totalEquipos,
        novedadesCriticasSinResolver,
        totalNovedades,
        resumenPorRol,
        novedadesPorEstado,
      };

      // Formato estructurado optimizado para tarjetas (Cards) de UI de administración
      res.status(200).json({
        success: true,
        timestamp: new Date().toISOString(),
        tarjetas: {
          usuarios: {
            titulo: 'Usuarios Registrados',
            total: totalUsuarios,
            activos: usuariosActivos,
            inactivos: totalUsuarios - usuariosActivos,
            icono: 'users',
          },
          ambientes: {
            titulo: 'Ambientes / Labs Activos',
            activosDisponibles: ambientesActivos,
            total: totalAmbientes,
            porcentajeOperativo: totalAmbientes > 0 ? Math.round((ambientesActivos / totalAmbientes) * 100) : 0,
            icono: 'building',
          },
          equipos: {
            titulo: 'Equipos Operativos',
            operativos: equiposOperativos,
            enMantenimiento: equiposEnMantenimiento,
            total: totalEquipos,
            porcentajeDisponibilidad: totalEquipos > 0 ? Math.round((equiposOperativos / totalEquipos) * 100) : 0,
            icono: 'cpu',
          },
          novedadesCriticas: {
            titulo: 'Novedades Críticas Sin Resolver',
            totalCriticasPendientes: novedadesCriticasSinResolver,
            totalIncidencias: totalNovedades,
            alerta: novedadesCriticasSinResolver > 0,
            icono: 'alert-triangle',
          },
        },
        metricasDetalladas: metrics,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al generar el resumen del dashboard analítico.',
        error: (error as Error).message,
      });
    }
  };
}

export const dashboardController = new DashboardController();
