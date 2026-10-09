/**
 * Middleware para Control de Acceso Basado en Roles (RBAC)
 * @param  {...string} allowedRoles - Roles permitidos ('ADMIN', 'INSTRUCTOR', 'APRENDIZ', 'COORDINADOR')
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado: Debe iniciar sesión primero.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado: El rol '${req.user.role}' no cuenta con los permisos necesarios para realizar esta acción.`,
        requiredRoles: allowedRoles,
      });
    }

    next();
  };
};

module.exports = {
  authorizeRoles,
};
