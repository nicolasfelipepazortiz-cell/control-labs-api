export type RolUsuario = 'estudiante' | 'docente' | 'administrador';
export type EstadoCuenta = 'activo' | 'inactivo' | 'suspendido';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password?: string;
  rol: RolUsuario;
  estado: EstadoCuenta;
  activo: boolean; // Flag de eliminación lógica
  documento?: string;
  createdAt: string;
  updatedAt: string;
}

export type EstadoAmbiente = 'disponible' | 'mantenimiento' | 'ocupado' | 'inactivo';

export interface Ambiente {
  id: string;
  codigo: string;
  nombre: string;
  capacidad: number;
  ubicacion: string;
  estadoOperativo: EstadoAmbiente;
  descripcion?: string;
  createdAt: string;
  updatedAt: string;
}

export type EstadoTecnicoEquipo = 'operativo' | 'en mantenimiento' | 'fuera de servicio';

export interface Equipo {
  id: string;
  placaInventario: string;
  nombre: string;
  serial: string;
  categoria: string;
  ambienteId: string; // Vinculado a un ambiente
  estadoTecnico: EstadoTecnicoEquipo;
  ubicacion: string;
  createdAt: string;
  updatedAt: string;
}

export type EstadoNovedad = 'pendiente' | 'en proceso' | 'resuelto';
export type PrioridadNovedad = 'baja' | 'media' | 'alta' | 'critica';

export interface Novedad {
  id: string;
  titulo: string;
  descripcion: string;
  prioridad: PrioridadNovedad;
  estado: EstadoNovedad;
  equipoId?: string; // Vinculación a equipo específico
  ambienteId?: string; // O vinculación a ambiente
  reportadoPor: string;
  fechaReporte: string;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  totalUsuarios: number;
  usuariosActivos: number;
  ambientesActivos: number;
  totalAmbientes: number;
  equiposOperativos: number;
  totalEquipos: number;
  novedadesCriticasSinResolver: number;
  totalNovedades: number;
  resumenPorRol: Record<RolUsuario, number>;
  novedadesPorEstado: Record<EstadoNovedad, number>;
}
