const nodemailer = require("nodemailer");
const fs = require("fs");
const logger = require("./logger");
require("dotenv").config(); // Carregar variáveis de ambiente

// Configurar o transporte SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // StartTLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false // Pode ser útil para debug
    },
    //debug: true, // Habilita logs detalhados
    logger: true // Exibe logs no console
});

// Testar conexão com SMTP
transporter.verify((error, success) => {
    logger.info(`Criando transporte SMTP para ${process.env.SMTP_HOST}:${process.env.SMTP_PORT} com o usuário ${process.env.SMTP_USER}`);

    if (error) {
        logger.error(`❌ Erro na conexão com SMTP: ${error.message}`);
    } else {
        logger.info(`✅ Conexão com SMTP estabelecida!`);
    }
});

// Função para enviar e-mail
async function enviarEmail(emailDestino, pdfPath, pdfFilename) {
    try {        
        logger.info(`📨 Iniciando envio de e-mail para: ${emailDestino}`);

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: emailDestino,
            subject: "Criação de Novo Usuário",
            text: "A criação do novo usuário foi concluída com sucesso. As informações de acesso estão em anexo para consulta.",
            attachments: [{
                filename: pdfFilename,
                path: pdfPath
            }]
        };

        // Log de detalhes do mailOptions (cuidado para não logar informações sensíveis)
        logger.debug(`Detalhes do e-mail: ${JSON.stringify({ to: mailOptions.to, subject: mailOptions.subject, filename: pdfFilename })}`);

        const result = await transporter.sendMail(mailOptions);

        // Log detalhado da resposta SMTP
        logger.debug(`📩 Resposta do servidor SMTP: ${JSON.stringify(result)}`);        

        // Após o envio, remove o arquivo temporário
        fs.unlinkSync(pdfPath);

        // Você pode também logar que o arquivo foi excluído com sucesso:
        logger.info(`Arquivo ${pdfFilename} removido do servidor após envio.`);

    } catch (error) {        
        logger.error(`❌ Erro ao enviar e-mail: ${error.message}`);        
        logger.error(`🛑 Erro completo: ${JSON.stringify(error, null, 2)}`);
        throw error;
    }
}


module.exports = enviarEmail;
