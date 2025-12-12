const express = require('express');
const xml2js = require('xml2js');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.LEGACY_PORT || 3001;

// In-memory storage para clientes
const clientes = {};

// Middleware para parsing de JSON
app.use(express.json());

// Middleware de log
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// POST endpoint para processar requisições XML do middleware
app.post('/processar', express.text({ type: 'application/xml' }), async (req, res) => {
  try {
    console.log('📥 Requisição XML recebida:', req.body.substring(0, 200) + '...');

    // Parse XML para JSON
    const parser = new xml2js.Parser();
    const jsonReq = await parser.parseStringPromise(req.body);
    
    const requisicao = jsonReq.requisicao;
    const tipo = requisicao.tipo[0];
    
    if (tipo === 'CADASTRO_CLIENTE') {
      // Extrai dados do cliente
      const cliente = requisicao.dados[0].cliente[0];
      const clienteId = cliente.id[0];
      
      // Armazena no in-memory storage
      clientes[clienteId] = {
        id: clienteId,
        nome: cliente.nome[0],
        email: cliente.email[0],
        cpf_criptografado: cliente.cpf_criptografado[0],
        dataCadastro: cliente.dataCadastro[0]
      };
      
      console.log(`✅ Cliente ${clienteId} armazenado com sucesso`);
      
      const xmlResposta = `<?xml version="1.0" encoding="UTF-8"?>
      <resposta>
        <status>sucesso</status>
        <mensagem>Cliente cadastrado com sucesso</mensagem>
        <clienteId>${clienteId}</clienteId>
        <timestamp>${new Date().toISOString()}</timestamp>
      </resposta>`;
      
      res.set('Content-Type', 'application/xml');
      res.status(200).send(xmlResposta);
    } else if (tipo === 'CONSULTA_CLIENTE') {
      const clienteId = requisicao.dados[0].clienteId[0];
      const cliente = clientes[clienteId];

      let resposta;
      if (!cliente) {
        resposta = {
          resposta: {
            status: 'NOT_FOUND',
            mensagem: 'Cliente não encontrado',
            timestamp: new Date().toISOString()
          }
        };
      } else {
        resposta = {
          resposta: {
            status: 'sucesso',
            mensagem: 'Cliente encontrado',
            dados: { cliente },
            timestamp: new Date().toISOString()
          }
        };
      }

      const builder = new xml2js.Builder({ xmldec: { version: '1.0', encoding: 'UTF-8' } });
      const xmlResposta = builder.buildObject(resposta);

      res.set('Content-Type', 'application/xml');
      res.status(cliente ? 200 : 404).send(xmlResposta);
    }

  } catch (error) {
    console.error('Erro ao processar XML:', error);

    const xmlErro = `<?xml version="1.0" encoding="UTF-8"?>
      <resposta>
        <status>erro</status>
        <mensagem>${error.message}</mensagem>
      </resposta>`;

    res.set('Content-Type', 'application/xml');
    res.status(500).send(xmlErro);
  }
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// GET endpoint para recuperar cliente pelo ID
app.get('/clientes/:id', (req, res) => {
  const { id } = req.params;
  
  if (clientes[id]) {
    res.status(200).json({
      success: true,
      cliente: clientes[id]
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Cliente não encontrado'
    });
  }
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
  console.log(`🚀 Sistema Legado rodando em http://localhost:${PORT}`);
  console.log(`📡 Endpoints disponíveis:`);
  console.log(`   POST http://localhost:${PORT}/processar (recebe XML do middleware)`);
  console.log(`   GET  http://localhost:${PORT}/clientes/:id`);
});

module.exports = app;