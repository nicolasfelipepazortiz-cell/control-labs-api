const { Loan, User, InventoryItem, Room } = require('../models');
const { AppError } = require('../middlewares/errorHandler');
const { Op } = require('sequelize');

class LoanService {
  /**
   * Crea una solicitud de préstamo aplicando reglas del SENA
   */
  async createLoan(data, requestingUser) {
    const {
      userId,
      inventoryItemId,
      roomId,
      expectedReturnDate,
      trainingProgram,
      courseCode,
      observations,
    } = data;

    const applicantId = userId || requestingUser.id;

    // 1. Validar existencia y estado del usuario solicitante
    const user = await User.findByPk(applicantId);
    if (!user) {
      throw new AppError('El usuario solicitante no existe.', 404);
    }
    if (user.status !== 'ACTIVE') {
      throw new AppError('El usuario se encuentra inactivo y no puede solicitar préstamos.', 403);
    }

    // 2. Validar que se solicite al menos un recurso (equipo o ambiente)
    if (!inventoryItemId && !roomId) {
      throw new AppError('Debe especificar al menos un elemento de inventario o un laboratorio para el préstamo.', 400);
    }

    // 3. Validar fechas de préstamo
    const now = new Date();
    const returnDate = new Date(expectedReturnDate);
    if (isNaN(returnDate.getTime()) || returnDate <= now) {
      throw new AppError('La fecha de devolución estimada debe ser posterior a la fecha actual.', 400);
    }

    let initialStatus = 'APPROVED';
    let item = null;
    let room = null;

    // 4. Validar disponibilidad y reglas del elemento de inventario
    if (inventoryItemId) {
      item = await InventoryItem.findByPk(inventoryItemId);
      if (!item) {
        throw new AppError('El elemento de inventario especificado no existe.', 404);
      }
      if (item.status !== 'AVAILABLE') {
        throw new AppError(`El elemento '${item.name}' (Placa: ${item.inventoryPlate}) no está disponible. Estado actual: ${item.status}.`, 409);
      }

      // Regla SENA: Si el aprendiz pide equipo que requiere aprobación de instructor
      if (item.requiresInstructorApproval && requestingUser.role === 'APRENDIZ') {
        initialStatus = 'PENDING';
      }
    }

    // 5. Validar disponibilidad de ambiente/laboratorio
    if (roomId) {
      room = await Room.findByPk(roomId);
      if (!room) {
        throw new AppError('El ambiente/laboratorio especificado no existe.', 404);
      }
      if (room.status !== 'AVAILABLE') {
        throw new AppError(`El ambiente '${room.name}' (${room.code}) no está disponible. Estado actual: ${room.status}.`, 409);
      }
    }

    // 6. Registrar préstamo
    const loan = await Loan.create({
      userId: applicantId,
      inventoryItemId: inventoryItemId || null,
      roomId: roomId || null,
      loanDate: now,
      expectedReturnDate: returnDate,
      status: initialStatus,
      trainingProgram: trainingProgram || null,
      courseCode: courseCode || null,
      observations: observations || null,
      approvedById: initialStatus === 'APPROVED' ? requestingUser.id : null,
    });

    // 7. Si fue aprobado de inmediato, cambiar estado del ítem a 'LOANED'
    if (initialStatus === 'APPROVED' && item) {
      await item.update({ status: 'LOANED' });
    }

    return loan;
  }

  /**
   * Aprueba una solicitud de préstamo pendiente (por Instructor o Admin)
   */
  async approveLoan(loanId, approverUser) {
    const loan = await Loan.findByPk(loanId, {
      include: [{ model: InventoryItem, as: 'item' }],
    });

    if (!loan) {
      throw new AppError('Préstamo no encontrado.', 404);
    }

    if (loan.status !== 'PENDING') {
      throw new AppError(`El préstamo no está pendiente de aprobación (estado actual: ${loan.status}).`, 400);
    }

    // Si tiene ítem asociado, verificar que siga disponible
    if (loan.item) {
      if (loan.item.status !== 'AVAILABLE') {
        throw new AppError(`El equipo asociado ya no está disponible para préstamo.`, 409);
      }
      await loan.item.update({ status: 'LOANED' });
    }

    await loan.update({
      status: 'APPROVED',
      approvedById: approverUser.id,
    });

    return loan;
  }

  /**
   * Registra la devolución de los recursos y valida novedades
   */
  async returnLoan(loanId, returnData = {}) {
    const loan = await Loan.findByPk(loanId, {
      include: [{ model: InventoryItem, as: 'item' }],
    });

    if (!loan) {
      throw new AppError('Préstamo no encontrado.', 404);
    }

    if (['RETURNED', 'CANCELLED'].includes(loan.status)) {
      throw new AppError(`El préstamo ya ha sido finalizado previamente (${loan.status}).`, 400);
    }

    const { itemStatusAfterReturn = 'AVAILABLE', noveltyObservations } = returnData;

    // Actualizar estado del elemento a disponible o a mantenimiento si hubo daños
    if (loan.item) {
      await loan.item.update({ status: itemStatusAfterReturn });
    }

    const observations = noveltyObservations 
      ? `${loan.observations ? loan.observations + ' | ' : ''}Novedad entrega: ${noveltyObservations}` 
      : loan.observations;

    await loan.update({
      status: 'RETURNED',
      actualReturnDate: new Date(),
      observations,
    });

    return loan;
  }

  /**
   * Obtiene préstamos con filtros
   */
  async getLoans(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.userId) where.userId = filters.userId;
    if (filters.courseCode) where.courseCode = filters.courseCode;

    return await Loan.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'documentNumber', 'role'] },
        { model: InventoryItem, as: 'item' },
        { model: Room, as: 'room' },
        { model: User, as: 'approver', attributes: ['id', 'name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Obtiene detalle de un préstamo por ID
   */
  async getLoanById(id) {
    const loan = await Loan.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'documentNumber', 'role'] },
        { model: InventoryItem, as: 'item' },
        { model: Room, as: 'room' },
        { model: User, as: 'approver', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!loan) {
      throw new AppError('Préstamo no encontrado.', 404);
    }

    return loan;
  }
}

module.exports = new LoanService();
