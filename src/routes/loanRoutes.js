const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { authenticateJWT } = require('../middlewares/auth');
const { authorizeRoles } = require('../middlewares/roles');

// Endpoints REST para préstamos
router.post('/', authenticateJWT, loanController.createLoan);
router.get('/', authenticateJWT, loanController.getLoans);
router.get('/:id', authenticateJWT, loanController.getLoanById);

// Acciones restringidas para instructores y coordinadores / admin
router.patch(
  '/:id/approve',
  authenticateJWT,
  authorizeRoles('ADMIN', 'INSTRUCTOR', 'COORDINADOR'),
  loanController.approveLoan
);

router.patch(
  '/:id/return',
  authenticateJWT,
  authorizeRoles('ADMIN', 'INSTRUCTOR', 'COORDINADOR'),
  loanController.returnLoan
);

module.exports = router;
