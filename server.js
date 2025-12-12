const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const { authenticateAPIKey } = require('./auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsing de JSON
app.use(express.json());

// Middleware de log
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Middleware de autenticação (aplicado em todas as rotas /api/*)
app.use('/api/*', authenticateAPIKey);

// Rotas da API
app.use('/api', routes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Middleware API rodando em http://localhost:${PORT}`);
  console.log(`📡 Endpoints disponíveis:`);
  console.log(`   POST http://localhost:${PORT}/api/clientes`);
  console.log(`   GET  http://localhost:${PORT}/api/clientes/:id`);
  console.log(`\n🔐 Use o header: Authorization: Bearer ${process.env.API_KEY}`);
});

module.exports = app;
