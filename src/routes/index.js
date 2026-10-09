const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const loanRoutes = require('./loanRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const roomRoutes = require('./roomRoutes');
const reportRoutes = require('./reportRoutes');

// Mapeo de prefijos REST modulares
router.use('/auth', authRoutes);
router.use('/loans', loanRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/rooms', roomRoutes);
router.use('/reports', reportRoutes);

// Metadata de la API
router.get('/', (req, res) => {
  res.status(200).json({
    name: 'SENA Control Labs API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      auth: '/api/v1/auth',
      loans: '/api/v1/loans',
      inventory: '/api/v1/inventory',
      rooms: '/api/v1/rooms',
      reports: '/api/v1/reports',
    },
  });
});

module.exports = router;
