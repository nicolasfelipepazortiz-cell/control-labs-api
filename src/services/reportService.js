const { Loan, InventoryItem, Room, User } = require('../models');
const { Op } = require('sequelize');

class ReportService {
  /**
   * Obtiene préstamos vencidos (fecha esperada superada y no devueltos)
   */
  async getOverdueLoans() {
    const now = new Date();

    const overdueLoans = await Loan.findAll({
      where: {
        status: {
          [Op.in]: ['APPROVED', 'ACTIVE', 'OVERDUE'],
        },
        expectedReturnDate: {
          [Op.lt]: now,
        },
      },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone', 'documentNumber'] },
        { model: InventoryItem, as: 'item', attributes: ['id', 'inventoryPlate', 'name'] },
        { model: Room, as: 'room', attributes: ['id', 'code', 'name'] },
      ],
      order: [['expectedReturnDate', 'ASC']],
    });

    return overdueLoans;
  }

  /**
   * Genera un resumen estadístico global del laboratorio e inventario
   */
  async getGeneralMetrics() {
    const totalUsers = await User.count();
    const totalItems = await InventoryItem.count();
    const totalRooms = await Room.count();
    const totalLoans = await Loan.count();

    const activeLoans = await Loan.count({
      where: { status: { [Op.in]: ['APPROVED', 'ACTIVE'] } },
    });

    const pendingLoans = await Loan.count({
      where: { status: 'PENDING' },
    });

    const now = new Date();
    const overdueCount = await Loan.count({
      where: {
        status: { [Op.in]: ['APPROVED', 'ACTIVE', 'OVERDUE'] },
        expectedReturnDate: { [Op.lt]: now },
      },
    });

    const itemsByStatus = {
      available: await InventoryItem.count({ where: { status: 'AVAILABLE' } }),
      loaned: await InventoryItem.count({ where: { status: 'LOANED' } }),
      maintenance: await InventoryItem.count({ where: { status: 'MAINTENANCE' } }),
      decommissioned: await InventoryItem.count({ where: { status: 'DECOMMISSIONED' } }),
    };

    return {
      overview: {
        totalUsers,
        totalItems,
        totalRooms,
        totalLoans,
        activeLoans,
        pendingLoans,
        overdueCount,
      },
      inventoryHealth: itemsByStatus,
      generatedAt: new Date().toISOString(),
    };
  }
}

module.exports = new ReportService();
