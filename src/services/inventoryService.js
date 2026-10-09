const { InventoryItem, Room } = require('../models');
const { AppError } = require('../middlewares/errorHandler');

class InventoryService {
  /**
   * Crea un nuevo elemento en el inventario SENA validando placa
   */
  async createItem(itemData) {
    const { inventoryPlate, roomId } = itemData;

    // Validar placa obligatoria
    if (!inventoryPlate || inventoryPlate.trim() === '') {
      throw new AppError('El número de placa de inventario SENA es obligatorio.', 400);
    }

    const existingItem = await InventoryItem.findOne({
      where: { inventoryPlate: inventoryPlate.trim() },
    });

    if (existingItem) {
      throw new AppError(`Ya existe un activo registrado con la placa SENA '${inventoryPlate}'.`, 409);
    }

    if (roomId) {
      const room = await Room.findByPk(roomId);
      if (!room) {
        throw new AppError('El ambiente/laboratorio asignado no existe.', 404);
      }
    }

    return await InventoryItem.create({
      ...itemData,
      inventoryPlate: inventoryPlate.trim(),
    });
  }

  /**
   * Reubica un activo de inventario a otro ambiente/laboratorio
   */
  async relocateItem(itemId, newRoomId) {
    const item = await InventoryItem.findByPk(itemId);
    if (!item) {
      throw new AppError('Elemento de inventario no encontrado.', 404);
    }

    const room = await Room.findByPk(newRoomId);
    if (!room) {
      throw new AppError('El ambiente de destino no existe.', 404);
    }

    await item.update({ roomId: newRoomId });
    return item;
  }

  /**
   * Actualiza el estado técnico de un activo (disponible, mantenimiento, baja)
   */
  async updateStatus(itemId, newStatus) {
    const validStatuses = ['AVAILABLE', 'LOANED', 'MAINTENANCE', 'DECOMMISSIONED'];
    if (!validStatuses.includes(newStatus)) {
      throw new AppError(`Estado no válido. Valores permitidos: ${validStatuses.join(', ')}`, 400);
    }

    const item = await InventoryItem.findByPk(itemId);
    if (!item) {
      throw new AppError('Elemento de inventario no encontrado.', 404);
    }

    await item.update({ status: newStatus });
    return item;
  }

  /**
   * Lista elementos de inventario con filtros
   */
  async getItems(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.category) where.category = filters.category;
    if (filters.roomId) where.roomId = filters.roomId;

    return await InventoryItem.findAll({
      where,
      include: [{ model: Room, as: 'room', attributes: ['id', 'code', 'name'] }],
      order: [['inventoryPlate', 'ASC']],
    });
  }

  /**
   * Obtiene elemento por ID
   */
  async getItemById(id) {
    const item = await InventoryItem.findByPk(id, {
      include: [{ model: Room, as: 'room' }],
    });

    if (!item) {
      throw new AppError('Elemento de inventario no encontrado.', 404);
    }

    return item;
  }
}

module.exports = new InventoryService();
