const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Loan = sequelize.define(
  'Loan',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'Usuario que solicita el préstamo (aprendiz o instructor)',
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'rooms',
        key: 'id',
      },
      comment: 'Ambiente/Laboratorio prestado (si aplica)',
    },
    inventoryItemId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'inventory_items',
        key: 'id',
      },
      comment: 'Elemento de inventario prestado (si aplica)',
    },
    loanDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    expectedReturnDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    actualReturnDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        'PENDING',
        'APPROVED',
        'ACTIVE',
        'RETURNED',
        'OVERDUE',
        'CANCELLED'
      ),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    trainingProgram: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Programa de formación SENA',
    },
    courseCode: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Número de Ficha de caracterización SENA',
    },
    approvedById: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'Instructor o administrador que autoriza el préstamo',
    },
    observations: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'loans',
    timestamps: true,
  }
);

module.exports = Loan;
