const crypto = require('crypto');

/**
 * Módulo de Criptografia
 * 
 * Algoritmo: AES-256-CBC
 * - AES (Advanced Encryption Standard)
 * - 256 bits de tamanho de chave
 * - CBC (Cipher Block Chaining) como modo de operação
 * 
 * A chave é armazenada em variável de ambiente (.env)
 * O IV (Initialization Vector) é gerado aleatoriamente para cada operação
 * e incluído no resultado criptografado para permitir descriptografia
 */

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'chave-padrao-32-caracteres!!';
const KEY_BUFFER = Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').substring(0, 32));

/**
 * Criptografa um texto usando AES-256-CBC
 * @param {string} text - Texto a ser criptografado
 * @returns {string} - Texto criptografado em formato hexadecimal (IV:dados)
 */
function encrypt(text) {
  try {
    // Gera um IV aleatório para cada operação
    const iv = crypto.randomBytes(16);
    
    // Cria o cipher
    const cipher = crypto.createCipheriv(ALGORITHM, KEY_BUFFER, iv);
    
    // Criptografa o texto
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Retorna IV + dados criptografados (separados por :)
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Erro ao criptografar:', error);
    throw new Error('Falha na criptografia');
  }
}

/**
 * Descriptografa um texto usando AES-256-CBC
 * @param {string} encryptedText - Texto criptografado (IV:dados)
 * @returns {string} - Texto descriptografado
 */
function decrypt(encryptedText) {
  try {
    // Separa o IV dos dados criptografados
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    // Cria o decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY_BUFFER, iv);
    
    // Descriptografa
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Erro ao descriptografar:', error);
    throw new Error('Falha na descriptografia');
  }
}

/**
 * Criptografa dados sensíveis de um objeto cliente
 * @param {Object} cliente - Objeto com dados do cliente
 * @returns {Object} - Objeto com dados sensíveis criptografados
 */
function encryptClienteData(cliente) {
  return {
    ...cliente,
    cpf: encrypt(cliente.cpf)
  };
}

/**
 * Descriptografa dados sensíveis de um objeto cliente
 * @param {Object} cliente - Objeto com dados criptografados
 * @returns {Object} - Objeto com dados descriptografados
 */
function decryptClienteData(cliente) {
  return {
    ...cliente,
    cpf: decrypt(cliente.cpf)
  };
}

module.exports = {
  encrypt,
  decrypt,
  encryptClienteData,
  decryptClienteData
};