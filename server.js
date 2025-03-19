const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Permitir requisições do frontend
app.use(cors());

// Configuração do Multer para armazenar arquivos temporariamente
const upload = multer({ dest: "uploads/" });

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "public")));

// Rota principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Configurar o transporte SMTP para envio de e-mails
const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // O Outlook usa TLS e não SSL
    auth: {
        user: "EMAIL", // Seu e-mail do Outlook
        pass: "senha" // Senha do e-mail (ou senha de app)
    }
});


// Rota para receber o PDF e enviar por e-mail
app.post("/enviar-email", upload.single("pdfFile"), (req, res) => {
    const { emailDestino } = req.body;
    const pdfPath = req.file.path;

    const mailOptions = {
        from: "erick.prado@sfiems.com.br",
        to: emailDestino,
        subject: "Criação de Novo Usuário",
        text: "A criação do novo usuário foi concluída com sucesso. As informações de acesso estão em anexo para consulta.",
        attachments: [
            {
                filename: "Login e Senha Novo Colaborador.pdf",
                path: pdfPath
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        fs.unlinkSync(pdfPath); // Remove o arquivo após envio
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro ao enviar e-mail." });
        }
        res.status(200).json({ message: "E-mail enviado com sucesso!" });
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
