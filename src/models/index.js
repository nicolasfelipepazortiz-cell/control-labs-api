const { sequelize } = require('../config/database');
const User = require('./User');
const Room = require('./Room');
const InventoryItem = require('./InventoryItem');
const Loan = require('./Loan');

// Relaciones User <-> Loan (Solicitante)
User.hasMany(Loan, { foreignKey: 'userId', as: 'loans' });
Loan.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Relaciones User <-> Loan (Aprobador / Instructor)
User.hasMany(Loan, { foreignKey: 'approvedById', as: 'approvedLoans' });
Loan.belongsTo(User, { foreignKey: 'approvedById', as: 'approver' });

// Relaciones Room <-> InventoryItem
Room.hasMany(InventoryItem, { foreignKey: 'roomId', as: 'items' });
InventoryItem.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

// Relaciones Room <-> Loan
Room.hasMany(Loan, { foreignKey: 'roomId', as: 'loans' });
Loan.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

// Relaciones InventoryItem <-> Loan
InventoryItem.hasMany(Loan, { foreignKey: 'inventoryItemId', as: 'loans' });
Loan.belongsTo(InventoryItem, { foreignKey: 'inventoryItemId', as: 'item' });

module.exports = {
  sequelize,
  User,
  Room,
  InventoryItem,
  Loan,
};
