const { Sequelize } = require('sequelize');
require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'postgres';

let sequelize;

if (dialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'control_labs_sena',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      dialect: dialect,
      logging: process.env.NODE_ENV === 'development' ? false : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

/**
 * Prueba y valida la conexión con el servidor de base de datos
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`[Database] Conexión establecida exitosamente usando dialecto '${dialect}'.`);
  } catch (error) {
    console.warn(`[Database] Aviso: No se pudo conectar a la base de datos (${error.message}).`);
    console.warn(`[Database] Asegúrate de que las credenciales en .env correspondan a tu servicio activo.`);
  }
};

module.exports = {
  sequelize,
  connectDB,
};
