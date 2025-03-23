# Nome do Projeto

Uma aplicação Node.js para autenticação via Azure AD, envio de e-mails com PDF anexado e registro de logs.  
Esta aplicação utiliza Express, Passport com estratégia Azure AD, Nodemailer para envio de e-mails e Multer para upload de arquivos.

## Sumário

- [Recursos](#recursos)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução](#execução)
- [Rotas Principais](#rotas-principais)
- [Logs](#logs)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Recursos

- **Autenticação via Azure AD:** Login, callback, logout e obtenção de dados do usuário.
- **Envio de E-mails:** Upload de arquivos PDF e envio por e-mail utilizando Nodemailer.
- **Upload de Arquivos:** Utilização de Multer para validar e armazenar PDFs.
- **Registro de Logs:** Logs customizados para rastreamento de eventos e erros.

## Estrutura do Projeto

```
project/
├── middlewares/
│   └── ensureAuthenticated.js      # Middleware para proteger rotas
├── routes/
│   ├── authRoutes.js               # Rotas de autenticação com Azure AD
│   ├── emailRoutes.js              # Rotas de upload e envio de e-mail
│   ├── logRoutes.js                # Rotas para registro de logs vindos do front-end
│   └── indexRoutes.js              # Rota raiz que serve o index.html
├── uploads/                        # Pasta para armazenar arquivos temporários (uploads)
├── public/                         # Arquivos estáticos (HTML, CSS, JS)
├── auth.js                         # Configuração do Passport/Azure AD
├── emailService.js                 # Serviço de envio de e-mail com Nodemailer
├── logger.js                       # Configuração do logger (ex.: Winston)
├── server.js                       # Ponto de entrada da aplicação
├── .env                            # Variáveis de ambiente
└── README.md                       # Este arquivo
```

## Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 14 ou superior)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- Acesso ao Azure AD para autenticação
- Credenciais SMTP para envio de e-mail

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/seu-projeto.git
   cd seu-projeto
   ```

2. Instale as dependências:

   ```bash
   npm install
   # ou
   yarn install
   ```

## Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

```dotenv
# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Session
SESSION_SECRET=sua_chave_secreta

# Azure AD
# (Configure de acordo com a sua integração com Azure AD)
CLIENT_ID=seu_client_id
CLIENT_SECRET=seu_client_secret
TENANT_ID=seu_tenant_id
REDIRECT_URI=https://seu-dominio.com/auth/callback

# SMTP (para envio de e-mails)
SMTP_HOST=smtp.seuprovedor.com
SMTP_PORT=587
SMTP_USER=seu-email@provedor.com
SMTP_PASS=sua_senha
SMTP_FROM=seu-email@provedor.com
```

> **Nota:** Ajuste as variáveis conforme a sua necessidade e ambiente de produção. Em produção, certifique-se de configurar os cookies com `secure: true` e revisar as configurações de TLS.

## Execução

Para iniciar o servidor, execute:

```bash
npm start
# ou, se estiver usando nodemon para desenvolvimento:
nodemon server.js
```

A aplicação ficará disponível em [http://localhost:3000](http://localhost:3000) (ou na porta definida em `.env`).

## Rotas Principais

- **Autenticação (Azure AD)**
  - `GET /auth/login`: Inicia o fluxo de autenticação.
  - `GET /auth/callback`: Callback do Azure AD após a autenticação.
  - `GET /auth/logout`: Efetua o logout do usuário.
  - `GET /auth/user`: Retorna dados do usuário autenticado.

- **Envio de E-mail**
  - `POST /api/enviar-email`: Rota protegida para upload de um PDF e envio de e-mail com o anexo.
    - Parâmetros esperados: `pdfFile` (arquivo PDF) e `emailDestino` (e-mail do destinatário).

- **Logs**
  - `POST /log`: Rota para registro de logs enviados pelo front-end.

- **Página Principal**
  - `GET /`: Serve o `index.html` da pasta `public`.

## Logs

Os logs são gerenciados por um módulo de logger (como o [Winston](https://github.com/winstonjs/winston)). Mensagens importantes e erros serão registrados, e podem ser visualizados no console ou em arquivos configurados.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests. Siga as boas práticas de código e mantenha a consistência com a estrutura atual do projeto.

## Licença

Distribuído sob a licença [MIT](https://opensource.org/licenses/MIT).

---

Este README oferece uma visão geral e orientações para configuração e uso do seu projeto. Lembre-se de atualizar as informações conforme as mudanças no projeto e as necessidades do seu ambiente.
