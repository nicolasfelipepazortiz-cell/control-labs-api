/**
 * Clase personalizada de error operacional para la API
 */
class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware centralizado para captura y formateo de errores
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';
  let details = err.details || null;

  // Manejo de errores de validación de Sequelize
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = 'Error de validación en la base de datos';
    details = err.errors ? err.errors.map((e) => ({ field: e.path, message: e.message })) : [];
  }

  // Manejo de error de sintaxis JSON en el cuerpo de la petición
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'El cuerpo de la petición contiene un JSON inválido.';
  }

  // Manejo de errores JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token de autenticación no válido.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'El token de autenticación ha expirado.';
  }

  const response = {
    success: false,
    message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  if (statusCode >= 500) {
    console.error(`[Error Handler] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(statusCode).json(response);
};

module.exports = {
  AppError,
  errorHandler,
};
