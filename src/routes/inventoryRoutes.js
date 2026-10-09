const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { authenticateJWT } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/roles');

// Consultas de inventario
router.get('/', authenticateJWT, inventoryController.getItems);
router.get('/:id', authenticateJWT, inventoryController.getItemById);

// Gestión de inventario (restringido)
router.post(
  '/',
  authenticateJWT,
  authorizeRoles('ADMIN', 'COORDINADOR', 'INSTRUCTOR'),
  inventoryController.createItem
);

router.patch(
  '/:id/relocate',
  authenticateJWT,
  authorizeRoles('ADMIN', 'COORDINADOR', 'INSTRUCTOR'),
  inventoryController.relocateItem
);

router.patch(
  '/:id/status',
  authenticateJWT,
  authorizeRoles('ADMIN', 'COORDINADOR', 'INSTRUCTOR'),
  inventoryController.updateStatus
);

module.exports = router;
