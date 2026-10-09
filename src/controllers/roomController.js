const { Room, InventoryItem } = require('../models');
const { AppError } = require('../middlewares/errorHandler');

class RoomController {
  async createRoom(req, res, next) {
    try {
      const room = await Room.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Ambiente/Laboratorio creado con éxito.',
        data: room,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRooms(req, res, next) {
    try {
      const rooms = await Room.findAll({
        include: [{ model: InventoryItem, as: 'items' }],
      });
      res.status(200).json({
        success: true,
        count: rooms.length,
        data: rooms,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRoomById(req, res, next) {
    try {
      const room = await Room.findByPk(req.params.id, {
        include: [{ model: InventoryItem, as: 'items' }],
      });
      if (!room) {
        throw new AppError('Ambiente no encontrado.', 404);
      }
      res.status(200).json({
        success: true,
        data: room,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RoomController();
