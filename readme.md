# 🌐 Middleware Web Service - Sistema de Clientes

## 📋 Descrição do Projeto

Este projeto implementa um **Middleware Web Service** que atua como ponte entre clientes externos e um sistema legado que processa apenas XML. O middleware oferece uma API REST moderna enquanto mantém compatibilidade com o sistema legado através de conversão JSON/XML e criptografia de dados sensíveis.

### 🎯 Objetivo Acadêmico

Desenvolvimento de um middleware que demonstra:
- Arquitetura de Web Services REST/RESTful
- Integração com sistemas legados via XML
- Implementação de criptografia para segurança de dados
- Boas práticas de desenvolvimento de APIs

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────┐
│  Cliente Externo    │
│ (Postman/Insomnia)  │
└──────────┬──────────┘
           │ JSON (HTTPS)
           │ Authorization: Bearer token
           ▼
┌─────────────────────┐
│   Middleware API    │
│   (REST/RESTful)    │
│  - Autenticação     │
│  - Validação        │
│  - Conversão        │
│  - Criptografia     │
└──────────┬──────────┘
           │ XML Criptografado
           ▼
┌─────────────────────┐
│  Sistema Legado     │
│   (Simulado)        │
│  - Processa XML     │
│  - Armazena dados   │
└─────────────────────┘
```

## 🚀 Tecnologias Utilizadas

| Tecnologia | Versão | Propósito |
|-----------|---------|-----------|
| **Node.js** | v14+ | Runtime JavaScript |
| **Express.js** | 4.18.2 | Framework web para API REST |
| **xml2js** | 0.6.2 | Conversão JSON ↔ XML |
| **crypto** | nativo | Criptografia AES-256-CBC |
| **dotenv** | 16.3.1 | Gerenciamento de variáveis de ambiente |
| **uuid** | 9.0.1 | Geração de IDs únicos |
| **axios** | 1.6.2 | Cliente HTTP para comunicação interna |

## 📦 Instalação e Configuração

### 1. Pré-requisitos

```bash
# Verificar versão do Node.js (deve ser 14+)
node --version

# Verificar npm
npm --version
```

### 2. Clone ou Crie o Projeto

```bash
# Criar diretório do projeto
mkdir middleware-webservice
cd middleware-webservice

# Inicializar Git (opcional)
git init
```

### 3. Criar Estrutura de Pastas

```bash
mkdir -p src/middleware src/legacy examples
```

### 4. Copiar Arquivos

Copie todos os arquivos fornecidos na documentação para a estrutura:

```
middleware-webservice/
├── src/
│   ├── middleware/
│   │   ├── server.js
│   │   ├── routes.js
│   │   ├── crypto.js
│   │   ├── xmlHandler.js
│   │   └── auth.js
│   └── legacy/
│       └── legacySystem.js
├── examples/
│   ├── cadastro-request.xml
│   └── consulta-response.xml
├── .env.example
├── .env
├── package.json
├── README.md
└── middleware-collection.json (Postman)
```

### 5. Instalar Dependências

```bash
npm install
```

### 6. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env (opcional - valores padrão já funcionam)
nano .env
```

**Conteúdo do .env:**

```env
PORT=3000
LEGACY_PORT=3001
LEGACY_SYSTEM_URL=http://localhost:3001
ENCRYPTION_KEY=minha-chave-super-secreta-12345
API_KEY=minha-api-key-segura-123
NODE_ENV=development
```

## 🎮 Como Executar

### Opção 1: Executar Servidores Separadamente

**Terminal 1 - Sistema Legado:**
```bash
npm run start:legacy
```

Saída esperada:
```
🏛️  Sistema Legado rodando em http://localhost:3001
📥 Endpoint: POST http://localhost:3001/processar
```

**Terminal 2 - Middleware API:**
```bash
npm start
```

Saída esperada:
```
🚀 Middleware API rodando em http://localhost:3000
📡 Endpoints disponíveis:
   POST http://localhost:3000/api/clientes
   GET  http://localhost:3000/api/clientes/:id

🔐 Use o header: Authorization: Bearer minha-api-key-segura-123
```

### Opção 2: Executar Ambos Juntos (Recomendado)

```bash
npm run dev
```

