const jwt = require('jsonwebtoken');

/**
 * Middleware para autenticar solicitudes mediante token JWT
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Acceso no autorizado: No se proporcionó un token Bearer válido.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded; // { id, email, role, documentNumber }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado.',
      error: error.message,
    });
  }
};

module.exports = {
  authenticateJWT,
};
