const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { jsonToXml, xmlToJson } = require('./xmlHandler');
const { encryptClienteData, decryptClienteData } = require('./crypto');
const axios = require('axios');

// URL do sistema legado (pode ser configurada via .env)
const LEGACY_SYSTEM_URL = process.env.LEGACY_SYSTEM_URL || 'http://localhost:3001';

/**
 * POST /api/clientes
 * Cadastra um novo cliente
 */
router.post('/clientes', async (req, res) => {
  try {
    const { nome, email, cpf } = req.body;

    // Validação básica
    if (!nome || !email || !cpf) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: nome, email, cpf'
      });
    }

    // Validação de CPF (apenas números e 11 dígitos)
    if (!/^\d{11}$/.test(cpf)) {
      return res.status(400).json({
        success: false,
        message: 'CPF inválido. Deve conter 11 dígitos numéricos.'
      });
    }

    // Validação de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido'
      });
    }

    // Gera ID único
    const clienteId = uuidv4();

    // Prepara dados do cliente
    const clienteData = {
      id: clienteId,
      nome,
      email,
      cpf,
      dataCadastro: new Date().toISOString()
    };

    // Criptografa dados sensíveis (CPF)
    const clienteDataCriptografado = encryptClienteData(clienteData);

    // Monta o objeto para conversão em XML
    const requisicaoObj = {
      requisicao: {
        tipo: 'CADASTRO_CLIENTE',
        timestamp: new Date().toISOString(),
        dados: {
          cliente: {
            id: clienteDataCriptografado.id,
            nome: clienteDataCriptografado.nome,
            email: clienteDataCriptografado.email,
            cpf_criptografado: clienteDataCriptografado.cpf,
            dataCadastro: clienteDataCriptografado.dataCadastro
          }
        }
      }
    };

    // Converte para XML
    const xmlRequisicao = jsonToXml(requisicaoObj);

    console.log('\n📤 Enviando XML ao sistema legado:');
    console.log(xmlRequisicao.substring(0, 300) + '...\n');

    // Envia ao sistema legado
    const legacyResponse = await axios.post(`${LEGACY_SYSTEM_URL}/processar`, xmlRequisicao, {
      headers: {
        'Content-Type': 'application/xml'
      }
    });

    // Converte resposta XML para JSON
    const respostaJson = await xmlToJson(legacyResponse.data);

    console.log('📥 Resposta do sistema legado:', respostaJson.resposta.status);

    // Retorna resposta ao cliente
    res.status(201).json({
      success: true,
      message: 'Cliente cadastrado com sucesso',
      clienteId: clienteId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erro ao cadastrar cliente:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao cadastrar cliente',
      error: error.message
    });
  }
});

/**
 * GET /api/clientes/:id
 * Consulta dados de um cliente
 */
router.get('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validação de UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    // Monta requisição XML para consulta
    const requisicaoObj = {
      requisicao: {
        tipo: 'CONSULTA_CLIENTE',
        timestamp: new Date().toISOString(),
        dados: {
          clienteId: id
        }
      }
    };

    const xmlRequisicao = jsonToXml(requisicaoObj);

    console.log('\n📤 Consultando cliente no sistema legado...');

    // Envia ao sistema legado
    const legacyResponse = await axios.post(`${LEGACY_SYSTEM_URL}/processar`, xmlRequisicao, {
      headers: {
        'Content-Type': 'application/xml'
      }
    });

    // Converte resposta XML para JSON
    const respostaJson = await xmlToJson(legacyResponse.data);

    console.log('📥 Resposta do legado:', JSON.stringify(respostaJson, null, 2));

    // Verifica o status da resposta
    const status = respostaJson.resposta.status;
    
    if (status === 'NOT_FOUND' || !respostaJson.resposta.dados) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    // Extrai dados do cliente da resposta
    const clienteCriptografado = respostaJson.resposta.dados.cliente;

    // Descriptografa dados sensíveis
    const clienteDescriptografado = decryptClienteData({
      id: clienteCriptografado.id,
      nome: clienteCriptografado.nome,
      email: clienteCriptografado.email,
      cpf: clienteCriptografado.cpf_criptografado,
      dataCadastro: clienteCriptografado.dataCadastro
    });

    console.log('📥 Cliente encontrado:', clienteDescriptografado.nome);

    // Retorna resposta ao cliente
    res.json({
      success: true,
      cliente: clienteDescriptografado
    });

  } catch (error) {
    console.error('❌ Erro ao consultar cliente:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'Sistema legado indisponível'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao consultar cliente',
      error: error.message
    });
  }
});

module.exports = router;