## 📡 Endpoints da API

### 1. Health Check

**GET** `/health`

Verifica se o servidor está funcionando.

```bash
curl http://localhost:3000/health
```

**Resposta:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

### 2. Cadastrar Cliente

**POST** `/api/clientes`

Cadastra um novo cliente no sistema.

**Headers:**
```
Authorization: Bearer minha-api-key-segura-123
Content-Type: application/json
```

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao.silva@email.com",
  "cpf": "12345678900"
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Authorization: Bearer minha-api-key-segura-123" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao.silva@email.com",
    "cpf": "12345678900"
  }'
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Cliente cadastrado com sucesso",
  "clienteId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

**Resposta de Erro - Validação (400):**
```json
{
  "success": false,
  "message": "CPF inválido. Deve conter 11 dígitos numéricos."
}
```

**Resposta de Erro - Autenticação (401):**
```json
{
  "success": false,
  "message": "API Key inválida"
}
```

---

### 3. Consultar Cliente

**GET** `/api/clientes/{id}`

Consulta os dados de um cliente pelo ID.

**Headers:**
```
Authorization: Bearer minha-api-key-segura-123
```

**Exemplo cURL:**
```bash
curl -X GET http://localhost:3000/api/clientes/a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  -H "Authorization: Bearer minha-api-key-segura-123"
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "cliente": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "nome": "João Silva",
    "email": "joao.silva@email.com",
    "cpf": "12345678900",
    "dataCadastro": "2025-01-15T10:30:00.000Z"
  }
}
```

**Resposta - Cliente Não Encontrado (404):**
```json
{
  "success": false,
  "message": "Cliente não encontrado"
}
```

## 🧪 Testando com Postman

### Importar Collection

1. Abra o Postman
2. Clique em **Import**
3. Selecione o arquivo `middleware-collection.json`
4. A collection será importada com todos os testes

### Executar Testes

1. **Health Check**: Verifica se o servidor está rodando
2. **Cadastrar Cliente**: Cria um novo cliente (salva o ID automaticamente)
3. **Consultar Cliente**: Usa o ID salvo para consultar
4. **Testes de Erro**: Valida comportamentos de erro

### Ordem Recomendada

```
1. Health Check
2. Cadastrar Cliente (João Silva)
3. Consultar Cliente (usa ID do João)
4. Cadastrar Maria Santos
5. Teste - Sem Autenticação (deve falhar)
6. Teste - CPF Inválido (deve falhar)
7. Teste - Cliente Não Encontrado (deve retornar 404)
```

## 🔐 Segurança Implementada

### 1. Autenticação via API Key

**Implementação:**
- Header: `Authorization: Bearer {API_KEY}`
- Validação em todas as rotas `/api/*`
- Chave armazenada em variável de ambiente

**Arquivo:** `src/middleware/auth.js`

### 2. Criptografia AES-256-CBC

**Características:**
- **Algoritmo**: AES (Advanced Encryption Standard)
- **Tamanho da Chave**: 256 bits
- **Modo**: CBC (Cipher Block Chaining)
- **IV**: Vector de inicialização gerado aleatoriamente para cada operação

**Dados Criptografados:**
- CPF dos clientes

**Formato de Armazenamento:**
```
{IV_hex}:{dados_criptografados_hex}
Exemplo: 3f8a9b2c4d5e6f1a2b3c4d5e:9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d
```

**Arquivo:** `src/middleware/crypto.js`

**Explicação Técnica:**

```javascript
// Criptografia
1. Gera IV aleatório (16 bytes)
2. Cria cipher com chave de 256 bits
3. Criptografa o texto
4. Retorna: IV + dados criptografados

// Descriptografia
1. Separa IV dos dados
2. Cria decipher com a mesma chave
3. Descriptografa usando o IV original
4. Retorna texto original
```

### 3. HTTPS em Produção

Para produção, configure certificados SSL:

```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

https.createServer(options, app).listen(443);
```

**Obter Certificado:**
- Desenvolvimento: Certificado autoassinado
- Produção: Let's Encrypt (gratuito) ou certificado comercial

## 📄 Exemplos de XML

### Requisição de Cadastro

