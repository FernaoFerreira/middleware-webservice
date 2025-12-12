/**
 * Módulo de Autenticação
 * Implementa autenticação via API Key no header Authorization
 */

const API_KEY = process.env.API_KEY || 'minha-api-key-segura-123';

/**
 * Middleware para validar API Key
 * Espera header: Authorization: Bearer {API_KEY}
 */
function authenticateAPIKey(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Autenticação necessária. Forneça o header Authorization.'
    });
  }

  // Formato esperado: "Bearer API_KEY"
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Formato de autenticação inválido. Use: Bearer {API_KEY}'
    });
  }

  const token = parts[1];

  if (token !== API_KEY) {
    return res.status(403).json({
      success: false,
      message: 'API Key inválida'
    });
  }

  // Autenticação bem-sucedida
  next();
}

module.exports = {
  authenticateAPIKey
};