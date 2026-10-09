require('dotenv').config();

/**
 * Configuración de credenciales y alcances (scopes) para Google OAuth 2.0
 */
const googleOAuthConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/v1/auth/google/callback',
  scopes: ['profile', 'email'],
  allowedDomains: ['sena.edu.co', 'misena.edu.co'], // Restricción para correos institucionales SENA
};

/**
 * Validador para verificar que el correo electrónico pertenezca a la organización SENA
 * @param {string} email 
 * @returns {boolean}
 */
const isSenaEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return googleOAuthConfig.allowedDomains.some((domain) => email.toLowerCase().endsWith(`@${domain}`));
};

module.exports = {
  googleOAuthConfig,
  isSenaEmail,
};