```xml
<?xml version="1.0" encoding="UTF-8"?>
<requisicao>
  <tipo>CADASTRO_CLIENTE</tipo>
  <timestamp>2025-01-15T10:30:00.000Z</timestamp>
  <dados>
    <cliente>
      <id>a1b2c3d4-e5f6-7890-abcd-ef1234567890</id>
      <nome>João Silva</nome>
      <email>joao.silva@email.com</email>
      <cpf_criptografado>3f8a9b2c4d5e6f1a2b3c4d5e:9a8b7c6d...</cpf_criptografado>
      <dataCadastro>2025-01-15T10:30:00.000Z</dataCadastro>
    </cliente>
  </dados>
</requisicao>
```

### Resposta de Consulta

```xml
<?xml version="1.0" encoding="UTF-8"?>
<resposta>
  <status>SUCCESS</status>
  <timestamp>2025-01-15T10:31:00.000Z</timestamp>
  <dados>
    <cliente>
      <id>a1b2c3d4-e5f6-7890-abcd-ef1234567890</id>
      <nome>João Silva</nome>
      <email>joao.silva@email.com</email>
      <cpf_criptografado>3f8a9b2c4d5e6f1a2b3c4d5e:9a8b7c6d...</cpf_criptografado>
      <dataCadastro>2025-01-15T10:30:00.000Z</dataCadastro>
    </cliente>
  </dados>
</resposta>
```

## 🔄 Fluxo de Dados Completo

### Cadastro de Cliente

```
1. Cliente envia JSON via POST
   ↓
2. Middleware valida autenticação (API Key)
   ↓
3. Middleware valida dados (nome, email, CPF)
   ↓
4. Middleware gera UUID para o cliente
   ↓
5. Middleware criptografa CPF (AES-256)
   ↓
6. Middleware converte JSON → XML
   ↓
7. Middleware envia XML ao Sistema Legado
   ↓
8. Sistema Legado processa e armazena
   ↓
9. Sistema Legado retorna XML de confirmação
   ↓
10. Middleware converte XML → JSON
    ↓
11. Middleware retorna resposta ao Cliente
```

### Consulta de Cliente

```
1. Cliente envia GET com ID
   ↓
2. Middleware valida autenticação
   ↓
3. Middleware valida formato do UUID
   ↓
4. Middleware cria XML de requisição
   ↓
5. Middleware envia ao Sistema Legado
   ↓
6. Sistema Legado busca no banco
   ↓
7. Sistema Legado retorna XML com dados criptografados
   ↓
8. Middleware converte XML → JSON
   ↓
9. Middleware descriptografa CPF
   ↓
10. Middleware retorna JSON ao Cliente
```

## ✅ Funcionalidades Implementadas

### Requisitos Obrigatórios
- ✅ Arquitetura de 3 camadas (Cliente → Middleware → Legado)
- ✅ API REST/RESTful com Express.js
- ✅ Conversão JSON ↔ XML (xml2js)
- ✅ Criptografia AES-256-CBC de dados sensíveis
- ✅ Autenticação via API Key
- ✅ Sistema legado simulado
- ✅ Endpoint POST /api/clientes (cadastro)
- ✅ Endpoint GET /api/clientes/:id (consulta)

### Validações
- ✅ Validação de campos obrigatórios
- ✅ Validação de formato de CPF (11 dígitos)
- ✅ Validação de formato de email
- ✅ Validação de UUID
- ✅ Validação de API Key

### Segurança
- ✅ Criptografia de dados sensíveis
- ✅ Autenticação em todas as rotas da API
- ✅ Tratamento de erros
- ✅ Logging de operações
- ✅ Preparado para HTTPS

### Extras Implementados
- ✅ Geração automática de IDs (UUID v4)
- ✅ Timestamps em todas as operações
- ✅ Banco de dados em memória no sistema legado
- ✅ Endpoint de health check
- ✅ Testes automáticos na Postman Collection
- ✅ Logs coloridos e informativos
- ✅ Documentação completa

## 📚 Referências Bibliográficas

Este projeto foi desenvolvido baseado nos seguintes capítulos:

### Capítulo 9: Web Services (Coulouris)
- Arquitetura REST
- APIs RESTful
- Protocolo HTTP
- Conversão de dados (JSON/XML)

