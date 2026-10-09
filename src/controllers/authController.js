const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AppError } = require('../middlewares/errorHandler');
const { isSenaEmail } = require('../config/oauth');

class AuthController {
  /**
   * Endpoint de autenticación/login (o generación de token JWT)
   */
  async login(req, res, next) {
    try {
      const { email, documentNumber } = req.body;

      if (!email && !documentNumber) {
        throw new AppError('Debe ingresar el correo institucional o documento de identidad.', 400);
      }

      const where = email ? { email } : { documentNumber };
      let user = await User.findOne({ where });

      if (!user) {
        throw new AppError('Usuario no encontrado en el sistema.', 404);
      }

      if (user.status !== 'ACTIVE') {
        throw new AppError('El usuario se encuentra inactivo.', 403);
      }

      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        documentNumber: user.documentNumber,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
        expiresIn: process.env.JWT_EXPIRES_IN || '8h',
      });

      res.status(200).json({
        success: true,
        message: 'Autenticación exitosa',
        token,
        user: payload,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Registro rápido de usuarios SENA
   */
  async register(req, res, next) {
    try {
      const { email, name, documentNumber, role = 'APRENDIZ' } = req.body;

      if (!email || !name || !documentNumber) {
        throw new AppError('Nombre, documento y correo institucional son obligatorios.', 400);
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new AppError('El correo institucional ya se encuentra registrado.', 409);
      }

      const user = await User.create({
        email,
        name,
        documentNumber,
        role,
      });

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Simulación o callback de inicio con Google OAuth institucional
   */
  async googleCallback(req, res, next) {
    try {
      const { email, name } = req.body;

      if (!email) {
        throw new AppError('Datos de Google OAuth incompletos.', 400);
      }

      if (!isSenaEmail(email)) {
        throw new AppError('Solo se permiten cuentas con dominio oficial del SENA (@sena.edu.co o @misena.edu.co).', 403);
      }

      let user = await User.findOne({ where: { email } });
      if (!user) {
        user = await User.create({
          email,
          name: name || email.split('@')[0],
          documentNumber: `GOOGLE_${Date.now()}`,
          role: 'APRENDIZ',
        });
      }

      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
        expiresIn: process.env.JWT_EXPIRES_IN || '8h',
      });

      res.status(200).json({
        success: true,
        message: 'Autenticación con Google institucional exitosa',
        token,
        user: payload,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
