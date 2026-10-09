const inventoryService = require('../services/inventoryService');

class InventoryController {
  async createItem(req, res, next) {
    try {
      const item = await inventoryService.createItem(req.body);
      res.status(201).json({
        success: true,
        message: 'Elemento registrado en el inventario SENA exitosamente.',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  async getItems(req, res, next) {
    try {
      const items = await inventoryService.getItems(req.query);
      res.status(200).json({
        success: true,
        count: items.length,
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }

  async getItemById(req, res, next) {
    try {
      const item = await inventoryService.getItemById(req.params.id);
      res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  async relocateItem(req, res, next) {
    try {
      const { roomId } = req.body;
      const item = await inventoryService.relocateItem(req.params.id, roomId);
      res.status(200).json({
        success: true,
        message: 'Elemento reubicado correctamente.',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const item = await inventoryService.updateStatus(req.params.id, status);
      res.status(200).json({
        success: true,
        message: 'Estado del elemento actualizado con éxito.',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InventoryController();
