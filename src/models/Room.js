const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Room = sequelize.define(
  'Room',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Código identificador del ambiente/laboratorio SENA',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    campus: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Centro de Formación',
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    status: {
      type: DataTypes.ENUM('AVAILABLE', 'MAINTENANCE', 'OCCUPIED'),
      allowNull: false,
      defaultValue: 'AVAILABLE',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'rooms',
    timestamps: true,
  }
);

module.exports = Room;
