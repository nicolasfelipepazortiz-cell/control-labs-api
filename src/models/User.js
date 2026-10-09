const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    documentNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Número de documento de identidad del usuario SENA',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'INSTRUCTOR', 'APRENDIZ', 'COORDINADOR'),
      allowNull: false,
      defaultValue: 'APRENDIZ',
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);

module.exports = User;