### Capítulo 13: Segurança (Coulouris)
- Criptografia simétrica (AES)
- Autenticação e autorização
- Segurança em comunicação
- Boas práticas de segurança

## 📸 Capturas de Tela

### 1. Cadastro de Cliente (POST)

**Request:**
```
POST http://localhost:3000/api/clientes
Authorization: Bearer minha-api-key-segura-123
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao.silva@email.com",
  "cpf": "12345678900"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cliente cadastrado com sucesso",
  "clienteId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### 2. Consulta de Cliente (GET)

**Request:**
```
GET http://localhost:3000/api/clientes/a1b2c3d4-e5f6-7890-abcd-ef1234567890
Authorization: Bearer minha-api-key-segura-123
```

**Response:**
```json
{
  "success": true,
  "cliente": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "nome": "João Silva",
    "email": "joao.silva@email.com",
    "cpf": "12345678900",
    "dataCadastro": "2025-01-15T10:30:00.000Z"
  }
}
```

### 3. Logs do Sistema

**Terminal Middleware:**
```
🚀 Middleware API rodando em http://localhost:3000
📡 Endpoints disponíveis:
   POST http://localhost:3000/api/clientes
   GET  http://localhost:3000/api/clientes/:id

🔐 Use o header: Authorization: Bearer minha-api-key-segura-123

[2025-01-15T10:30:00.000Z] POST /api/clientes
📤 Enviando XML ao sistema legado:
<?xml version="1.0" encoding="UTF-8"?>
<requisicao>
  <tipo>CADASTRO_CLIENTE</tipo>
...
📥 Resposta do sistema legado: SUCCESS
```

**Terminal Sistema Legado:**
```
🏛️  Sistema Legado rodando em http://localhost:3001
📥 Endpoint: POST http://localhost:3001/processar

🏛️  Sistema Legado - Requisição recebida
📋 Tipo: CADASTRO_CLIENTE
✅ Cliente cadastrado: João Silva (ID: a1b2c3d4-...)
📤 Resposta enviada
```

## 🐛 Troubleshooting

### Erro: "EADDRINUSE: address already in use"

**Problema:** Porta já está em uso.

**Solução:**
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### Erro: "Sistema legado indisponível"

**Problema:** Sistema legado não está rodando.

**Solução:**
```bash
# Inicie o sistema legado primeiro
npm run start:legacy

# Depois inicie o middleware
npm start
```

### Erro de Autenticação

**Problema:** API Key incorreta.

**Solução:**
- Verifique o header: `Authorization: Bearer minha-api-key-segura-123`
- Confirme a chave no arquivo `.env`

## 📝 Notas de Implementação

### Armazenamento de Dados

O sistema legado usa **Map** para armazenamento em memória:
- Dados são perdidos ao reiniciar o servidor
- Para persistência, implemente banco de dados (MongoDB, PostgreSQL, etc.)

### Melhorias Futuras

1. **Persistência de Dados**
   - Implementar banco de dados real
   - Migrations e seeds

2. **Autenticação Avançada**
   - JWT (JSON Web Tokens)
   - OAuth 2.0
   - Rate limiting

3. **Validação**
   - Biblioteca Joi ou Yup
   - Validação de CPF real (dígitos verificadores)

4. **Logs**
   - Winston ou Bunyan
   - Logs estruturados em arquivo

5. **Testes**
   - Jest para testes unitários
   - Supertest para testes de integração

6. **Deploy**
   - Docker e Docker Compose
   - CI/CD com GitHub Actions
   - Deploy em AWS/Azure/Heroku

## 👨‍💻 Autor

**Fernão Queiroz Ferreira**  
**Matrícula:** 20231002802947  
**Curso:** Ciência da Computação 
**Disciplina:** Sistemas Distribuídos  

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.

MIT License - Copyright (c) 2025

---

## 🔗 Links Úteis

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [xml2js GitHub](https://github.com/Leonidas-from-XIV/node-xml2js)
- [Postman Learning Center](https://learning.postman.com/)
- [AES Encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)

---

**Data de Entrega:** [Inserir data]  
**Versão:** 1.0.0  
**Última Atualização:** Janeiro 2025
