const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const InventoryItem = sequelize.define(
  'InventoryItem',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    inventoryPlate: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Número de placa oficial de inventario SENA',
    },
    serialNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Número de serie de fabricante del equipo',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM(
        'HERRAMIENTA',
        'EQUIPO_COMPUTO',
        'INSTRUMENTO_MEDICION',
        'DISPOSITIVO_RED',
        'OTRO'
      ),
      allowNull: false,
      defaultValue: 'EQUIPO_COMPUTO',
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'rooms',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('AVAILABLE', 'LOANED', 'MAINTENANCE', 'DECOMMISSIONED'),
      allowNull: false,
      defaultValue: 'AVAILABLE',
    },
    requiresInstructorApproval: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Indica si el aprendiz requiere autorización previa de un instructor',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'inventory_items',
    timestamps: true,
  }
);

module.exports = InventoryItem;
