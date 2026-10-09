const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authenticateJWT } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/roles');

router.get('/', authenticateJWT, roomController.getRooms);
router.get('/:id', authenticateJWT, roomController.getRoomById);

router.post(
  '/',
  authenticateJWT,
  authorizeRoles('ADMIN', 'COORDINADOR'),
  roomController.createRoom
);

module.exports = router;
