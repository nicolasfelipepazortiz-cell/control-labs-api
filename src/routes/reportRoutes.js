const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateJWT } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/roles');

router.get(
  '/metrics',
  authenticateJWT,
  authorizeRoles('ADMIN', 'COORDINADOR', 'INSTRUCTOR'),
  reportController.getGeneralMetrics
);

router.get(
  '/overdue',
  authenticateJWT,
  authorizeRoles('ADMIN', 'COORDINADOR', 'INSTRUCTOR'),
  reportController.getOverdueLoans
);

module.exports = router;
